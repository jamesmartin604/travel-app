//defines the urls that the frontend can use to interact with the backend.
const express = require('express');
const {
    getAllTravelLogs,
    getTravelLogById,
    createTravelLog,
    updateTravelLog,
    deleteTravelLog,
} = require('../controllers/travelLogController');

const router = express.Router();

router.get('/',getAllTravelLogs);
router.get('/:id',getTravelLogById);
router.post('/',createTravelLog);
router.put('/:id',updateTravelLog);
router.delete('/:id',deleteTravelLog);

module.exports = router;