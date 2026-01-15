import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentLogin() {
  const navigate = useNavigate();
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://data-management-1-rkqx.onrender.com/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg);
        return;
      }

      navigate(
        `/dashboard?rollNumber=${data.rollNumber}&forceChange=${data.isDefaultPassword}`
      );
    } catch {
      setError("Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-[#0D9488] z-0"></div>

      <div className="relative z-10 w-full max-w-4xl flex bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* LEFT SIDE: Visual/Brand (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-[#0D9488] p-12 flex-col justify-between text-white">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Portal</h1>
            <p className="mt-4 text-teal-100 leading-relaxed">
              Access your academic records, attendance, and department notifications in one place.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm bg-white/10 p-4 rounded-xl border border-white/10">
              <span className="text-xl">📅</span>
              <p>Keep track of your semester progress</p>
            </div>
            <div className="flex items-center gap-3 text-sm bg-white/10 p-4 rounded-xl border border-white/10">
              <span className="text-xl">🔒</span>
              <p>Secure access to student services</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Please enter your credentials to login</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Roll Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                <input
                  type="text"
                  placeholder="Enter your roll number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔑</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="accent-[#0D9488] rounded" /> Remember me
              </label>
              <button type="button" className="text-[#0D9488] font-bold hover:underline">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0D9488] hover:bg-[#0b7a6f] text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-900/20 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 text-sm">
            Admin access? <button onClick={() => navigate('/')} className="text-[#0D9488] font-bold">Click here</button>
          </p>
        </div>
      </div>
      
      {/* Footer info */}
      <p className="mt-8 text-white/60 text-xs relative z-10">
        © 2026 Student Management System • Privacy Policy
      </p>
    </div>
  );
}

export default StudentLogin;