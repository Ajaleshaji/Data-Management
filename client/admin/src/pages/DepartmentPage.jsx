import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function DepartmentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get adminId from query params
  const queryParams = new URLSearchParams(location.search);
  const adminId = queryParams.get("adminId");

  const [departmentName, setDepartmentName] = useState("");
  const [section, setSection] = useState("");
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");

  /* ---------------- FETCH DEPARTMENTS ---------------- */
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/departments");
      const data = await res.json();
      setDepartments(data.departments || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  /* ---------------- CREATE DEPARTMENT + SECTION ---------------- */
  const handleAddDepartment = async (e) => {
    e.preventDefault();

    if (!departmentName || !section) {
      setMessage("Please enter Department and Section");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/departments/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            departmentName,
            sections: [section],
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.msg || "Error creating department");
        return;
      }

      setMessage("Department & Section created successfully");
      setDepartmentName("");
      setSection("");
      fetchDepartments();
    } catch (error) {
      console.error("Create error:", error);
      setMessage("Server error");
    }
  };

  /* ---------------- NAVIGATE TO SECTION PAGE ---------------- */
  const handleSectionClick = (dept, sec) => {
    navigate(`/department-section/${dept}/${sec}?adminId=${adminId}`);
  };

  return (
    <div style={container}>
      <h1>Admin Department Management</h1>
      <p>
        <strong>Admin ID:</strong> {adminId}
      </p>

      {/* -------- ADD FORM -------- */}
      <h3>Add Department & Section</h3>
      <form onSubmit={handleAddDepartment}>
        <input
          type="text"
          placeholder="Department Name (e.g. CSE)"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          style={input}
        />

        <input
          type="text"
          placeholder="Section (e.g. A)"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          style={input}
        />

        <button type="submit" style={button}>
          Add
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* -------- SECTION CONTAINERS -------- */}
      <h3>Departments & Sections</h3>

      {departments.length === 0 ? (
        <p>No departments found</p>
      ) : (
        departments.map((dept, dIdx) =>
          dept.sections.map((sec, sIdx) => (
            <div
              key={`${dIdx}-${sIdx}`}
              style={sectionCard}
              onClick={() =>
                handleSectionClick(dept.departmentName, sec)
              }
            >
              <h4>{dept.departmentName}</h4>
              <p>Section: {sec}</p>
            </div>
          ))
        )
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const container = {
  maxWidth: "600px",
  margin: "50px auto",
  padding: "20px",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  fontSize: "16px",
};

const button = {
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const sectionCard = {
  border: "1px solid #4CAF50",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "12px",
  backgroundColor: "#f9fff9",
  cursor: "pointer",
};

export default DepartmentPage;
