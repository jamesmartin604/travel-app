import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import TravelLogs from './pages/TravelLogs';
import JourneyPlans from './pages/JourneyPlans';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from './context/AuthContext'; // Add this import
import './App.css';
import { FaPlane } from 'react-icons/fa';

function App() {
  const { user } = useAuth(); // Now this will work

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <NavLink to="/" className="nav-link" activeClassName="active">
           <FaPlane className='nav-icon'/> TravelLogger
          </NavLink>
        </div>
        {user && (
          <div className="nav-right">
            <NavLink to="/travellogs" className="nav-link" activeClassName="active">Travel Logs</NavLink>
            <NavLink to="/journeyplans" className="nav-link" activeClassName="active">Journey Plans</NavLink>
          </div>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/travellogs" element={<TravelLogs />} />
          <Route path="/journeyplans" element={<JourneyPlans />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;