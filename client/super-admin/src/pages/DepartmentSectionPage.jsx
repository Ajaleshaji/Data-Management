import React from "react";
import { useParams, useLocation } from "react-router-dom";

function DepartmentSectionPage() {
  const { department, section } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const adminId = queryParams.get("adminId");

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "50px auto" }}>
      <h1>Department Section Details</h1>
      <p><strong>Admin ID:</strong> {adminId}</p>
      <p><strong>Department:</strong> {department}</p>
      <p><strong>Section:</strong> {section}</p>

      {/* You can add student list, create student form, etc. here */}
    </div>
  );
}

export default DepartmentSectionPage;
