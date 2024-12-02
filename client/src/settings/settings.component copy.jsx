import React, { useState, useEffect } from "react";
import "./settings.component.css";
//import TimePicker from 'react-time-picker';


function Settings({ onClose, userData, onUpdateUserData }) {
  const [dailyReminderTime, setDailyReminderTime] = useState(
    userData.dailyReminderTime
  );
  const [daysToRemind, setDaysToRemind] = useState(userData.daysToRemind);

  const handleReminderChange = async (updatedDaysToRemind) => {
    const changes = {
      username: userData.username,
      newDailyReminderTime: dailyReminderTime,
      newDaysToRemind: updatedDaysToRemind || daysToRemind,
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
        onUpdateUserData({
          dailyReminderTime,
          daysToRemind: updatedDaysToRemind || daysToRemind,
        });
      } else {
        console.error("Changing settings failure");
      }
    } catch (error) {
      console.error("Error changing settings:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleTimeChange = (e) => {
    const [hour, minute, period] = e.target.value.split(":");
    setDailyReminderTime([parseInt(hour), parseInt(minute), period]);
    handleReminderChange();
  };

  const handleDayClick = (day) => {
    setDaysToRemind((prevDays) => {
      const updatedDays = prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day];
      handleReminderChange(updatedDays); // Pass the updated days directly
      return updatedDays;
    });
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
            
            {/*
            IMPORT REACT TIME PICKER
            <div className="Daily-Reminder-Time">
              <label>Daily Reminder Time</label>
              <div className="time-display">

              <TimePicker
                onChange={handleTimeChange}
                value={`${dailyReminderTime[0]}:${dailyReminderTime[1]} ${dailyReminderTime[2]}`}
                format="hh:mm a" // 12-hour format with AM/PM
                />
              </div>
            </div>
            */}
            {/* 
            IMPORT npm install @mui/x-date-pickers
            <div className="Daily-Reminder-Time">
                <label>Daily Reminder Time</label>
                 
                <TextField
                    label="Choose Time"
                    type="time"
                    value={String(dailyReminderTime[0]).padStart(2, "0") + ":" + String(dailyReminderTime[1]).padStart(2, "0")}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    inputProps={{
                    step: 300, // 5 minutes
                    }}
                    onChange={handleTimeChange}
                />
                
            </div>
            */}
            <div className="Days-to-Remind">
              <div>Days to Remind</div>
              <div className="remind-days-buttons">
                {["Su", "M", "Tu", "W", "Th", "F", "Sa"].map((day, index) => (
                  <button
                    key={day}
                    onClick={() => handleDayClick(dayMapping[index])}
                    className={`day-button ${
                      daysToRemind.includes(dayMapping[index]) ? "active" : ""
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
