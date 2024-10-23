import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Dashboard from './dashboard/dashboard.component'; // Import your Dashboard component

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Edit <code>src/App.jsx</code> and save to test HMR</p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>

      {/* Button to navigate to Dashboard */}
      <Link to="/dashboard">
        <button>Go to Dashboard</button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Home component */}
        <Route path="/" element={<Home />} />

        {/* Route for the Dashboard component */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
