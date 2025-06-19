import pool from './database.js';

const initDatabase = async () => {
  try {
    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role ENUM('doctor', 'patient', 'admin') NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_verified BOOLEAN DEFAULT FALSE,
        profile_image VARCHAR(500),
        
        -- Doctor specific fields
        specialty VARCHAR(100),
        country VARCHAR(100),
        verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
        license_number VARCHAR(100),
        years_of_experience INT,
        about TEXT,
        
        -- Patient specific fields
        date_of_birth DATE,
        gender ENUM('male', 'female', 'other'),
        emergency_contact VARCHAR(20),
        
        -- Admin specific fields
        permissions JSON,
        
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_verification_status (verification_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create documents table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Insert default admin user
    const adminExists = await pool.execute(
      'SELECT id FROM users WHERE email = ? AND role = ?',
      ['admin@medicalvance.com', 'admin']
    );

    if (adminExists[0].length === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await pool.execute(`
        INSERT INTO users (email, password, first_name, last_name, role, permissions, is_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        'admin@medicalvance.com',
        hashedPassword,
        'Admin',
        'User',
        'admin',
        JSON.stringify(['manage_users', 'verify_doctors', 'view_analytics']),
        true
      ]);
      
      console.log('✅ Default admin user created');
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
};

export default initDatabase;