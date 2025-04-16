//control how the data is used and displayed and contain the logic
const pool = require('../db');

// Get all clients
const getAllClients = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clients');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a single client by ID
const getClientByID = async (req, res) => {
  const { id } = req.params;
  try {
      const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [id]);
      if (rows.length === 0) {
          return res.status(404).json({ message: 'Client not found' });
      }
      res.json(rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
};

// Add a new client
const createClient = async (req, res) => {
  const { name, email, phone, regularity } = req.body;
  console.log('Request Body:', req.body); // Log the request body

  const [insertResult] = await pool.query(
  'INSERT INTO clients (name, email, phone, regularity) VALUES (?, ?, ?, ?)',
  [name, email, phone, regularity]
);
const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [insertResult.insertId]);
res.status(201).json(rows[0]);
 
};

// Update a client
const updateClient = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, regularity } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE clients SET name = ?, email = ?, phone = ?, regularity = ? WHERE id = ?',
            [name, email, phone, regularity, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({ id, name, email, phone, regularity });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a client
const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM clients WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({ message: 'Client deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllClients,
    createClient,
    updateClient,
    deleteClient,
    getClientByID
};