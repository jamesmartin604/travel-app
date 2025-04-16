//defines the urls that the frontend can use to interact with the backend.
const express = require('express');
const {
  getAllJourneyPlans,
  createJourneyPlan,
  updateJourneyPlan,
  deleteJourneyPlan,
} = require('../controllers/journeyPlansController');

const router = express.Router();

router.get('/', getAllJourneyPlans);
router.post('/', createJourneyPlan);
router.put('/:id', updateJourneyPlan);
router.delete('/:id', deleteJourneyPlan);

module.exports = router;