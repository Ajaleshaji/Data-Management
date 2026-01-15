import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

function DepartmentSectionPage() {
  const { department, section } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const adminId = queryParams.get("adminId");

  const [startRoll, setStartRoll] = useState("");
  const [endRoll, setEndRoll] = useState("");
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [department, section]);

  /* ---------- FETCH STUDENTS ---------- */
  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `https://data-management-1-rkqx.onrender.com/api/students?department=${department}&section=${section}`
      );
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students || []);
      } else {
        setMessage(data.msg || "Error fetching students");
      }
    } catch (err) {
      setMessage("Server error connecting to database");
    }
  };

  /* ---------- GENERATE STUDENTS ---------- */
  const generateStudents = async () => {
    if (!startRoll) {
      setMessage("Please enter start roll number");
      return;
    }
    setLoading(true);

    const prefix = startRoll.slice(0, -3);
    const startNum = parseInt(startRoll.slice(-3));
    const endNum = endRoll ? parseInt(endRoll.slice(-3)) : startNum;

    if (isNaN(startNum) || startNum > endNum) {
      setMessage("Invalid roll range");
      setLoading(false);
      return;
    }

    const generated = [];
    for (let i = startNum; i <= endNum; i++) {
      generated.push({
        rollNumber: prefix + String(i).padStart(3, "0"),
        password: "student@123",
        department,
        section,
      });
    }

    try {
      const res = await fetch("https://data-management-1-rkqx.onrender.com/api/students/create-many", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: generated }),
      });

      if (res.ok) {
        setMessage(`${generated.length} accounts created successfully`);
        setStartRoll("");
        setEndRoll("");
        fetchStudents();
      } else {
        setMessage("Error saving students to database");
      }
    } catch {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DELETE STUDENT ---------- */
  const deleteStudent = async (rollNumber) => {
    if (!window.confirm(`Are you sure you want to delete ${rollNumber}?`)) return;

    try {
      const res = await fetch(`https://data-management-1-rkqx.onrender.com/api/students/${rollNumber}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Student deleted successfully");
        fetchStudents();
      } else {
        setMessage("Failed to delete student");
      }
    } catch {
      setMessage("Server error during deletion");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- TOP NAVIGATION --- */}
      <nav className="bg-[#0D9488] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="hover:bg-white/10 p-2 rounded-full transition-colors font-bold"
            >
              ←
            </button>
            <h1 className="text-xl font-bold tracking-tight">
              {department} <span className="opacity-50 mx-1">/</span> Section {section}
            </h1>
          </div>
          <div className="bg-white/10 px-4 py-1.5 rounded-lg border border-white/20 text-right">
            <span className="text-[10px] uppercase font-bold opacity-70 block leading-none">Admin Panel</span>
            <span className="text-sm font-medium">{adminId || "Administrator"}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT: Generator Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Bulk Enrollment</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Generate student accounts automatically by defining a range (e.g., 23CS001 to 23CS060).
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Start Roll Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 23CS001"
                    value={startRoll}
                    onChange={(e) => setStartRoll(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">End Roll Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 23CS060"
                    value={endRoll}
                    onChange={(e) => setEndRoll(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all text-sm font-medium"
                  />
                </div>
                
                <button 
                  onClick={generateStudents}
                  disabled={loading}
                  className="w-full py-3 bg-[#0D9488] hover:bg-[#0b7a6f] text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Generate Accounts"}
                </button>

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
          </div>

          {/* RIGHT: Student List Table */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Student Records</h2>
                <p className="text-sm text-gray-500">Manage profiles for {department} Section {section}.</p>
              </div>
              <div className="h-10 px-4 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-[#0D9488] font-bold shadow-sm">
                {students.length} Students
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-bold">#</th>
                    <th className="px-6 py-4 font-bold">Roll Number</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center text-gray-400">
                        <p className="text-lg font-medium">No students registered yet.</p>
                        <p className="text-sm italic">Use the enrollment form to add students.</p>
                      </td>
                    </tr>
                  ) : (
                    students.map((stu, idx) => (
                      <tr key={stu._id} className="hover:bg-teal-50/30 transition-colors group">
                        <td className="px-6 py-4 text-xs text-gray-400 font-medium">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-700 group-hover:text-[#0D9488] transition-colors">
                            {stu.rollNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => navigate(`/student-dashboard/${stu.rollNumber}`)}
                            className="text-xs font-bold text-[#0D9488] bg-[#0D9488]/5 hover:bg-[#0D9488] hover:text-white px-3 py-1.5 rounded-lg transition-all border border-[#0D9488]/10"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => deleteStudent(stu.rollNumber)}
                            className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg transition-all border border-red-100"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DepartmentSectionPage;