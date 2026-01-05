// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const rollNumber = queryParams.get("rollNumber");

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rollNumber) {
      fetchFiles();
    }
  }, [rollNumber]);

  /* ---------- FETCH FILES ---------- */
  const fetchFiles = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/student-files/${rollNumber}`
      );
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  /* ---------- UPLOAD FILE ---------- */
  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("rollNumber", rollNumber);

    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:5000/api/student-files/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      setFile(null);
      fetchFiles();
    } catch (err) {
      alert("File upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DELETE FILE ---------- */
  const deleteFile = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(
        `http://localhost:5000/api/student-files/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (!rollNumber) {
    return <p>Please login first.</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>Student Dashboard</h2>

      <p>
        <strong>Roll Number:</strong> {rollNumber}
      </p>

      <hr />

      {/* ---------- UPLOAD SECTION ---------- */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br /><br />

      <button onClick={uploadFile} disabled={loading}>
        {loading ? "Uploading..." : "Upload File"}
      </button>

      <hr />

      {/* ---------- FILE LIST ---------- */}
      <h3>Uploaded Files</h3>

      {files.length === 0 && <p>No files uploaded</p>}

      {files.map((f) => (
        <div
          key={f._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <a href={f.fileUrl} target="_blank" rel="noreferrer">
            {f.fileName}
          </a>

          <button
            onClick={() => deleteFile(f._id)}
            style={{ color: "red" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
