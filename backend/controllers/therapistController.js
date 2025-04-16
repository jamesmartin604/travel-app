//control how the data is used and displayed and contain the logic
const pool = require('../db');

// Get all albums
const getAllTherapists = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM therapists');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new therapist
const createTherapist = async (req, res) => {
  const { title, name, email, location, years_of_practise, availability } = req.body;
  try {
    const [rows] = await pool.query(
      'INSERT INTO therapists (title, name, email, location, years_of_practise, availability) VALUES (?,?,?,?,?,?) RETURNING *',
      [title, name, email, location, years_of_practise, availability]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a therapist
const updateTherapist = async (req, res) => {
  const { id } = req.params;
  const { title, name, email, location, years_of_practise, availability } = req.body;
  try {
    await pool.query(
      'UPDATE therapists SET title = ?, name = ?, email = ?, location = ?, years_of_practise = ?, availability = ? WHERE id = ?',
      [title, name, email, location, years_of_practise, availability, id]
    );

    // Fetch the updated therapist
    const [rows] = await pool.query('SELECT * FROM therapists WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Therapist not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// Delete a therapist
const deleteTherapist = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('DELETE FROM therapists WHERE id = ? RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Therapist not found' });
    }
    res.json({ message: 'Therapist deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllTherapists,
  createTherapist,
  updateTherapist,
  deleteTherapist,
};