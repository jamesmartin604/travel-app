//defines the urls that the frontend can use to interact with the backend.
const express = require('express');
const {
    getAllTravelLogs,
    getTravelLogById,
    createTravelLog,
    updateTravelLog,
    deleteTravelLog,
} = require('../controllers/travelLogController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all travel logs for the current user
router.get('/', getAllTravelLogs);

// Get a specific travel log (only if owned by the user)
router.get('/:id', getTravelLogById);

// Create a new travel log for the current user
router.post('/', createTravelLog);

// Update a travel log (only if owned by the user)
router.put('/:id', updateTravelLog);

// Delete a travel log (only if owned by the user)
router.delete('/:id', deleteTravelLog);

module.exports = router;