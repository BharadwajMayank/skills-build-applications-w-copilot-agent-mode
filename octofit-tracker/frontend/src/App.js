


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import Auth from './components/Auth';
import './App.css';



function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
            <img src={process.env.PUBLIC_URL + '/octofitapp-small.png'} alt="Octofit Logo" className="octofit-logo me-2" />
            Octofit Tracker
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/activities">Activities</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/teams">Teams</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/users">Users</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/workouts">Workouts</NavLink>
              </li>
            </ul>
            {user && (
              <span className="navbar-text text-white">Welcome, {user.user?.username || user.username}!</span>
            )}
          </div>
        </div>
      </nav>
      <div className="container">
        {!user ? (
          <Auth onAuth={setUser} />
        ) : (
          <Routes>
            <Route path="/activities" element={<Activities user={user} />} />
            <Route path="/leaderboard" element={<Leaderboard user={user} />} />
            <Route path="/teams" element={<Teams user={user} />} />
            <Route path="/users" element={<Users user={user} />} />
            <Route path="/workouts" element={<Workouts user={user} />} />
            <Route path="/" element={<h2 className="display-4 text-center my-5">Welcome to Octofit Tracker!</h2>} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
