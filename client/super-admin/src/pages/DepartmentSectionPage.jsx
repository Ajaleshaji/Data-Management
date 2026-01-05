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

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/students?department=${department}&section=${section}`
      );
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students);
      } else {
        setMessage(data.msg || "Error fetching students");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

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
      const res = await fetch("http://localhost:5000/api/students/create-many", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: generated }),
      });

      if (res.ok) {
        setMessage("Students generated successfully");
        setStartRoll("");
        setEndRoll("");
        fetchStudents();
      } else {
        setMessage("Error saving students");
      }
    } catch {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const openStudentDashboard = (rollNumber) => {
    navigate(`/student-dashboard/${rollNumber}`, {
      state: { rollNumber, department, section },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Header / Breadcrumbs */}
      <nav className="bg-[#0D9488] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              ←
            </button>
            <h1 className="text-lg font-bold">
              {department} <span className="opacity-60 mx-1">/</span> Section {section}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase opacity-70 font-bold tracking-widest">Administrator</p>
            <p className="text-sm font-medium">{adminId || "N/A"}</p>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Generator Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Bulk Register Students</h3>
              <p className="text-xs text-gray-500 mb-6">
                Enter roll numbers (e.g., 23CS001) to auto-generate accounts.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block tracking-wider">Start Roll Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 23CS001"
                    value={startRoll}
                    onChange={(e) => setStartRoll(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block tracking-wider">End Roll Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 23CS060"
                    value={endRoll}
                    onChange={(e) => setEndRoll(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all text-sm"
                  />
                </div>

                <button 
                  onClick={generateStudents}
                  disabled={loading}
                  className="w-full py-3 bg-[#0D9488] hover:bg-[#0b7a6f] text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate Students"}
                </button>

                {message && (
                  <div className={`p-3 rounded-lg text-center text-xs font-bold ${
                    message.includes("successfully") ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Student List Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800 tracking-tight">Registered Students</h3>
                <span className="text-xs font-bold bg-[#0D9488]/10 text-[#0D9488] px-3 py-1 rounded-full">
                  {students.length} Total
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-bold">#</th>
                      <th className="px-6 py-4 font-bold">Roll Number</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 text-right font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400 text-sm italic">
                          No students registered in this section yet.
                        </td>
                      </tr>
                    ) : (
                      students.map((stu, idx) => (
                        <tr key={idx} className="hover:bg-teal-50/30 transition-colors group">
                          <td className="px-6 py-4 text-xs text-gray-400 font-medium">{idx + 1}</td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-gray-700 group-hover:text-[#0D9488] transition-colors">
                              {stu.rollNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => openStudentDashboard(stu.rollNumber)}
                              className="text-xs font-bold text-[#0D9488] hover:bg-[#0D9488] hover:text-white px-3 py-1.5 rounded-lg border border-[#0D9488] transition-all"
                            >
                              View Dashboard
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
    </div>
  );
}

export default DepartmentSectionPage;