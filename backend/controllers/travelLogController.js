//control how the data is used and displayed and contain the logic
const pool = require('../db');

// Get all travelLogs
const getAllTravelLogs = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM travel_logs');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a single travel log by ID
const getTravelLogById = async (req, res) => {
  const { id } = req.params;
  try {
      const [rows] = await pool.query('SELECT * FROM travel_logs WHERE id = ?', [id]);
      if (rows.length === 0) {
          return res.status(404).json({ message: 'Travel Log not found' });
      }
      res.json(rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
};

// Add a new travel log
const createTravelLog = async (req, res) => {
  const { title, description, start_date, end_date, post_date, tags } = req.body;
  console.log('Request Body:', req.body); // Log the request body

  const [insertResult] = await pool.query(
  'INSERT INTO travel_logs (title, description, start_date, end_date, post_date, tags) VALUES (?, ?, ?, ?, ?, ?)',
  [title, description, start_date, end_date, post_date, tags]
);
const [rows] = await pool.query('SELECT * FROM travel_logs WHERE id = ?', [insertResult.insertId]);
res.status(201).json(rows[0]);
 
};

// Update a travel log
const updateTravelLog = async (req, res) => {
    const { id } = req.params;
    const { title, description, start_date, end_date, post_date, tags } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE travel_logs SET title = ?, description = ?, start_date = ?, end_date = ?, post_date = ?, tags = ? WHERE id = ?',
            [title, description, start_date, end_date, post_date, tags, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Travel Log not found' });
        }
        res.json({ title, description, start_date, end_date, post_date, tags });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a travel log
const deleteTravelLog = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM travel_logs WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Travel Log not found' });
        }
        res.json({ message: 'Travel Log deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllTravelLogs,
    createTravelLog,
    updateTravelLog,
    deleteTravelLog,
    getTravelLogById
};