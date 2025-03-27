import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/styles.css"; // Import CSS
import colorConfigs from "../components/colorConfigs"; // Import color configs

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValidNokiaEmail = (email) => {
    return email.endsWith("@nokia.com");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!isValidNokiaEmail(email)) {
      alert("Only @nokia.com emails are allowed!");
      return;
    }

    const userData = JSON.parse(localStorage.getItem(email));
    if (userData && userData.password === password) {
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div id="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          id="login-email"
          required
          
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password:</label>
        <input
          type="password"
          id="login-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 🔽 Updated button color */}
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
          Login
        </button>
      </form>

      <p>
        New user? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
