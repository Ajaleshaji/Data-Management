import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!adminId || !password) {
      setMessage("Please enter Admin ID and Password");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://data-management-1-rkqx.onrender.com/api/superadmin/admin-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminId, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.msg || "Login failed");
        return;
      }

      localStorage.setItem("adminId", data.adminId);
      localStorage.setItem("department", data.department);

      navigate(`/department/${data.department}?adminId=${data.adminId}`);
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-[#0D9488]">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your credentials to manage your department
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="admin-id" className="sr-only">Admin ID</label>
              <input
                id="admin-id"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-[#0D9488] focus:border-[#0D9488] focus:z-10 sm:text-sm transition-all"
                placeholder="Admin ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-[#0D9488] focus:border-[#0D9488] focus:z-10 sm:text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Error/Feedback Message */}
          {message && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mt-2">
              <p className="text-sm text-red-700">{message}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#0D9488] hover:bg-[#0b7a6f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D9488] transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            Departmental Portal Access
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;