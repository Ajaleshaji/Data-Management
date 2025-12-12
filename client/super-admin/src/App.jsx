import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Department from "./pages/Department";
import DepartmentSectionPage from "./pages/DepartmentSectionPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/department/:department" element={<Department />} />
        <Route path="/department-section/:department/:section" element={<DepartmentSectionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
