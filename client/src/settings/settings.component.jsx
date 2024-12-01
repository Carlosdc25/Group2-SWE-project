//import React from "react";
import React, { useState, useEffect } from "react";
import "./settings.component.css";

function Settings({ onClose, userData }) {
  //console.log("settingsUser " + userData); //debugging
  const [dailyReminderTime, setDailyReminderTime] = useState(
    userData.dailyReminderTime
  );
  const [daysToRemind, setDaysToRemind] = useState(userData.daysToRemind);
  //const { dailyReminderTime, daysToRemind } = userData;

  const handleReminderChange = async () => {
    
    const changes = {
      username: userData.username,
      newDailyReminderTime: dailyReminderTime,
      newDaysToRemind: daysToRemind,
    };

    try {
      const response = await fetch(
        "http://localhost:5050/record/reminder-change",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changes),
        }
      );

      if (response.ok) {
        console.log(`Settings changed successfully!`);
        //getTasks(userData.username); // Refresh tasks
      } else {
        console.error("Changing settings failure");
      }
    } catch (error) {
      console.error("Error changing settings:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleTimeChange = (e) => {
    // Extract value from the input (assuming it follows [hour, minute, "AM/PM"] format)
    const [hour, minute, period] = e.target.value.split(":");
    setDailyReminderTime([parseInt(hour), parseInt(minute), period]);
    handleReminderChange();
  };

  const handleDayClick = (day) => {
    setDaysToRemind((prevDays) => {
      if (prevDays.includes(day)) {
        // Remove the day if already in the list
        return prevDays.filter((d) => d !== day);
      } else {
        // Add the day to the list
        return [...prevDays, day];
      }
    });
    handleReminderChange();
  };

  return (
    <div className="overlay">
      <div className="settings-dialog">
        <button onClick={onClose} className="close-button">
          X
        </button>
        <div className="rotated-text">Settings</div>
        <div className="settings-body">
          <div className="settings-header">
            <h2>Notification Settings</h2>
          </div>

          <div className="settings-content">
            <div className="Daily-Reminder-Time">
              <label>Daily Reminder Time</label>
              <div className="time-display" onClick={handleTimeChange}>
                <label className="hour-display">
                  {String(dailyReminderTime[0]).padStart(2, "0")}
                </label>
                <label className="colon-display">:</label>
                <label className="minute-display">
                  {String(dailyReminderTime[1]).padStart(2, "0")}
                </label>
                <label className="AM-or-PM"> {dailyReminderTime[2]}</label>
              </div>
            </div>
            <div className="Days-to-Remind">
              <div>Days to Remind</div>
              <div className="remind-days-buttons">
                {["Su", "M", "Tu", "W", "Th", "F", "Sa"].map((day, index) => (
                  <button
                    key={day}
                    className={`day-button ${
                      daysToRemind.includes(dayMapping[index]) ? "active" : ""
                    }`}
                    onClick={() => handleDayClick(dayMapping[index])}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button onClick={handleReminderChange} className="save-button">
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Day mapping for day indexes to names
const dayMapping = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default Settings;
