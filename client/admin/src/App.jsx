import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "../../admin/src/pages/AdminLogin";
import DepartmentPage from "./pages/DepartmentPage";
import DepartmentSectionPage from "./pages/DepartmentSectionPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/department/:department" element={<DepartmentPage />} />
        <Route path="/" element={<AdminLogin />} />
        <Route path="/department-section/:department/:section" element={<DepartmentSectionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
