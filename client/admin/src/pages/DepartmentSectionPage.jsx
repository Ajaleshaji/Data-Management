import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

function DepartmentSectionPage() {
  const { department, section } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const adminId = queryParams.get("adminId");

  const [startRoll, setStartRoll] = useState("");
  const [endRoll, setEndRoll] = useState("");
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/students?department=${department}&section=${section}`
      );
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students);
      } else {
        setMessage(data.msg || "Error fetching students");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const generateStudents = async () => {
    if (!startRoll) {
      setMessage("Please enter a start roll number");
      return;
    }

    const prefix = startRoll.slice(0, -3);
    const startNum = parseInt(startRoll.slice(-3));
    const endNum = endRoll ? parseInt(endRoll.slice(-3)) : startNum;

    if (startNum > endNum) {
      setMessage("Invalid roll number range");
      return;
    }

    const generated = [];

    for (let i = startNum; i <= endNum; i++) {
      generated.push({
        rollNumber: prefix + String(i).padStart(3, "0"),
        password: "student@123",
        department,
        section,
      });
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/students/create-many",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ students: generated }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(`${generated.length} student(s) created successfully`);
        setStartRoll("");
        setEndRoll("");
        fetchStudents();
      } else {
        setMessage(data.msg || "Error saving students");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div style={container}>
      <h1>Admin Department Section</h1>

      <p><strong>Admin ID:</strong> {adminId}</p>
      <p><strong>Department:</strong> {department}</p>
      <p><strong>Section:</strong> {section}</p>

      <hr />

      <h3>Create Student(s)</h3>

      <input
        type="text"
        placeholder="Start Roll (e.g., 23CS001)"
        value={startRoll}
        onChange={(e) => setStartRoll(e.target.value)}
        style={input}
      />

      <input
        type="text"
        placeholder="End Roll (optional)"
        value={endRoll}
        onChange={(e) => setEndRoll(e.target.value)}
        style={input}
      />

      <button onClick={generateStudents} style={button}>
        Generate
      </button>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <hr />

      <h3>Students in this Section</h3>

      {students.map((stu) => (
        <div
          key={stu._id}
          style={studentBox}
          onClick={() =>
            navigate(`/admin/student/${stu.rollNumber}`)
          }
        >
          <strong>Roll No:</strong> {stu.rollNumber}
        </div>
      ))}
    </div>
  );
}

/* ---------- STYLES ---------- */
const container = { maxWidth: "600px", margin: "40px auto", padding: "20px" };
const input = { width: "100%", padding: "10px", marginBottom: "10px" };
const button = { padding: "10px 20px", backgroundColor: "#4CAF50", color: "#fff", border: "none", cursor: "pointer" };
const studentBox = {
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "10px",
  marginBottom: "8px",
  backgroundColor: "#f9f9f9",
  cursor: "pointer"
};

export default DepartmentSectionPage;
