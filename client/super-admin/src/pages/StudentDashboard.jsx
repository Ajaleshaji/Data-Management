import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function StudentDashboard() {
  const { rollNumber } = useParams();
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await fetch(`http://localhost:5000/api/student-files/${rollNumber}`);
    const data = await res.json();
    setFiles(data);
  };

  const uploadFile = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("rollNumber", rollNumber);

    await fetch("http://localhost:5000/api/student-files/upload", {
      method: "POST",
      body: formData,
    });

    setFile(null);
    fetchFiles();
  };

  const deleteFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    await fetch(`http://localhost:5000/api/student-files/delete/${id}`, {
      method: "DELETE",
    });

    fetchFiles(); // refresh list
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>Student Dashboard</h2>
      <p><strong>Roll Number:</strong> {rollNumber}</p>

      <hr />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={uploadFile}>Upload File</button>

      <hr />

      <h3>Uploaded Files</h3>
      {files.length === 0 && <p>No files uploaded</p>}
      {files.map((f) => (
        <div key={f._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a
            href={`http://localhost:5000/uploads/${f.filePath}`}
            target="_blank"
            rel="noreferrer"
          >
            {f.fileName}
          </a>
          <button onClick={() => deleteFile(f._id)} style={{ marginLeft: "10px", color: "red" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default StudentDashboard;
