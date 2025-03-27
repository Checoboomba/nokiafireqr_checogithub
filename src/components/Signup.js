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
    <div
      id="signup-container"
      style={{
        backgroundColor: "#ffffff", // Changed from colorConfigs.sidebar.bg
        width: "100%", // Changed from sizeConfigs.sidebar.width
        maxWidth: "500px", // Added to control width
        padding: "1rem",
        margin: "2rem auto",
        color: "#333", // Changed from colorConfigs.sidebar.color
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}
    >
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {role === "manager" && (
          <div>
            <label>Manager Secret Key:</label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter Manager Secret Key"
              className="border p-2 rounded w-full"
            />
          </div>
        )}

        <button
          type="submit"
          style={{
            backgroundColor: colorConfigs.topbar.bg,
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            border: "none"
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
