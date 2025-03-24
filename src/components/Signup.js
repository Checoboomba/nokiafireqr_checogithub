import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import colorConfigs from '../components/colorConfigs';
import "../styles/styles.css";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [secretKey, setSecretKey] = useState('');

  const isValidNokiaEmail = (email) => {
    return email.endsWith("@nokia.com");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidNokiaEmail(email)) {
      alert("Only @nokia.com emails are allowed!");
      return;
    }

    if (role === "manager" && secretKey !== "Nokia123") {
      alert("Incorrect secret key for manager registration!");
      return;
    }

    localStorage.setItem(email, JSON.stringify({ email, password, role }));
    alert("Account created! Please log in.");
    navigate("/");
  };

  return (
    <div id="signup-container" className="common-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@nokia.com"
          />
        </div>

        <div className="input-container">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {role === "manager" && (
          <div className="input-container">
            <label>Manager Secret Key:</label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter Manager Secret Key"
            />
          </div>
        )}

        <div className="input-container">
          <button
            type="submit"
            style={{
              backgroundColor: colorConfigs.topbar.bg
            }}
            className="signup-button"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
