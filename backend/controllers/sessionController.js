//control how the data is used and displayed and contain the logic
const pool = require('../db');

// Get all sessions
const getAllSessions = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sessions');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new session
const createSession = async (req, res) => {
  const { therapist_id, client_id, notes, date, length } = req.body;

  if(!therapist_id || !client_id) {
    return res.status(400).json({
      error:'Both therapist_id and client_id are required',
      received: req.body
    })
  }

  try {
    const [rows] = await pool.query(
      'INSERT INTO sessions (therapist_id, client_id, notes, date, length) VALUES (?,?,?,?,?) RETURNING *',
      [therapist_id, client_id, notes, date, length]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a session
const updateSession = async (req, res) => {
  const { id } = req.params;
  const { therapist_id, client_id, notes, date, length } = req.body;
  try {
    await pool.query(
      'UPDATE sessions SET therapist_id = ?, client_id = ?, notes = ?, date = ?, length = ? WHERE id = ?',
      [therapist_id, client_id, notes, date, length, id]
    );

    // Fetch the updated session
    const [rows] = await pool.query('SELECT * FROM sessions WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating session:', err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a session
const deleteSession = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('DELETE FROM sessions WHERE id = ? RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json({ message: 'Session deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllSessions,
  createSession,
  updateSession,
  deleteSession,
};