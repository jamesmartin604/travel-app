import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="home-container">
      <h1 className='page-title'>Welcome to the Travel App</h1>
      <p className='page-description'>Track your travel memories and plan your next adventures with TravelLogger. Log your past journeys or create plans for future explorations.</p>
      <br></br>
      {user ? (
        <div className='logout-container'>
          <p className='welcome-back'>Welcome back, {user.username}!</p>
          <button onClick={logout} className='logout-button'>Logout</button>
        </div>
      ) : (
        <div className='auth-links'>
            <div>
            <Link to="/login" className="login-button">Login</Link>
            <Link to="/register" className='register-button'>Register</Link>
            </div>
        </div>
      )}
      <div className="feature-grid">
            <div className="feature-box">
                <h2 className="feature-title">Document Memories</h2>
                <p className="feature-text">Create detailed logs of your past trips with photos, ratings, and descriptions.</p>
            </div>
            <div className="feature-box">
                <h2 className="feature-title">Plan Ahead</h2>
                <p className="feature-text">Organize your upcoming trips with our journey planning tools.</p>
            </div>
            <div className="feature-box">
                <h2 className="feature-title">Track Progress</h2>
                <p className="feature-text">See how many places you've visited and what's next on your bucket list.</p>
            </div>
        </div>
    </div>
  );
}

export default Home;