const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all sensors
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sensors ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get sensor stats
router.get('/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'ONLINE' THEN 1 ELSE 0 END) as online,
        SUM(CASE WHEN status = 'OFFLINE' THEN 1 ELSE 0 END) as offline
      FROM sensors
    `);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update sensor status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE sensors SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;