import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DepartmentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const adminId = queryParams.get("adminId");

  const [departmentName, setDepartmentName] = useState("");
  const [section, setSection] = useState("");
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/departments");
      const data = await res.json();
      setDepartments(data.departments);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!departmentName || !section) {
      setMessage("Please enter both department and section");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/departments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentName,
          sections: [section],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Department & Section added successfully!");
        setDepartmentName("");
        setSection("");
        fetchDepartments(); // refresh list
      } else {
        setMessage(data.msg || "Error creating department");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  // Redirect to DepartmentSectionPage
  const handleSectionClick = (deptName, secName) => {
    navigate(`/department-section/${deptName}/${secName}?adminId=${adminId}`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "50px auto" }}>
      <h1>Department Management</h1>
      <p><strong>Admin ID:</strong> {adminId}</p>

      <h2>Add Department & Section</h2>
      <form onSubmit={handleAddDepartment}>
        <input
          type="text"
          placeholder="Department Name"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          style={inputStyle}
        /><br /><br />
        <input
          type="text"
          placeholder="Section Name"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          style={inputStyle}
        /><br /><br />
        <button type="submit" style={btnStyle}>Add</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <h2>Existing Departments & Sections</h2>
      {departments.length > 0 ? (
        departments.map((dept, idx) => (
          <div key={idx} style={deptContainer}>
            <h3>{dept.departmentName}</h3>
            {dept.sections.map((sec, sidx) => (
              <div
                key={sidx}
                style={sectionStyle}
                onClick={() => handleSectionClick(dept.departmentName, sec)}
              >
                {dept.departmentName} - {sec} (Click to view details)
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No departments yet</p>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  width: "100%",
  marginBottom: "10px",
};

const btnStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const deptContainer = {
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "10px",
  marginBottom: "10px",
};

const sectionStyle = {
  padding: "5px 10px",
  margin: "5px 0",
  border: "1px solid #aaa",
  borderRadius: "5px",
  backgroundColor: "#f5f5f5",
  cursor: "pointer",
};

export default DepartmentPage;
