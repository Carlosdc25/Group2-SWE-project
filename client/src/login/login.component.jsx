import React, { useState } from 'react';
import './login.component.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username && password) {
      // Redirect to dashboard page if both username and password are entered
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to Gators On Track!</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Disable the button if username or password is empty */}
        <button onClick={handleLogin} disabled={!username || !password}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
