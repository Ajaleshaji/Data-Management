import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BACKEND_URL from "../config/api";

function StudentDashboard() {
  const { rollNumber } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchFiles();
  }, [rollNumber]);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/student-files/${rollNumber}`);
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

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
      const res = await fetch(`${BACKEND_URL}/api/student-files/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchFiles();
    } catch (err) {
      alert("File upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await fetch(`${BACKEND_URL}/api/student-files/delete/${id}`, {
        method: "DELETE",
      });
      fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ SAME AS FIRST CODE
  const openPreview = (url) => {
    if (!url) return;
    setPreviewUrl(url);
  };

  const getFileExtension = (name) =>
    name.split(".").pop().toUpperCase().substring(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HEADER */}
      <nav className="bg-[#0D9488] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <button onClick={() => navigate(-1)}>←</button>
          <span className="font-bold">{rollNumber}</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* UPLOAD */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow">
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            onClick={uploadFile}
            disabled={loading}
            className="mt-4 w-full bg-[#0D9488] text-white py-2 rounded"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* FILE LIST */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow">
          {files.map((f) => (
            <div
              key={f._id}
              className="flex justify-between items-center p-4 border-b"
            >
              <button
                onClick={() => openPreview(f.previewUrl || f.fileUrl)}
                className="text-left font-bold text-gray-700 hover:text-[#0D9488]"
              >
                {getFileExtension(f.fileName)} - {f.fileName}
              </button>

              <button
                onClick={() => deleteFile(f._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ PREVIEW MODAL — EXACTLY LIKE FIRST CODE */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded-xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50">
              <h3 className="text-sm font-bold text-gray-700">File Preview</h3>
              <button
                onClick={() => setPreviewUrl(null)}
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
