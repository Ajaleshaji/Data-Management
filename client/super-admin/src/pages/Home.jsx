import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const SUPER_ADMIN_ID = "superadmin";
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/superadmin/get-admins?superAdminId=${SUPER_ADMIN_ID}`
      );
      if (!res.ok) throw new Error("Failed to fetch admins");
      const data = await res.json();
      setAdmins(data.admins || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const createAdmin = async () => {
    if (!adminId || !password || !department) {
      return setMessage("All fields are required");
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/superadmin/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          superAdminId: SUPER_ADMIN_ID,
          adminId,
          password,
          department,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Admin created successfully!");
        setAdminId("");
        setPassword("");
        setDepartment("");
        fetchAdmins();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Header - Fixed Full Width */}
      <nav className="bg-[#0D9488] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">Super Admin Portal</h1>
          <button 
            onClick={() => navigate("/")}
            className="text-sm bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2 rounded-md transition-all active:scale-95"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area - Increased Width for Better Balance */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Sidebar: Create Admin Form - Fixed Width on Large Screens */}
          <div className="w-full lg:w-[380px] shrink-0 sticky lg:top-24">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                Register Admin
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Credentials</label>
                  <input
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all text-sm mb-3"
                    type="text"
                    placeholder="Admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                  />
                  <input
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all text-sm"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Assignment</label>
                  <input
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all text-sm"
                    type="text"
                    placeholder="Department Name"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>

                <button 
                  className="w-full py-3 bg-[#0D9488] hover:bg-[#0b7a6f] text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 mt-2"
                  onClick={createAdmin}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Create Admin Account"}
                </button>
                
                {message && (
                  <div className={`mt-4 p-3 rounded-lg text-center text-xs font-medium ${
                    message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content: Department List - Expanded Width */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
                <p className="text-gray-500 text-sm">Manage and view active departments</p>
              </div>
              <span className="bg-[#0D9488]/10 text-[#0D9488] text-sm px-4 py-1.5 rounded-full font-bold">
                {admins.length} Total
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {admins.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">No departments found. Create one to get started.</p>
                </div>
              ) : (
                admins.map((admin, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/department/${admin.department}`)}
                    className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#0D9488] hover:shadow-xl hover:shadow-teal-900/5 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] text-[#0D9488] font-black uppercase tracking-widest">Active Dept</p>
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#0D9488] leading-tight">
                          {admin.department}
                        </h3>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#0D9488] group-hover:text-white transition-all transform group-hover:rotate-12">
                        →
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;