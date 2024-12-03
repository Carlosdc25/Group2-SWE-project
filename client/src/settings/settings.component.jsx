import React, { useState } from "react";
import TimePicker from "react-time-picker";
import "./settings.component.css";

function Settings({ onClose, userData, onUpdateUserData }) {
  const [dailyReminderTime, setDailyReminderTime] = useState(userData.dailyReminderTime);
  const [daysToRemind, setDaysToRemind] = useState(userData.daysToRemind);
  

  const handleReminderChange = async (updatedDaysToRemind=daysToRemind, updatedDailyReminderTime=dailyReminderTime) => {
    const changes = {
      username: userData.username,
      newDailyReminderTime: updatedDailyReminderTime || dailyReminderTime,
      newDaysToRemind: updatedDaysToRemind || daysToRemind,
    };

    try {
      const response = await fetch("http://localhost:5050/record/reminder-change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });

      if (response.ok) {
        //console.log(`Settings changed successfully!`);
        //console.log("updated userData time " + updatedDailyReminderTime);
        onUpdateUserData({
          dailyReminderTime: updatedDailyReminderTime || dailyReminderTime,
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

  const handleTimeChange = (newTime) => {
    if (newTime) {
        console.log("input time " + newTime);
      const [hour, minute] = newTime.split(":").map(Number);
      //const period = newTime.includes("PM") ? "PM" : "AM";
      var period = "a";
      if (hour >= 12) {
        period = "PM";
      } else {
        period = "AM"
      }
      //setDailyReminderTime([hour, minute, period]);
      //handleReminderChange([hour, minute, period]);

      setDailyReminderTime((prevTimes) => {
        const updatedTime = [hour, minute, period];
        handleReminderChange(undefined, updatedTime);
        //handleReminderChange(updatedDailyReminderTime=updatedTime);
        return updatedTime;
      });
    }
  };

  const handleDayClick = (day) => {
    setDaysToRemind((prevDays) => {
      const updatedDays = prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day];
      handleReminderChange(updatedDays, undefined);
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
            <div className="time-picker-container">
                <TimePicker
                onChange={handleTimeChange}
                value={`${dailyReminderTime[0].toString().padStart(2, "0")}:${dailyReminderTime[1]
                  .toString()
                  .padStart(2, "0")} ${dailyReminderTime[2]}`}
                format="hh:mm a" // 12-hour format with AM/PM
                className="time-picker-input"
                />
            </div>
            </div>

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

/*Sources

Notifications
https://www.youtube.com/watch?v=0-bSQ14H_PY
https://github.com/JEverhart383/knock-browser-push-demo/blob/main/package-lock.json
https://knock.app/blog/how-to-send-browser-push-notifications-from-nodejs
https://vapidkeys.com/
https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d

Time Picker/Settings frontend
https://www.geeksforgeeks.org/how-to-create-time-picker-in-reactjs/
https://mui.com/x/react-date-pickers/time-picker/
https://ej2.syncfusion.com/react/documentation/timepicker/style-appearance
https://projects.wojtekmaj.pl/react-time-picker/
https://github.com/wojtekmaj/react-time-picker/blob/main/packages/react-time-picker/src/TimePicker.css
*/
