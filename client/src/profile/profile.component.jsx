import React, { useEffect, useState, useContext } from "react";
import "./profile.component.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Profile = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext); // Consume userData from context
  const [habits, setHabits] = useState([]);

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
            <div className="reminder-time">
              {userData?.dailyReminderTime
                ? (() => {
                    const [hour, minute, period] = userData.dailyReminderTime;
                    const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                    const formattedMinute = minute.toString().padStart(2, "0");
                    return `${formattedHour}:${formattedMinute} ${period}`;
                  })()
                : "No reminder time set"}
            </div>
            <p>on the following days:</p>
            <div className="days">
              {userData?.daysToRemind?.length > 0
                ? userData.daysToRemind.map((day, index) => (
                    <div key={index} className={`day-box day${index + 1}`}>
                      {day}
                    </div>
                  ))
                : "No reminder days set"}
            </div>
          </div>
        </div>
      </div>

      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div>If your account data does not match your request, please refresh the page!</div>
    </div>
  );
};

export default Profile;
