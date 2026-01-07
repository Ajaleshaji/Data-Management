import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DepartmentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Query params
  const queryParams = new URLSearchParams(location.search);
  const adminId = queryParams.get("adminId") || "Admin"; 
  
  // Department from URL → /admin-department/CSE
  const departmentFromURL = window.location.pathname.split("/").pop();

  const [section, setSection] = useState("");
  const [department, setDepartment] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartment();
  }, []);

  const fetchDepartment = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/departments/${departmentFromURL}`
      );
      const data = await res.json();
      setDepartment(data.department || null);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!section) {
      setMessage("Please enter a section");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/departments/create", {
        // Correcting to POST as per your requirement
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentName: departmentFromURL,
          sections: [section],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Section added successfully!");
        setSection("");
        fetchDepartment();
      } else {
        setMessage(data.msg || "Error adding section");
      }
    } catch (err) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = (secName) => {
    navigate(
      `/department-section/${departmentFromURL}/${secName}?adminId=${adminId}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="bg-[#0D9488] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* Left Side: Brand/Back */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="hover:bg-white/10 p-2 rounded-full transition-colors font-bold flex items-center justify-center w-10 h-10"
            >
              ←
            </button>
            <h1 className="text-xl font-bold tracking-tight uppercase">
                {departmentFromURL} <span className="opacity-80 font-normal">Dept</span>
            </h1>
          </div>
          
          {/* Right Side: Admin Info & Logout */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end border-r border-white/20 pr-6">
              <span className="text-[10px] uppercase opacity-80 leading-none font-bold tracking-wider">Session Admin</span>
              <span className="text-sm font-medium tracking-wide">{adminId}</span>
            </div>

            <button 
              onClick={() => navigate("/")}
              className="text-sm bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2 rounded-md transition-all active:scale-95 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight capitalize">
            {departmentFromURL.replace(/-/g, ' ')} <span className="text-[#0D9488]">Management</span>
          </h2>
          <p className="text-gray-500 mt-1 italic">Authorized portal for configuring academic sections.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT: Add Section Form */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Configure</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Add new academic sections to the {departmentFromURL} department.
              </p>
              
              <form onSubmit={handleAddSection} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Section Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Section A"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all text-sm font-medium"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0D9488] hover:bg-[#0b7a6f] text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Section"}
                </button>
              </form>

              {message && (
                <div className={`mt-4 p-3 rounded-lg text-center text-xs font-bold border ${
                  message.includes("successfully") 
                    ? "bg-green-50 text-green-700 border-green-100" 
                    : "bg-red-50 text-red-700 border-red-100"
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Sections Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Active Sections</h2>
              <span className="bg-[#0D9488]/10 text-[#0D9488] text-sm px-4 py-1.5 rounded-full font-bold">
                {department?.sections?.length || 0} Total
              </span>
            </div>

            {department && department.sections.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {department.sections.map((sec, idx) => (
                  <div
                    key={`${department.departmentName}-${idx}`}
                    onClick={() => handleSectionClick(sec)}
                    className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#0D9488] hover:shadow-xl hover:shadow-teal-900/5 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#0D9488] group-hover:bg-[#0D9488] group-hover:text-white transition-all font-bold text-lg">
                        {sec.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">Section</p>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#0D9488] transition-colors">
                          {sec}
                        </h3>
                      </div>
                    </div>
                    <div className="text-gray-300 group-hover:text-[#0D9488] transition-all transform group-hover:translate-x-1 font-bold">
                      →
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                   <span className="text-2xl">📁</span>
                </div>
                <p className="font-medium text-lg">No sections registered yet.</p>
                <p className="text-sm">Use the form on the left to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartmentPage;