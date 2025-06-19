import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all users
router.get('/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { search, role, status } = req.query;
    
    let query = `
      SELECT u.*, 
             COUNT(d.id) as document_count
      FROM users u 
      LEFT JOIN documents d ON u.id = d.user_id 
      WHERE 1=1
    `;
    const queryParams = [];

    if (search) {
      query += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (role) {
      query += ` AND u.role = ?`;
      queryParams.push(role);
    }

    if (status && role === 'doctor') {
      query += ` AND u.verification_status = ?`;
      queryParams.push(status);
    }

    query += ` GROUP BY u.id ORDER BY u.created_at DESC`;

    const [users] = await pool.execute(query, queryParams);

    // Remove passwords
    users.forEach(user => delete user.password);

    res.json({ users });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get user details with documents
router.get('/users/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const userId = req.params.id;

    // Get user data
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    delete user.password;

    // Get documents if user is a doctor
    if (user.role === 'doctor') {
      const [documents] = await pool.execute(
        'SELECT * FROM documents WHERE user_id = ?',
        [userId]
      );
      user.documents = documents;
    }

    res.json({ user });

  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to get user details' });
  }
});

// Update doctor verification status
router.put('/users/:id/verification', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid verification status' });
    }

    await pool.execute(
      'UPDATE users SET verification_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND role = ?',
      [status, userId, 'doctor']
    );

    res.json({ message: 'Verification status updated successfully' });

  } catch (error) {
    console.error('Update verification error:', error);
    res.status(500).json({ error: 'Failed to update verification status' });
  }
});

// Get dashboard stats
router.get('/stats', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const [totalUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [totalDoctors] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = ?', ['doctor']);
    const [totalPatients] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = ?', ['patient']);
    const [pendingVerifications] = await pool.execute(
      'SELECT COUNT(*) as count FROM users WHERE role = ? AND verification_status = ?',
      ['doctor', 'pending']
    );

    res.json({
      totalUsers: totalUsers[0].count,
      totalDoctors: totalDoctors[0].count,
      totalPatients: totalPatients[0].count,
      pendingVerifications: pendingVerifications[0].count
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;