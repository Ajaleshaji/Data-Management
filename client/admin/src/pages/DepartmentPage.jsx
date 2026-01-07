import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function DepartmentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const adminId = queryParams.get("adminId");

  const [departmentName, setDepartmentName] = useState("");
  const [section, setSection] = useState("");
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/departments");
      const data = await res.json();
      setDepartments(data.departments || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  /* ---------------- LOGOUT ACTION ---------------- */
  const handleLogout = () => {
    // Clear any auth states if necessary
    navigate("/"); 
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!departmentName || !section) {
      setMessage("Please enter Department and Section");
      return;
    }
    setLoading(true);

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
      if (!res.ok) {
        setMessage(data.msg || "Error creating department");
        return;
      }

      setMessage("Created successfully!");
      setDepartmentName("");
      setSection("");
      fetchDepartments();
    } catch (error) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = (dept, sec) => {
    navigate(`/department-section/${dept}/${sec}?adminId=${adminId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="bg-[#0D9488] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight">Admin Console</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right border-r border-white/20 pr-4">
              <span className="text-[10px] uppercase font-bold opacity-70 block leading-none">Administrator</span>
              <span className="text-sm font-medium">{adminId || "Admin"}</span>
            </div>

            {/* --- LOGOUT BUTTON (Matching Teal Theme) --- */}
            <button 
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT: Add Department Form */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Create Department</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Register a new department and its initial section in the system.
              </p>
              
              <form onSubmit={handleAddDepartment} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Department Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSE"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Initial Section
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
                  {loading ? "Creating..." : "Add Department"}
                </button>
              </form>

              {message && (
                <div className="mt-4 p-3 rounded-lg text-center text-xs font-bold border bg-gray-50 text-[#0D9488] border-teal-100">
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Departments & Sections Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Department Inventory</h2>
                <p className="text-sm text-gray-500">Manage all registered departments and their active sections.</p>
              </div>
            </div>

            {departments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {departments.map((dept) =>
                  dept.sections.map((sec, sIdx) => (
                    <div
                      key={`${dept.departmentName}-${sIdx}`}
                      onClick={() => handleSectionClick(dept.departmentName, sec)}
                      className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#0D9488] hover:shadow-xl hover:shadow-teal-900/5 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#0D9488] group-hover:bg-[#0D9488] group-hover:text-white transition-all font-bold text-lg">
                          {dept.departmentName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">
                            {dept.departmentName}
                          </p>
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#0D9488] transition-colors">
                            Section {sec}
                          </h3>
                        </div>
                      </div>
                      <div className="text-gray-300 group-hover:text-[#0D9488] transition-all transform group-hover:translate-x-1">
                        →
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="w-full py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <p className="font-medium text-lg">No departments registered.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartmentPage;