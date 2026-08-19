-- Create database
CREATE DATABASE sense_platform;

-- Connect to database
\c sense_platform;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sensors table
CREATE TABLE IF NOT EXISTS sensors (
  id SERIAL PRIMARY KEY,
  serial_number VARCHAR(50) UNIQUE NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  sector VARCHAR(50),
  status VARCHAR(20) DEFAULT 'OFFLINE',
  uptime VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data sensors
INSERT INTO sensors (serial_number, device_type, sector, status, uptime) VALUES
  ('ESP32-PWR-99A1', 'Power Sensor', 'SECTOR A', 'ONLINE', '45d 12h 52m'),
  ('ESP32-PWR-99A2', 'Power Sensor', 'SECTOR A', 'OFFLINE', NULL),
  ('ESP32-TMP-44B1', 'Temp Sensor', 'SECTOR B', 'ONLINE', '112d 64h 15m'),
  ('ESP32-TMP-44B2', 'Temp Sensor', 'SECTOR B', 'ONLINE', '112d 64h 11m');

-- Insert admin user (password: admin123)
INSERT INTO users (username, password, full_name, role) VALUES 
  ('admin', '$2a$10$7y9VQKix9QZoVZzR8QHn5.6vZJuqO2jFqy9VQKix9QZoVZzR8QHn5', 'Administrator', 'admin');