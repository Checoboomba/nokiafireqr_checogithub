import React from "react";
import ReactDOM from "react-dom";
import Topbar from "./components/Topbar";

const Report = () => {
  return (
    <div>
      <Topbar />
      <div style={{ marginTop: "70px", padding: "20px" }}>
        <h2>Fire Extinguisher Report</h2>
        <p>View and download inspection reports.</p>
      </div>
    </div>
  );
};

ReactDOM.render(<Report />, document.getElementById("root"));