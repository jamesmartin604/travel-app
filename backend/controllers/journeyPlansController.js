const pool = require('../db');

// Get all journey plans for current user
const getAllJourneyPlans = async (req, res) => {
  try {
    const [plans] = await pool.query(
      'SELECT * FROM journey_plans WHERE user_id = ?',
      [req.user.userId]
    );
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get specific journey plan
const getJourneyPlanById = async (req, res) => {
  try {
    const [plan] = await pool.query(
      'SELECT * FROM journey_plans WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );
    
    if (plan.length === 0) {
      return res.status(404).json({ 
        message: 'Journey plan not found or access denied' 
      });
    }
    
    res.json(plan[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new journey plan
const createJourneyPlan = async (req, res) => {
  try {
    const { 
      journey_plan_name, 
      journey_plan_locations, 
      start_date, 
      end_date, 
      list_of_activities, 
      description 
    } = req.body;

    // Ensure list_of_activities is stored as a single JSON string
    const activities = list_of_activities
      ? (typeof list_of_activities === 'string'
          ? JSON.stringify([list_of_activities]) // Wrap in an array if it's a single string
          : JSON.stringify(list_of_activities)) // Convert array to JSON string
      : '[]'; // Default to an empty array

    const [result] = await pool.query(
      `INSERT INTO journey_plans 
      (journey_plan_name, journey_plan_locations, start_date, end_date, 
       list_of_activities, description, user_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        journey_plan_name, 
        journey_plan_locations, 
        start_date, 
        end_date, 
        activities, // Use the transformed variable
        description, 
        req.user.userId
      ]
    );

    const [newPlan] = await pool.query(
      'SELECT * FROM journey_plans WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newPlan[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update journey plan
const updateJourneyPlan = async (req, res) => {
  try {
    // Verify ownership first
    const [existing] = await pool.query(
      'SELECT * FROM journey_plans WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ 
        message: 'Journey plan not found or access denied' 
      });
    }

    const { 
      journey_plan_name, 
      journey_plan_locations, 
      start_date, 
      end_date, 
      list_of_activities, 
      description 
    } = req.body;

    await pool.query(
      `UPDATE journey_plans SET 
       journey_plan_name = ?, 
       journey_plan_locations = ?, 
       start_date = ?, 
       end_date = ?, 
       list_of_activities = ?, 
       description = ? 
       WHERE id = ?`,
      [
        journey_plan_name, 
        journey_plan_locations, 
        start_date, 
        end_date, 
        list_of_activities, 
        description, 
        req.params.id
      ]
    );

    const [updatedPlan] = await pool.query(
      'SELECT * FROM journey_plans WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedPlan[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete journey plan
const deleteJourneyPlan = async (req, res) => {
  try {
    // Verify ownership first
    const [existing] = await pool.query(
      'SELECT * FROM journey_plans WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ 
        message: 'Journey plan not found or access denied' 
      });
    }

    await pool.query(
      'DELETE FROM journey_plans WHERE id = ?',
      [req.params.id]
    );

    res.json({ message: 'Journey plan deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllJourneyPlans,
  getJourneyPlanById,
  createJourneyPlan,
  updateJourneyPlan,
  deleteJourneyPlan
};