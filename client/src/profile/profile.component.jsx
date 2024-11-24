import React, { useState } from "react";
import "./profile.component.css";
import { useNavigate } from "react-router-dom";
import SettingsDialog from "../settings/settings.component";

const Profile = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleLogout = () => {
    // Clears all local storage items
    localStorage.clear();
    // Redirects user to login page
    navigate("/login");
  };

  return (
    <div>
      <div class="header-container">
        <div class="acc-header">Account Information</div>
      </div>

      {/* Settings Icon */}
      <div onClick={toggleSettings}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/561/561135.png"
          alt="Settings Icon"
          className="settings-icon"
        />
      </div>

      {/* Profile Icon */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/25/25694.png"
        alt="Profile Icon"
        className="profile-icon"
        onClick={handleDashboard}
      />

      <div className="profile-container">
        <div className="grid-layout">
          {/* Top Left Box: Chosen Habits */}
          <div className="chosen-habits box">
            <h2>Chosen Habits</h2>
            <div className="habit-box habit1 habit-title">High Priority</div>
            <div className="habit-box habit2 habit-title">Academics</div>
            <div className="habit-box habit3 habit-title">Gym</div>
            <div className="habit-box habit4 habit-title">Home</div>
          </div>

          {/* Top Right Box: Reminders */}
          <div className="reminders box">
            <h2>Reminders</h2>
            <p>You will receive reminders at:</p>
            <div className="reminder-time"></div>
            <p>on the following days:</p>
            <div className="days">
              <div className="day-box day1"></div>
              <div className="day-box day2"></div>
              <div className="day-box day3"></div>
              <div className="day-box day4"></div>
              <div className="day-box day5"></div>
              <div className="day-box day6"></div>
              <div className="day-box day7"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Settings Dialog */}
      {isSettingsOpen && <SettingsDialog onClose={toggleSettings} />}
    </div>
  );
};

export default Profile;
