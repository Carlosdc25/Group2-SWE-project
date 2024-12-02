import React, { useState, useEffect } from "react";
import "./dashboard.component.css";
import SettingsDialog from "../settings/settings.component";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  // Declares userData variable (holds logged in user's data)
  const [userData, setUserData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState("");
  const [task, setTask] = useState("");
  const [multipleTasks, setMultipleTasks] = useState({}); //turned into an object instead of an array
  const [showDeleteButtons, setShowDeleteButtons] = useState(false); // Toggle for delete buttons
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]); //an empty array that'll be filled by habits from db
  const [editingHabit, setEditingHabit] = useState(null);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [checkedTasks, setCheckedTasks] = useState({}); //greying out tasks when completed



  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem('user');
    console.log('Raw storedUser from localStorage:', storedUser); // Debugging
    console.log(habits);
    const link = document.createElement("link");
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"; //for pencil icon
    link.rel = "stylesheet";
    document.head.appendChild(link);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('Parsed User:', parsedUser); // Debugging
  
      if (parsedUser.username) {
        console.log('Parsed Username:', parsedUser.username); // More Debugging 
        setUserData(parsedUser);
        fetchHabits(parsedUser.username); // Fetch habits dynamically from the database
        console.log("Habits state updated:", habits);
        getTasks(parsedUser.username); // Pass the username to fetch tasks
      } else {
        console.error('Username is missing from storedUser');
      }
    } else {
      
      navigate('/login', { replace: true }); // Redirect if no user is found
    }
  }, []);

  const handleTaskCheck = (habit, taskId) => {
    setCheckedTasks((prev) => ({
        ...prev,
        [taskId]: !prev[taskId], // Toggle the checked state
    }));
  };

  const handleUserDataUpdate = (updatedData) => {
    setUserData((prevData) => ({ ...prevData, ...updatedData }));
  };


  const fetchHabits = async (username) => {
    try {
      const response = await fetch(`http://localhost:5050/record/get-habits?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        const habitTitles = Object.keys(data); // Extract habit titles from the database response
        setHabits(habitTitles); // Update habits dynamically
      } else {
        console.error("Failed to fetch habits:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const getHabitColor = (index) => {
    const colors = ["#DBCDF0", "#F7D9C4", "#FAEDCB", "#F2C6DE"]; // Static colors for boxes, since the titles can now change
    return colors[index ]; 
  };

  const toggleDeleteMode = () => {
    setShowDeleteButtons(!showDeleteButtons); // Toggle visibility of delete buttons
  };

  const getTasks = async (username) => {
    try {
      const response = await fetch(`http://localhost:5050/record/get-tasks?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Tasks retrieved for username:", username, data);
        setMultipleTasks(data); // Expecting `data` to be an object of habits that map to tasks
      } else {
        console.error("Failed to get tasks for dashboard:", response.statusText);
      }
    } catch (error) {
      console.error("Error getting tasks for dashboard", error);
    }
  };


  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const getCurrentDate = () => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date().toLocaleDateString(undefined, options);
  };

  const saveHabitTitle = async (oldTitle) => { 
    try {
      const response = await fetch(`http://localhost:5050/record/update-habit-title/${userData.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldTitle, newTitle: newHabitTitle }),
      });
  
      if (response.ok) {
        console.log("Habit title updated successfully");
        // Update the habits array
        setHabits((prevHabits) =>
          prevHabits.map((habit) => (habit === oldTitle ? newHabitTitle : habit))
        );
        setEditingHabit(null); // Exit edit mode
        getTasks(userData.username); // Refresh tasks to show changes
      } else {
        console.error("Error updating habit title");
      }
    } catch (error) {
      console.error("Error updating habit title:", error);
    }
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleHabitClick = (habit) => {
    setSelectedHabit(habit);
    setIsTaskDialogOpen(false);
    setIsTaskDialogOpen(true);
  };

  const handleTaskSubmit = async () => {
    const newTask = {
      username: userData.username,
      habit: selectedHabit,
      task,
    };
  
    try {
      const response = await fetch("http://localhost:5050/record/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
  
      if (response.ok) {
        console.log(`Task for ${selectedHabit}: ${task} added successfully!`);
        setTask(""); // Clear input
        setIsDialogOpen(false); // Close pop-up
        getTasks(userData.username); // Refresh tasks
      } else {
        console.error("Task adding failure");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert(`Error: ${error.message}`);
    }
  
    setIsTaskDialogOpen(false); // Close pop-up
  };
  
  const handleDeleteTask = async (username, habit, taskId) => {
    try {
      const response = await fetch(
        `http://localhost:5050/record/delete-task/${username}/${habit}/${taskId}`,
        { method: "DELETE" }
      );
  
      if (response.ok) {
        console.log(`Task with ID ${taskId} deleted successfully!`);
        getTasks(username); // Refresh tasks after deletion
      } else {
        console.error("Failed to delete task:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const startEditingHabit = (habit) => {
    setEditingHabit(habit);
    setNewHabitTitle(habit); 
  };
  return (
    <div>
      <div className="header">{getGreeting()}, {userData?.firstName || "Guest"}!</div>
      <p className="text">Today is {getCurrentDate()}</p>
      <div onClick={toggleSettings}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/561/561135.png"
          alt="Settings Icon"
          className="settings-icon"
        />
      </div>
      <div onClick={handleProfile}>
        <img
          src="https://static-00.iconduck.com/assets.00/profile-icon-512x512-w0uaq4yr.png"
          alt="Profile Icon"
          className="profile-icon"
        />
      </div>

      <div className="dashboard-container">
        {/* Boxes with tasks */}
        {/* going over each habit to create boxes dynamically using .map() */}
        {habits.map((habit, index) => (
          <div
            key={habit}
            className="box"
            style={{ backgroundColor: getHabitColor(index) }}
          >
            {editingHabit === habit ? (
              <div className="edit-habit-title">
                <input
                  type="text"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder="Enter new title"
                />
                <div className="Save-&-Cancel-Column">
                  <button className="Save-Title-Edit" onClick={() => saveHabitTitle(habit)}>Save</button> {/* Parameter is old habit */}
                  <button className="Cancel-Title-Edit" onClick={() => setEditingHabit(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="box-title">
                {habit}
                <i
                className="fas fa-pencil-alt edit-icon"
                onClick={() => startEditingHabit(habit)}
                ></i>
              </div>
            )}
            <div className="box-content">
            {multipleTasks[habit] && multipleTasks[habit].length > 0 ? (
              multipleTasks[habit].map((taskItem) => (
                <div key={taskItem._id} className="task-item">

                  {/* Conditionally showing the delete buttons */}
                  {showDeleteButtons &&(
                    <button className="delete-task-button" onClick={() => handleDeleteTask(userData.username, habit, taskItem._id)}>
                      &minus;
                    </button>
                  )}

                  <input
                    type="checkbox"
                    checked={!!checkedTasks[taskItem._id]}
                    onChange={() => handleTaskCheck(habit, taskItem._id)}
                  />
                  <span
                    className="task-text"
                    style={{
                      textDecoration: checkedTasks[taskItem._id] ? 'line-through' : 'none',
                      
                    }}
                  >
                    {taskItem.task}
                  </span>

                </div>
              ))
            ) : (
              <p>No tasks</p>
            )}
            
            </div>
          </div>
        ))}
      </div>
      
      <div className="button-container">
        <button className="add-habit-button" onClick={toggleDialog}> {/* Add Habit Button */}
          Add Habit
        </button>
        <button className="edit-mode-button" onClick={toggleDeleteMode}> {/* Edit or Done Button, for deletion */}
          {showDeleteButtons ? "Done" : "Edit"}
        </button>
      </div>


      
      

      {/* Dialog */}
      {isDialogOpen && (
        <div className="dialog">
          <div className="dialog-content">
            <h2>Choose New Habit</h2>
            {habits.map((habit, index) => (
              <button
                key={habit}
                className="add-habit"
                style={{ backgroundColor: getHabitColor(index) }}
                onClick={() => handleHabitClick(habit)}
              >
                <div className="individual-habit-title">{habit}</div>
              </button>
            ))}
            <input
              placeholder={`Enter your ${selectedHabit} task`}
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <button className="submit-task-button" onClick={handleTaskSubmit}>
              Submit Task
            </button>
            <button className="done-button" onClick={toggleDialog}>
              Close
            </button>
          </div>
        </div>
      )}
      {isSettingsOpen && userData && <SettingsDialog onClose={toggleSettings} userData={userData} onUpdateUserData={handleUserDataUpdate}/>}
    </div>
  );
}

export default Dashboard;
