import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "../../admin/src/pages/AdminLogin";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
