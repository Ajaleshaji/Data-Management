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

  useEffect(() => {
    fetchFiles();
  }, [rollNumber]);

  const fetchFiles = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/student-files/${rollNumber}`
      );
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
    formData.append("upload_preset", "Certificate");
    try {
      setLoading(true);
      const res = await fetch(
        `${BACKEND_URL}/api/student-files/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      setFile(null);
      document.getElementById("file-upload").value = "";
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
      await fetch(
        `${BACKEND_URL}/api/student-files/delete/${id}`,
        { method: "DELETE" }
      );
      fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 🔥 FORCE INLINE PREVIEW URL
  const openPreview = (url) => {
    if (!url) return;
    setPreviewUrl(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-[#0D9488] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              ←
            </button>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Student Documents
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase opacity-70 font-bold tracking-widest">
              Student Profile
            </p>
            <p className="text-sm font-medium">{rollNumber}</p>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Upload Files
              </h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Upload assignments, IDs, or certificates. Supports PDF, JPG, PNG.
              </p>

              <div className="space-y-4">
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-[#0D9488] transition-colors bg-gray-50 group">
                  <input
                    id="file-upload"
                    type="file"
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

          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800 tracking-tight">
                  Recent Uploads
                </h3>
                <span className="text-xs font-bold bg-[#0D9488]/10 text-[#0D9488] px-3 py-1 rounded-full">
                  {files.length} Files
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {files.length === 0 ? (
                  <div className="px-6 py-20 text-center">
                    No files uploaded yet.
                  </div>
                ) : (
                  files.map((f) => (
                    <div
                      key={f._id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                    >
                      <button
                        onClick={() => openPreview(f.previewUrl || f.fileUrl)}
                        className="font-bold text-gray-700 hover:text-[#0D9488]"
                      >
                        {f.fileName}
                      </button>

                      <button
                        onClick={() => deleteFile(f._id)}
                        className="text-red-500 hover:underline"
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

      {previewUrl && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded-xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50">
              <h3 className="text-sm font-bold text-gray-700">File Preview</h3>
              <button
                onClick={() => setPreviewUrl(null)}
                className="text-red-500 font-bold text-lg hover:bg-red-50 px-3 rounded"
              >
                ✕
              </button>
            </div>

            {previewUrl.includes(".pdf") ? (
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
                allow="fullscreen"
                sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-popups"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
