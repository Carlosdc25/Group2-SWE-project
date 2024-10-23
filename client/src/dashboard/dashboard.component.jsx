import React, { useState } from 'react';
import './dashboard.component.css'; // Make sure to import your CSS

function Dashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const getCurrentDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <div>
      <div className="header">
        {getGreeting()}, Alexa
      </div>
      <p className='text'>Today is {getCurrentDate()}</p>
      <div className="dashboard-container">
        {/* Boxes with tasks */}
        <div className="box" style={{ backgroundColor: '#DBCDF0' }}>
          <div className="box-title">High Priority</div>
          <div className="box-content">
            <div>
              <p className='task-text'><input type="checkbox" /> Uncompleted Task</p>
              <p className='task-text'><input type="checkbox" /> Uncompleted Task</p>
              <p className='task-text'><input type="checkbox" defaultChecked /> Completed Task</p>
              <p className='task-text'><input type="checkbox" defaultChecked /> Completed Task</p>
            </div>
          </div>
        </div>
        <div className="box" style={{ backgroundColor: '#F7D9C4' }}>
          <div className="box-title">Academics</div>
          <div className="box-content">
            <div>
              <p className='task-text'><input type="checkbox" /> Uncompleted Task</p>
              <p className='task-text'><input type="checkbox" /> Uncompleted Task</p>
              <p className='task-text'><input type="checkbox" defaultChecked /> Completed Task</p>
            </div>
          </div>
        </div>
        <div className="box" style={{ backgroundColor: '#FAEDCB' }}>
          <div className="box-title">Gym</div>
          <div className="box-content">
            <div>
              <p className='task-text'><input type="checkbox" /> Uncompleted Task</p>
              <p className='task-text'><input type="checkbox" defaultChecked /> Completed Task</p>
            </div>
          </div>
        </div>
        <div className="box" style={{ backgroundColor: '#F2C6DE' }}>
          <div className="box-title">Home</div>
          <div className="box-content">
            <div>
              <p className='task-text'><input type="checkbox" /> Uncompleted Task</p>
              <p className='task-text'><input type="checkbox" defaultChecked /> Completed Task</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Habit Button */}
      <button className="add-habit-button" onClick={toggleDialog}>
        Add Habit
      </button>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="dialog">
          <div className="dialog-content">
            <h2>Add New Habit</h2>
            {/* Add form or content here */}
            <button onClick={toggleDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;