const pool = require('../db');

// Get all travel logs for the current user
const getAllTravelLogs = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM travel_logs WHERE user_id = ?',
            [req.user.userId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a single travel log by ID (only if owned by user)
const getTravelLogById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM travel_logs WHERE id = ? AND user_id = ?',
            [id, req.user.userId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ 
                message: 'Travel Log not found or you do not have permission to access it' 
            });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add a new travel log for the current user
const createTravelLog = async (req, res) => {
    const { title, description, start_date, end_date, post_date, tags } = req.body;
    console.log('Request Body:', req.body); // Log the request body

    try {
        const [insertResult] = await pool.query(
            'INSERT INTO travel_logs (title, description, start_date, end_date, post_date, tags, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, start_date, end_date, post_date, tags, req.user.userId]
        );
        
        const [rows] = await pool.query(
            'SELECT * FROM travel_logs WHERE id = ? AND user_id = ?',
            [insertResult.insertId, req.user.userId]
        );
        
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a travel log (only if owned by user)
const updateTravelLog = async (req, res) => {
    const { id } = req.params;
    const { title, description, start_date, end_date, post_date, tags } = req.body;
    
    try {
        // First check if the travel log exists and belongs to the user
        const [checkResult] = await pool.query(
            'SELECT * FROM travel_logs WHERE id = ? AND user_id = ?',
            [id, req.user.userId]
        );
        
        if (checkResult.length === 0) {
            return res.status(404).json({ 
                message: 'Travel Log not found or you do not have permission to modify it' 
            });
        }

        // Proceed with update if ownership is confirmed
        const [updateResult] = await pool.query(
            'UPDATE travel_logs SET title = ?, description = ?, start_date = ?, end_date = ?, post_date = ?, tags = ? WHERE id = ? AND user_id = ?',
            [title, description, start_date, end_date, post_date, tags, id, req.user.userId]
        );
        
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Travel Log not found' });
        }
        
        res.json({ title, description, start_date, end_date, post_date, tags });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a travel log (only if owned by user)
const deleteTravelLog = async (req, res) => {
    const { id } = req.params;
    try {
        // First check if the travel log exists and belongs to the user
        const [checkResult] = await pool.query(
            'SELECT * FROM travel_logs WHERE id = ? AND user_id = ?',
            [id, req.user.userId]
        );
        
        if (checkResult.length === 0) {
            return res.status(404).json({ 
                message: 'Travel Log not found or you do not have permission to delete it' 
            });
        }

        // Proceed with deletion if ownership is confirmed
        const [result] = await pool.query(
            'DELETE FROM travel_logs WHERE id = ? AND user_id = ?',
            [id, req.user.userId]
        );
        
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