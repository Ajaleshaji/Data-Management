// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentLogin() {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!rollNumber || !password) {
      setMessage("Please enter Roll Number and Password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Login successful → redirect to Dashboard
        navigate(`/dashboard?rollNumber=${rollNumber}`);
      } else {
        setMessage(data.msg || "Invalid Roll Number or Password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Server error");
    }
  };

  return (
    <div style={container}>
      <h2>Student Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={btnStyle}>Login</button>
      </form>
      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}

const container = {
  maxWidth: "400px",
  margin: "50px auto",
  padding: "20px",
  textAlign: "center",
  border: "1px solid #ccc",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  fontSize: "16px",
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default StudentLogin;
