import React from "react";
import ReactDOM from "react-dom";
import Topbar from "./components/Topbar";

const Dashboard = () => {
  return (
    <div>
      <Topbar />
      <div style={{ marginTop: "70px", padding: "20px" }}>
        <h1>Welcome to Dashboard</h1>
        <p>Perform QR scanning, inspections, and generate reports.</p>
      </div>
    </div>
  );
};

ReactDOM.render(<Dashboard />, document.getElementById("root"));