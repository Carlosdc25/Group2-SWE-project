import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login/login.component'; 
import Dashboard from './dashboard/dashboard.component'; 
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect to login if no specific path is provided */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Login page route */}
        <Route path="/login" element={<Login />} />
        {/* Dashboard page route */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
