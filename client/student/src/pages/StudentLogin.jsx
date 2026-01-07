// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentLogin() {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!rollNumber || !password) {
      setMessage("Please enter Roll Number and Password");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, password }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate(`/dashboard?rollNumber=${rollNumber}`);
      } else {
        setMessage(data.msg || "Invalid Roll Number or Password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Top Decorative Bar */}
        <div className="bg-[#0D9488] h-2 w-full"></div>

        <div className="p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-teal-50 text-[#0D9488] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner font-bold">
              🎓
            </div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Student Login</h2>
            <p className="text-sm text-gray-500 mt-2">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Roll Number Input */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                Roll Number
              </label>
              <input
                type="text"
                placeholder="e.g. 23CS001"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0D9488] hover:bg-[#0b7a6f] text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>

          {/* Message Alert */}
          {message && (
            <div className="mt-6 p-3 rounded-lg text-center text-xs font-bold border bg-gray-50 text-[#0D9488] border-teal-100">
              {message}
            </div>
          )}

          {/* Footer Info */}
          <p className="mt-8 text-center text-[11px] text-gray-400 font-medium">
            Authorized access only. By logging in, you agree to the portal terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;