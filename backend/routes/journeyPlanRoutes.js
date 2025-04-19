const express = require('express');
const {
  getAllJourneyPlans,
  getJourneyPlanById,
  createJourneyPlan,
  updateJourneyPlan,
  deleteJourneyPlan,
} = require('../controllers/journeyPlansController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all journey plans for current user
router.get('/', getAllJourneyPlans);

// Get specific journey plan (only if owned by user)
router.get('/:id', getJourneyPlanById);

// Create new journey plan for current user
router.post('/', createJourneyPlan);

// Update journey plan (only if owned by user)
router.put('/:id', updateJourneyPlan);

// Delete journey plan (only if owned by user)
router.delete('/:id', deleteJourneyPlan);

module.exports = router;