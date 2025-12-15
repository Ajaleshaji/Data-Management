import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!adminId || !password) {
      setMessage("Please enter Admin ID and Password");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/superadmin/admin-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminId, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.msg || "Login failed");
        return;
      }

      // ✅ Store admin info locally (Admin project only)
      localStorage.setItem("adminId", data.adminId);
      localStorage.setItem("department", data.department);

      // ✅ Redirect INSIDE ADMIN PROJECT
      navigate(`/department/${data.department}?adminId=${data.adminId}`);
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server error");
    }
  };

  return (
    <div style={container}>
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Admin ID"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button type="submit" style={button}>
          Login
        </button>
      </form>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}

/* ---------- styles ---------- */

const container = {
  maxWidth: "400px",
  margin: "80px auto",
  padding: "25px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const input = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  marginBottom: "15px",
};

const button = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

export default AdminLogin;
