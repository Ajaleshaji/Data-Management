import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Data from URL or Params
  const rollNumber = queryParams.get("rollNumber");
  const forceChange = queryParams.get("forceChange") === "true";

  // State Management
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Password Popup States
  const [showPopup, setShowPopup] = useState(forceChange);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (rollNumber) {
      fetchFiles();
    }
  }, [rollNumber]);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/student-files/${rollNumber}`);
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
      const res = await fetch("http://localhost:5000/api/student-files/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      setFile(null);
      const input = document.getElementById("file-upload");
      if (input) input.value = "";
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
      await fetch(`http://localhost:5000/api/student-files/delete/${id}`, {
        method: "DELETE",
      });
      fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);
      await fetch("http://localhost:5000/api/students/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, newPassword }),
      });
      setShowPopup(false);
    } catch {
      setPasswordError("Password update failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => navigate("/");

  if (!rollNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="p-10 bg-white rounded-3xl shadow-sm border border-gray-200 text-center">
          <p className="mb-6 text-gray-500 font-medium">No active session found</p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-[#0D9488] text-white rounded-xl font-bold hover:bg-[#0b7a6f] transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900">
      {/* --- NAVIGATION --- */}
      <nav className="bg-[#0D9488] text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg text-2xl">🎓</div>
            <h1 className="font-black text-xl tracking-tight uppercase">Student Portal</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right border-r border-white/20 pr-6">
              <p className="text-[10px] uppercase opacity-70 font-bold tracking-widest">Logged in as</p>
              <p className="text-sm font-bold">{rollNumber}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-[#0D9488] px-5 py-2 rounded-xl font-bold hover:bg-teal-50 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* LEFT: Upload Card */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
              <div className="mb-6">
                <h2 className="text-xl font-black text-gray-800">Upload Files</h2>
                <p className="text-sm text-gray-500 mt-1">Submit your assignments or IDs</p>
              </div>

              <div className="relative group">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center bg-gray-50 group-hover:border-[#0D9488] transition-all">
                  <input
                    id="file-upload"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-3">
                    <div className="text-4xl">📁</div>
                    <p className="font-bold text-gray-600 truncate px-2">
                      {file ? file.name : "Select Document"}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Max 5MB • PDF, PNG, JPG</p>
                  </div>
                </div>
              </div>

              <button
                onClick={uploadFile}
                disabled={loading || !file}
                className="mt-6 w-full py-4 bg-[#0D9488] text-white rounded-2xl font-bold shadow-md shadow-teal-900/10 hover:bg-[#0b7a6f] active:scale-[0.98] transition-all disabled:opacity-40"
              >
                {loading ? "Processing..." : "Upload to Cloud"}
              </button>
            </div>
          </div>

          {/* RIGHT: Document List */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h3 className="font-black text-gray-800 text-lg uppercase tracking-tight">Recent Uploads</h3>
                <span className="text-xs font-black bg-[#0D9488]/10 text-[#0D9488] px-4 py-1.5 rounded-full border border-[#0D9488]/10">
                  {files.length} Documents
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {files.length === 0 ? (
                  <div className="py-24 text-center">
                    <div className="text-6xl mb-4 opacity-20">📂</div>
                    <p className="text-gray-400 font-medium">No documents found for this account.</p>
                  </div>
                ) : (
                  files.map((f) => (
                    <div key={f._id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                      <div className="flex items-center gap-5 overflow-hidden">
                        <div className="w-12 h-12 bg-[#0D9488]/5 rounded-2xl flex items-center justify-center text-[#0D9488] font-black text-xs shrink-0 border border-[#0D9488]/10">
                          {f.fileName.split('.').pop().toUpperCase().substring(0, 3)}
                        </div>
                        <div className="truncate">
                          <a
                            href={f.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-gray-800 hover:text-[#0D9488] transition-colors truncate block"
                          >
                            {f.fileName}
                          </a>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">Cloud Secured • Verified</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteFile(f._id)}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all md:opacity-0 group-hover:opacity-100"
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="mt-8 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4 items-start">
               <span className="text-xl">ℹ️</span>
               <p className="text-xs text-blue-800 leading-relaxed font-medium">
                 Your documents are hosted on Cloudinary secure servers. Only authorized staff and yourself can access these files. To view a file, simply click on its name.
               </p>
            </div>
          </div>
        </div>
      </main>

      {/* --- PASSWORD MODAL --- */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🔑</div>
              <h2 className="text-2xl font-black text-gray-800">Security Update</h2>
              <p className="text-sm text-gray-500 mt-2">You are using a default password. Please update it to protect your account.</p>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0D9488] outline-none transition-all"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0D9488] outline-none transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {passwordError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100">
                  ⚠️ {passwordError}
                </div>
              )}

              <button
                onClick={updatePassword}
                disabled={passwordLoading}
                className="w-full py-4 bg-[#0D9488] text-white rounded-2xl font-black shadow-lg shadow-teal-900/20 hover:bg-[#0b7a6f] transition-all disabled:opacity-50 mt-4"
              >
                {passwordLoading ? "Saving Changes..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;