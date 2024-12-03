import React, { createContext, useState, useEffect } from 'react';

// Define defaultUserData
const defaultUserData = {
  username: "",
  dailyReminderTime: [9, 0, "AM"], // Default value, adjust as per your requirements
  daysToRemind: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ], // Empty array for days
};

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : defaultUserData; 
  });

  useEffect(() => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
