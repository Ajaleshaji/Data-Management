// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const rollNumber = queryParams.get("rollNumber");

  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch student details from backend
    const fetchStudent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/students?rollNumber=${rollNumber}`);
        const data = await res.json();
        if (res.ok) {
          setStudent(data.student);
        } else {
          setMessage(data.msg || "Student not found");
        }
      } catch (err) {
        console.error(err);
        setMessage("Server error");
      }
    };

    if (rollNumber) {
      fetchStudent();
    }
  }, [rollNumber]);

  if (!rollNumber) {
    return <p>Please login first.</p>;
  }

  return (
    <div style={container}>
      <h1>Student Dashboard</h1>
      {message && <p style={{ color: "red" }}>{message}</p>}
      {student ? (
        <div style={infoBox}>
          <p><strong>Roll Number:</strong> {student.rollNumber}</p>
          <p><strong>Department:</strong> {student.department}</p>
          <p><strong>Section:</strong> {student.section}</p>
        </div>
      ) : (
        <p>Loading student details...</p>
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */
const container = { maxWidth: "600px", margin: "50px auto", padding: "20px" };
const infoBox = { border: "1px solid #ccc", borderRadius: "5px", padding: "15px", backgroundColor: "#f9f9f9" };

export default Dashboard;
