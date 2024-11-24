import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.component.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Login component rendered");
    try {
      const response = await fetch('http://localhost:5050/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Saves the user's data locally to be used on the dashboard
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.userData));
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
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
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleLogin} className="login-button" disabled={!username || !password}>
          Login
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="signup-button"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
