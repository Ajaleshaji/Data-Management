import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const rollNumber = queryParams.get("rollNumber");
  const forceChange = queryParams.get("forceChange") === "true";

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 🔐 PASSWORD STATES (UNCHANGED)
  const [showPopup, setShowPopup] = useState(forceChange);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (rollNumber) fetchFiles();
  }, [rollNumber]);

  const fetchFiles = async () => {
    try {
      const res = await fetch(
        `https://data-management-1-rkqx.onrender.com/api/student-files/${rollNumber}`
      );
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const uploadFile = async () => {
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("rollNumber", rollNumber);

    try {
      setLoading(true);
      const res = await fetch(
        `https://data-management-1-rkqx.onrender.com/api/student-files/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Upload failed");

      setFile(null);
      document.getElementById("file-upload").value = "";
      fetchFiles();
    } catch {
      alert("File upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await fetch(
        `https://data-management-1-rkqx.onrender.com/api/student-files/delete/${id}`,
        { method: "DELETE" }
      );
      fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openPreview = (url) => {
    if (!url) return;
    setPreviewUrl(url);
  };

  // 🔐 CHANGE PASSWORD (UNCHANGED)
  const updatePassword = async () => {
    if (!newPassword || !confirmPassword)
      return setPasswordError("All fields are required");

    if (newPassword !== confirmPassword)
      return setPasswordError("Passwords do not match");

    try {
      setPasswordLoading(true);
      await fetch(
        "https://data-management-1-rkqx.onrender.com/api/students/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rollNumber, newPassword }),
        }
      );
      setShowPopup(false);
    } catch {
      setPasswordError("Password update failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAVBAR */}
      <nav className="bg-[#0D9488] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="hover:bg-white/10 p-2 rounded-full"
            >
              ←
            </button>
            <h1 className="text-lg font-bold">Student Documents</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase opacity-70 font-bold">
              Student Profile
            </p>
            <p className="text-sm font-medium">{rollNumber}</p>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-8">
        {/* UPLOAD */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-lg font-bold mb-2">Upload Files</h2>
            <p className="text-xs text-gray-500 mb-6">
              Upload assignments, IDs, or certificates.
            </p>

            <div className="relative border-2 border-dashed rounded-xl p-6 bg-gray-50">
              <input
                id="file-upload"
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <p className="text-center text-sm font-medium">
                {file ? file.name : "Click to browse or drag file"}
              </p>
            </div>

            <button
              onClick={uploadFile}
              disabled={loading || !file}
              className="w-full mt-4 py-3 bg-[#0D9488] text-white font-bold rounded-xl disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Submit File"}
            </button>
          </div>
        </div>

        {/* FILE LIST */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border">
          <div className="px-6 py-4 border-b flex justify-between bg-gray-50">
            <h3 className="font-bold">Recent Uploads</h3>
            <span className="text-xs font-bold bg-[#0D9488]/10 text-[#0D9488] px-3 py-1 rounded-full">
              {files.length} Files
            </span>
          </div>

          {files.map((f) => (
            <div
              key={f._id}
              className="px-6 py-4 flex justify-between hover:bg-gray-50"
            >
              <button
                onClick={() => openPreview(f.previewUrl)}
                className="font-bold text-gray-700 hover:text-[#0D9488]"
              >
                {f.fileName}
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

      {/* 🔍 PREVIEW MODAL */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded-xl overflow-hidden">
            <div className="flex justify-between px-4 py-2 border-b bg-gray-50">
              <h3 className="text-sm font-bold">File Preview</h3>
              <button onClick={() => setPreviewUrl(null)}>✕</button>
            </div>
            <img src={previewUrl} className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* 🔐 CHANGE PASSWORD MODAL (KEPT) */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-3 p-3 border rounded"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-3 p-3 border rounded"
            />

            {passwordError && (
              <p className="text-red-500 text-sm mb-2">{passwordError}</p>
            )}

            <button
              onClick={updatePassword}
              disabled={passwordLoading}
              className="w-full py-3 bg-[#0D9488] text-white rounded font-bold"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
