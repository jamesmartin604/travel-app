//defines the urls that the frontend can use to interact with the backend.
const express = require('express');
const {
  getAllSessions,
  createSession,
  updateSession,
  deleteSession,
} = require('../controllers/sessionController');

const router = express.Router();

router.get('/', getAllSessions);
router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

module.exports = router;