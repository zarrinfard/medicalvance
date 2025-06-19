import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Register
router.post('/register', upload.fields([
  { name: 'documents', maxCount: 10 },
  { name: 'profileImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      specialty,
      country,
      dateOfBirth,
      gender
    } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role,
      phone: phone || null,
      specialty: role === 'doctor' ? specialty : null,
      country: role === 'doctor' ? country : null,
      date_of_birth: role === 'patient' ? dateOfBirth : null,
      gender: role === 'patient' ? gender : null,
      profile_image: req.files?.profileImage?.[0]?.filename || null
    };

    // Insert user
    const [result] = await pool.execute(`
      INSERT INTO users (
        email, password, first_name, last_name, role, phone,
        specialty, country, date_of_birth, gender, profile_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userData.email,
      userData.password,
      userData.first_name,
      userData.last_name,
      userData.role,
      userData.phone,
      userData.specialty,
      userData.country,
      userData.date_of_birth,
      userData.gender,
      userData.profile_image
    ]);

    const userId = result.insertId;

    // Handle document uploads for doctors
    if (role === 'doctor' && req.files?.documents) {
      for (const file of req.files.documents) {
        await pool.execute(`
          INSERT INTO documents (user_id, name, type, file_path)
          VALUES (?, ?, ?, ?)
        `, [userId, file.originalname, file.mimetype, file.filename]);
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Get complete user data
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    const user = users[0];
    delete user.password;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user from database
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    delete user.password;

    res.json({
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = { ...req.user };
    delete user.password;
    
    // Get documents for doctors
    if (user.role === 'doctor') {
      const [documents] = await pool.execute(
        'SELECT id, name, type, file_path, uploaded_at FROM documents WHERE user_id = ?',
        [user.id]
      );
      user.documents = documents;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

export default router;