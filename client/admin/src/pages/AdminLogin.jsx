import React, { useState } from "react";

function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/superadmin/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to SuperAdmin project department page
        // Passing admin info as query params (adminId, department)
        const superAdminURL = `http://localhost:5174/department/${data.department}?adminId=${data.adminId}`;
        window.location.href = superAdminURL;
      } else {
        setMessage(data.msg);
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Admin ID"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          style={inputStyle}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        /><br /><br />

        <button type="submit" style={btnStyle}>Login</button>
      </form>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
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

export default AdminLogin;
