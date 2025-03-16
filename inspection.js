import React from "react";
import ReactDOM from "react-dom";
import Topbar from "./components/Topbar";

const Inspection = () => {
  return (
    <div>
      <Topbar />
      <div style={{ marginTop: "70px", padding: "20px" }}>
        <h2>Fire Extinguisher Inspection</h2>
        <p>Fill the inspection checklist and save results.</p>
      </div>
    </div>
  );
};

ReactDOM.render(<Inspection />, document.getElementById("root"));