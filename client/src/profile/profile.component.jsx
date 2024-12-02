import React, { useEffect, useState } from "react";
import "./profile.component.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [habits, setHabits] = useState([]); // Dynamic habits state

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchHabits = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      try {
        const response = await fetch(
          `http://localhost:5050/record/get-habits?username=${userData.username}`
        );
        if (response.ok) {
          const data = await response.json();
          setHabits(Object.keys(data)); // Extract habit titles from the database
        } else {
          console.error("Failed to fetch habits");
        }
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    } else {
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    fetchHabits(); // Fetch habits on component mount
  }, []);

  return (
    <div>
      <div className="header-container">
        <div className="acc-header">Account Information</div>
      </div>

      <img
        src="https://cdn-icons-png.flaticon.com/512/25/25694.png"
        alt="Profile Icon"
        className="profile-icon"
        onClick={handleDashboard}
      />

      <div className="profile-container">
        <div className="grid-layout">
          <div className="chosen-habits box">
            <h2>Chosen Habits</h2>
            {habits.map((habit, index) => (
              <div key={index} className={`habit-box habit${index + 1} habit-title`}>
                {habit}
              </div>
            ))}
          </div>

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

      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {isSettingsOpen && <SettingsDialog onClose={toggleSettings} />}
    </div>
  );
};

export default Profile;
