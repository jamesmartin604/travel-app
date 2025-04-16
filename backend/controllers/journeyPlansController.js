//control how the data is used and displayed and contain the logic
const pool = require('../db');

// Get all journey plans
const getAllJourneyPlans = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM journey_plans');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new journey plan
const createJourneyPlan = async (req, res) => {
  const { journey_plan_name, journey_plan_locations, start_date, end_date, list_of_activities, description } = req.body;
  try {
    const [rows] = await pool.query(
      'INSERT INTO journey_plans (journey_plan_name, journey_plan_locations, start_date, end_date, list_of_activities, description) VALUES (?,?,?,?,?,?) RETURNING *',
      [journey_plan_name, journey_plan_locations, start_date, end_date, list_of_activities, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a journey plan
const updateJourneyPlan = async (req, res) => {
  const { id } = req.params;
  const { journey_plan_name, journey_plan_locations, start_date, end_date, list_of_activities, description } = req.body;
  try {
    await pool.query(
      'UPDATE journey_plans SET journey_plan_name = ?, journey_plan_locations = ?, start_date = ?, end_date = ?, list_of_activities = ?, description = ? WHERE id = ?',
      [journey_plan_name, journey_plan_locations, start_date, end_date, list_of_activities, description, id]
    );

    // Fetch the updated journey plan
    const [rows] = await pool.query('SELECT * FROM journey_plans WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Journey Plan not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// Delete a journey plan
const deleteJourneyPlan = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('DELETE FROM journey_plans WHERE id = ? RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Journey Plan not found' });
    }
    res.json({ message: 'Journey Plan deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllJourneyPlans,
  createJourneyPlan,
  updateJourneyPlan,
  deleteJourneyPlan,
};