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
      <nav className="bg-[#0D9488] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              ←
            </button>
            <h1 className="text-lg font-bold tracking-tight">Student Documents</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase opacity-70 font-bold tracking-widest">
              Student Profile
            </p>
            <p className="text-sm font-medium">{rollNumber || "N/A"}</p>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* UPLOAD PANEL */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Upload Files</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Upload assignments, IDs, or certificates. Supports PDF, JPG, PNG.
              </p>

              <div className="space-y-4">
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-[#0D9488] transition-colors bg-gray-50 group">
                  <input
                    id="file-upload"
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <p className="text-2xl mb-2">📁</p>
                    <p className="text-sm font-medium text-gray-600 group-hover:text-[#0D9488]">
                      {file ? file.name : "Click to browse or drag file"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={uploadFile}
                  disabled={loading || !file}
                  className="w-full py-3 bg-[#0D9488] hover:bg-[#0b7a6f] text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Submit File"}
                </button>
              </div>
            </div>
          </div>

          {/* FILE LIST PANEL */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800 tracking-tight">Recent Uploads</h3>
                <span className="text-xs font-bold bg-[#0D9488]/10 text-[#0D9488] px-3 py-1 rounded-full">
                  {files.length} Files
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {files.length === 0 ? (
                  <div className="px-6 py-20 text-center text-gray-400 italic">
                    No files uploaded yet.
                  </div>
                ) : (
                  files.map((f) => (
                    <div
                      key={f._id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                    >
                      <button
                        onClick={() => openPreview(f.previewUrl)}
                        className="font-bold text-gray-700 hover:text-[#0D9488] text-left transition-colors"
                      >
                        {f.fileName}
                      </button>

                      <button
                        onClick={() => deleteFile(f._id)}
                        className="text-red-500 text-sm font-medium hover:underline px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 PREVIEW MODAL */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <h3 className="font-bold text-gray-700">File Preview</h3>
              <button 
                onClick={() => setPreviewUrl(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4">
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain shadow-lg" />
            </div>
          </div>
        </div>
      )}

      {/* 🔐 CHANGE PASSWORD MODAL */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#0D9488]/10 text-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🔒
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Secure Your Account</h2>
              <p className="text-sm text-gray-500 mt-1">Please set a new password to continue.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition-all"
                />
              </div>

              {passwordError && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 font-medium">
                  ⚠️ {passwordError}
                </div>
              )}

              <button
                onClick={updatePassword}
                disabled={passwordLoading}
                className="w-full py-4 bg-[#0D9488] hover:bg-[#0b7a6f] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#0D9488]/20 disabled:opacity-50 mt-2"
              >
                {passwordLoading ? "Updating Security..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;