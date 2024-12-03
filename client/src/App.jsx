import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { registerPushNotifications } from "./dashboard/utils/registernotifsw";
import Login from "./login/login.component";
import Signup from "./signup/signup.component";
import Dashboard from "./dashboard/dashboard.component";
import "./App.css";
import Profile from "./profile/profile.component";
import { UserProvider } from "./context/UserContext";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Redirect to login if no specific path is provided */}
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Login page route */}
          <Route path="/login" element={<Login />} />
          {/* Signup page route */}
          <Route path="/signup" element={<Signup />} />
          {/* Dashboard page route */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Profile page route */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
