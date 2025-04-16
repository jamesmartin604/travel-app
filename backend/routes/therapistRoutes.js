//defines the urls that the frontend can use to interact with the backend.
const express = require('express');
const {
  getAllTherapists,
  createTherapist,
  updateTherapist,
  deleteTherapist,
} = require('../controllers/therapistController');

const router = express.Router();

router.get('/', getAllTherapists);
router.post('/', createTherapist);
router.put('/:id', updateTherapist);
router.delete('/:id', deleteTherapist);

module.exports = router;