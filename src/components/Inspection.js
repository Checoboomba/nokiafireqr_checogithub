import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/styles.css';

const CHECKLIST_ITEMS = [
  "Located in Designated Place",
  "Readily Visible not obstructed",
  "Fire extinguisher is in good condition.",
  "Inspect tamper seal and safety pin",
  "Check pressure gauge",
  "Check fire extinguisher body",
  "Inspect hose and nozzle"
];

const Inspection = () => {
  const navigate = useNavigate();
  const [extData, setExtData] = useState({});
  const [checklist, setChecklist] = useState(Array(7).fill({ status: '', remarks: '' }));
  const [inspectedBy, setInspectedBy] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionDueDate, setInspectionDueDate] = useState('');
  const [inspectionTime, setInspectionTime] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (userData?.role !== "manager") {
      alert("Only managers can access this page");
      navigate("/dashboard");
      return;
    }

    const currentExtData = JSON.parse(localStorage.getItem("currentExtinguisher"));
    if (currentExtData) {
      setExtData(currentExtData);
    } else {
      const qrData = JSON.parse(localStorage.getItem("qr_scan_data"));
      if (qrData) {
        setExtData({
          id: qrData.extinguisher_id,
          location: qrData.location,
          type: qrData.extinguisher_type,
          weight: qrData.weight,
          serviceDate: qrData.service_date,
          hptDate: qrData.hpt_date
        });
        localStorage.removeItem("qr_scan_data");
      }
    }
    setInspectionTime(new Date().toLocaleTimeString());
  }, [navigate]);

  const handleChecklistChange = (index, field, value) => {
    const updated = [...checklist];
    updated[index] = { ...updated[index], [field]: value };
    setChecklist(updated);
  };

  // Function to generate and download CSV
  const downloadCSV = (inspectionData) => {
    // Format Data for CSV Download according to the required format from improved-inspection-js.js
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header row for extinguisher details
    csvContent += "Fire Extinguisher S.No,Location,Type of Fire Extinguisher,Weight in Kg,Manufacturing / Refilling Date,HPT Date,Inspected By,Inspection Done on,Time\n";
    
    // Extinguisher details row
    csvContent += `${inspectionData.id || "N/A"},${inspectionData.location || "N/A"},${inspectionData.type || "N/A"},${inspectionData.weight || "N/A"},${inspectionData.serviceDate || "N/A"},${inspectionData.hptDate || "N/A"},${inspectionData.inspectedBy},${inspectionData.inspectionDate},${inspectionData.inspectionTime}\n\n`;
    
    // Add checklist section header
    csvContent += "Checklist,Yes/No,Remarks\n";
    
    // Add each checklist item
    inspectionData.checklist.forEach(row => {
      csvContent += `"${row.checklist}","${row.response}","${row.remarks || "N/A"}"\n`;
    });

    // Create and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Fire_Extinguisher_Inspection_${inspectionData.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = () => {
    if (!inspectedBy || !inspectionDate || !inspectionDueDate) {
      alert("Fill all required fields");
      return;
    }
    const incomplete = checklist.some(item => !item.status);
    if (incomplete) {
      alert("Please answer all checklist items");
      return;
    }
  
    // Adding checklist titles
    const updatedChecklist = checklist.map((item, index) => ({
      checklist: CHECKLIST_ITEMS[index],
      response: item.status,
      remarks: item.remarks || "N/A"
    }));
  
    const newInspection = {
      ...extData,
      inspectedBy,
      inspectionDate,
      inspectionDueDate,
      inspectionTime,
      timestamp: Date.now(),
      checklist: updatedChecklist
    };
  
    let savedInspections = JSON.parse(localStorage.getItem("inspectionRecords")) || {};
    if (!savedInspections[extData.id]) savedInspections[extData.id] = [];
    savedInspections[extData.id].push(newInspection);
    localStorage.setItem("inspectionRecords", JSON.stringify(savedInspections));
    localStorage.setItem("selectedReportId", extData.id);
    
    // Download CSV file
    downloadCSV(newInspection);
  
    alert("Inspection saved!");
    navigate("/dashboard");
  };
  
  return (
    <div>
      <div className="navigation-buttons">
        <button className="nav-btn" onClick={() => navigate("/dashboard")}>Home</button>
        <div className="nav-controls">
          <button className="nav-btn" onClick={() => navigate(-1)}>Previous</button>
          <button className="nav-btn" onClick={() => navigate(1)}>Next</button>
        </div>
      </div>

      <div id="inspection-container">
        <h2>Fire Extinguisher Inspection</h2>
        <table id="inspection-table">
          <tbody>
            <tr><th>Fire Extinguisher S.No</th><td>{extData.id}</td></tr>
            <tr><th>Location</th><td>{extData.location}</td></tr>
            <tr><th>Type of Fire Extinguisher</th><td>{extData.type}</td></tr>
            <tr><th>Weight in Kg</th><td>{extData.weight}</td></tr>
            <tr><th>Manufacturing / Refilling Date</th><td>{extData.serviceDate}</td></tr>
            <tr><th>HPT Date</th><td>{extData.hptDate}</td></tr>
            <tr><th>Inspected By</th><td><input value={inspectedBy} onChange={(e) => setInspectedBy(e.target.value)} /></td></tr>
            <tr><th>Inspection Done on</th><td><input type="date" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} /></td></tr>
            <tr><th>Inspection Due Date</th><td><input type="date" value={inspectionDueDate} onChange={(e) => setInspectionDueDate(e.target.value)} /></td></tr>
            <tr><th>Time</th><td>{inspectionTime}</td></tr>
          </tbody>
        </table>

        <h3>Checklist</h3>
        <table id="checklist-table">
          <thead>
            <tr>
              <th>Checklist</th>
              <th>Yes</th>
              <th>No</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {CHECKLIST_ITEMS.map((item, index) => (
              <tr key={index}>
                <td>{item}</td>
                <td><input type="radio" name={`check${index + 1}`} value="Yes" onChange={() => handleChecklistChange(index, "status", "Yes")} /></td>
                <td><input type="radio" name={`check${index + 1}`} value="No" onChange={() => handleChecklistChange(index, "status", "No")} /></td>
                <td><input type="text" value={checklist[index].remarks || ""} onChange={(e) => handleChecklistChange(index, "remarks", e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <button id="save-inspection-btn" onClick={handleSave}>Save Inspection</button>
      </div>
    </div>
  );
};

export default Inspection;