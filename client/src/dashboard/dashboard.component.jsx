import React, { useState, useEffect } from 'react';
import './dashboard.component.css';
import SettingsDialog from '../settings/settings.component';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState('');
  const [task, setTask] = useState('');
  const [multipleTasks, setMultipleTasks] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getTasks();
  }, []);
 
  const getHabitColor = (habit) => {
    if (habit == 'High Priority'){
      return '#DBCDF0';
    }
    else if (habit == 'Academics'){
      return '#F7D9C4';
    }
    else if (habit == 'Gym'){
      return '#FAEDCB';
    }
    else if (habit == 'Home'){
      return '#F2C6DE';
    }
    else{
      return '#FF0000';
    }
  };

  const getTasks = async () =>{
    try {
      const response = await fetch('http://localhost:5050/record');
      if (response.ok){
        const data = await response.json();
        setMultipleTasks(data);
      }
      else{
        console.error('Failed to get tasks for dashboard:(', response.statusText);
      }
    }
    catch(error){
      console.error('error getting tasks for dashboard', error);
    }
  };


 const tasksByHabit = multipleTasks.reduce((acc, task) => {
    const habit = task.habit;

    if (!acc[habit]) {
      acc[habit] = [];
    }
    acc[habit].push(task);

    return acc;
  }, {});

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Good Morning';
    } 
    else if (currentHour < 18) {
      return 'Good Afternoon';
    } 
    else {
      return 'Good Evening';
    }
  };

  const getCurrentDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  const handleProfile = () => {
    navigate('/profile');
  }; 

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };
  
  const handleHabitClick =(habit) => {
    setSelectedHabit(habit);
    setIsTaskDialogOpen(false);
    setIsTaskDialogOpen(true);
  }

  const handleTaskSubmit = async () => {
    const newTask = {
      habit: selectedHabit,  
      task: task
    };
    console.log("Selected Habit:", selectedHabit);
    console.log("Task:", task);

    try {
      // Send the data to the backend
      const response = await fetch("http://localhost:5050/record/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  
        },
        body: JSON.stringify(newTask),  
      });
      
      if (response.ok) {
        console.log(`Task for ${selectedHabit}: ${task} added successfully!!!`);
        setTask("");  //clear input
        setIsDialogOpen(false); //close pop-up
        getTasks(); //get tasks and place them in multipleTasks
      } else {
        console.error("Task adding failue");
      }
    } catch (error) {
      console.error("Error!!! :", error); 
      alert(`Error: ${error.message}`);
    }
  
    setIsTaskDialogOpen(false);  //Close pop-up
  
  };

  const toggleSettings = () =>{
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div>
      <div className="header">
        {getGreeting()}, Alexa       
      </div>
      <p className='text'>Today is {getCurrentDate()}</p>
      <div onClick={toggleSettings}>
        <img src="https://cdn-icons-png.flaticon.com/512/561/561135.png" alt="Settings Icon" className="settings-icon" />
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
        {['High Priority', 'Academics', 'Gym', 'Home'].map((habit) => (
          <div
            key={habit}
            className="box"
            style={{ backgroundColor: getHabitColor(habit) }}
          >
            <div className="box-title">{habit}</div>
            <div className="box-content">
              <div>
                {tasksByHabit[habit] ? (
                  tasksByHabit[habit].map((taskItem) => (
                    <p key={taskItem._id} className='task-text'>
                      <input type="checkbox" /> {taskItem.task}
                    </p>
                  ))
                ) : (
                  <p>No tasks</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Habit Button */}
      <button className="add-habit-button" onClick={toggleDialog}>
        Add Habit
      </button>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="dialog">
            <div className="dialog-content">
                <h2>Choose New Habit</h2>
                {['High Priority', 'Academics', 'Gym', 'Home'].map((habit) => (
                  <button key={habit} className='add-habit' style= {{backgroundColor : getHabitColor(habit)}} onClick={() => handleHabitClick(habit)}>
                    <div className="individual-habit-title">
                      {habit} 
                    </div>
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
              <button className="done-button" onClick={toggleDialog}>Close</button>

               
            </div>
        </div>
      )}
      {isSettingsOpen && (
        <SettingsDialog onClose={toggleSettings} /> 
      )}
    </div>
  );
}

export default Dashboard;