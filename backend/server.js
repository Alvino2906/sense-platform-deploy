require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const sensorRoutes = require('./routes/sensors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);

// Create tables if not exists
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sensors (
        id SERIAL PRIMARY KEY,
        serial_number VARCHAR(50) UNIQUE NOT NULL,
        device_type VARCHAR(50) NOT NULL,
        sector VARCHAR(50),
        status VARCHAR(20) DEFAULT 'OFFLINE',
        uptime VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample data
    await pool.query(`
      INSERT INTO sensors (serial_number, device_type, sector, status, uptime)
      VALUES 
        ('ESP32-PWR-99A1', 'Power Sensor', 'SECTOR A', 'ONLINE', '45d 12h 52m'),
        ('ESP32-PWR-99A2', 'Power Sensor', 'SECTOR A', 'OFFLINE', NULL),
        ('ESP32-TMP-44B1', 'Temp Sensor', 'SECTOR B', 'ONLINE', '112d 64h 15m'),
        ('ESP32-TMP-44B2', 'Temp Sensor', 'SECTOR B', 'ONLINE', '112d 64h 11m')
      ON CONFLICT (serial_number) DO NOTHING
    `);

    // Insert default admin if not exists
    const adminCheck = await pool.query("SELECT * FROM users WHERE username = 'admin'");
    if (adminCheck.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (username, password, full_name, role) VALUES ($1, $2, $3, $4)',
        ['admin', hashedPassword, 'Administrator', 'admin']
      );
    }

    console.log('✅ Database initialized');
  } catch (err) {
    console.error('DB init error:', err);
  }
};

initDB();

app.listen(PORT, () => {
  console.log(`✅ SENSE Platform running on port ${PORT}`);
});