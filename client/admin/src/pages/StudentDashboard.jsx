import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import BACKEND_URL from "../config/api";

function StudentDashboard() {
  const { rollNumber } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = React.useRef(null);

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

  // Helper to get extension for the icon
  const getFileExtension = (name) => name.split(".").pop().toUpperCase().substring(0, 3);

  // Professional Preview Handler
  const openPreview = (url) => {
    if (!url) return;
    setPreviewUrl(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- HEADER --- */}
      <nav className="bg-[#0D9488] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="hover:bg-white/10 p-2 rounded-full transition-colors font-bold"
            >
              ←
            </button>
            <h1 className="text-xl font-bold tracking-tight">Student Dashboard</h1>
          </div>
          <div className="bg-white/10 px-4 py-1.5 rounded-lg border border-white/20 text-right">
            <span className="text-[10px] uppercase font-bold opacity-70 block leading-none text-white">ID Number</span>
            <span className="text-sm font-medium">{rollNumber}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- LEFT: UPLOAD CARD --- */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Upload Documents</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Add assignments, certifications, or identity proofs to your cloud storage.
              </p>

              <div className="space-y-4">
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-[#0D9488] transition-colors bg-gray-50 group text-center">
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="pointer-events-none">
                    <span className="text-3xl block mb-2">📄</span>
                    <p className="text-sm font-bold text-gray-600 group-hover:text-[#0D9488]">
                      {file ? file.name : "Choose a file"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                      PDF, JPG, PNG (Max 5MB)
                    </p>
                  </div>
                </div>

                <button
                  onClick={uploadFile}
                  disabled={loading || !file}
                  className="w-full py-3 bg-[#0D9488] hover:bg-[#0b7a6f] text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:bg-gray-300"
                >
                  {loading ? "Uploading..." : "Upload to Cloud"}
                </button>
              </div>
            </div>
          </div>

          {/* --- RIGHT: FILE LIST --- */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800 tracking-tight">Your Files</h3>
                <span className="text-xs font-bold bg-[#0D9488]/10 text-[#0D9488] px-3 py-1 rounded-full">
                  {files.length} Saved
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {files.length === 0 ? (
                  <div className="px-6 py-20 text-center flex flex-col items-center">
                    <span className="text-4xl mb-4 opacity-20">📁</span>
                    <p className="text-gray-400 font-medium">No documents found in your profile.</p>
                  </div>
                ) : (
                  files.map((f) => (
                    <div key={f._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-[#0D9488] font-black text-[10px] shrink-0 border border-teal-100">
                          {getFileExtension(f.fileName)}
                        </div>
                        <div className="truncate">
                          <button
                            onClick={() => openPreview(f.previewUrl || f.fileUrl)}
                            className="font-bold text-gray-700 hover:text-[#0D9488] truncate block text-sm transition-colors text-left"
                          >
                            {f.fileName}
                          </button>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Click to Preview
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteFile(f._id)}
                        className="ml-4 p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <span role="img" aria-label="delete">🗑️</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Hint Box */}
            <div className="mt-6 p-4 bg-teal-50 rounded-2xl border border-teal-100 flex gap-3 items-start">
              <span className="text-teal-600 font-bold">ℹ️</span>
              <p className="text-xs text-teal-800 leading-relaxed font-medium">
                Click on a file name to preview it. Deleted files cannot be recovered as they are permanently removed from the cloud server.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* --- PREVIEW MODAL --- */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 transition-opacity duration-300">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Document Preview</h3>
              <button
                onClick={() => setPreviewUrl(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                title="Close Preview"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 bg-gray-50 relative overflow-hidden flex items-center justify-center p-2">
              {previewUrl.toLowerCase().includes(".pdf") ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full rounded-lg border border-gray-200 bg-white shadow-inner"
                  title="PDF Preview"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-popups"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;