const express = require('express');
const cors = require('cors');
const pool = require('./db'); // postgresql connection pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const travelLogRoutes = require('./routes/travelLogRoutes');
const journeyPlanRoutes = require('./routes/journeyPlanRoutes');

const app = express();
const PORT = 5000;

//middleware
app.use(cors());
app.use(express.json()); // parse json request bodies

//routes
app.use('/api/travelLogs',travelLogRoutes);
app.use('/api/journeyPlans',journeyPlanRoutes);

app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Check if user exists
    const [existingUser] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?', 
      [username, email]
    );
    
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?', 
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      'your-secret-key', // Replace with a real secret in production
      { expiresIn: '1h' }
    );
    
    res.json({ token, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
