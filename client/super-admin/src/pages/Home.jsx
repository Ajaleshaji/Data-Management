import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const SUPER_ADMIN_ID = "superadmin";
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all admins on load
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/superadmin/get-admins?superAdminId=${SUPER_ADMIN_ID}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch admins");
      }

      const data = await res.json();
      setAdmins(data.admins || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const createAdmin = async () => {
    if (!adminId || !password || !department) {
      return setMessage("All fields are required");
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/superadmin/create-admin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            superAdminId: SUPER_ADMIN_ID,
            adminId,
            password,
            department,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Admin created successfully!");
        setAdminId("");
        setPassword("");
        setDepartment("");
        fetchAdmins(); // refresh list
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      setMessage("Server error");
    }
  };

  return (
    <div style={pageContainer}>
      <h1>Super Admin Home</h1>

      {/* Create Admin Form */}
      <div style={formContainer}>
        <h2>Create Admin</h2>

        <input
          style={inputStyle}
          type="text"
          placeholder="Admin ID"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
        />

        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          style={inputStyle}
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <button style={btnStyle} onClick={createAdmin}>
          Create Admin
        </button>

        <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
      </div>

      {/* Department List */}
      <h2 style={{ marginTop: "30px" }}>Departments</h2>

      <div>
        {admins.length === 0 ? (
          <p>No departments created yet</p>
        ) : (
          admins.map((admin, index) => (
            <div
              key={index}
              style={departmentCard}
              onClick={() => navigate(`/department/${admin.department}`)}
            >
              {admin.department}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Styles
const pageContainer = {
  width: "450px",
  margin: "40px auto",
  textAlign: "center",
};

const formContainer = {
  padding: "20px",
  background: "#f8f8f8",
  borderRadius: "10px",
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
};

const btnStyle = {
  padding: "10px 20px",
  background: "#4CAF50",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  borderRadius: "6px",
};

const departmentCard = {
  background: "#d9e6ff",
  padding: "12px",
  borderRadius: "8px",
  marginTop: "10px",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default Home;
