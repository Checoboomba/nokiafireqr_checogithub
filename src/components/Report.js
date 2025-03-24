import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const [inspections, setInspections] = useState([]);
  const reportTableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedReportId = localStorage.getItem("selectedReportId");
    const savedInspections = JSON.parse(localStorage.getItem("inspectionRecords")) || {};

    if (selectedReportId && savedInspections[selectedReportId]) {
      const now = Date.now();

      // Filter inspections done in the last 24 hours
      const filteredInspections = savedInspections[selectedReportId]
        .filter(inspection => {
          const timestamp = inspection.timestamp || new Date().getTime(); // fallback if timestamp missing
          return now - timestamp <= 24 * 60 * 60 * 1000; // 24 hours
        })
        .sort((a, b) => b.timestamp - a.timestamp) // Sort latest first
        .slice(0, 3); // Keep latest 3 only

      setInspections(filteredInspections);
    }
  }, []);

  const saveReport = () => {
    if (inspections.length === 0) {
      alert("No inspection data available to save.");
      return;
    }

    const selectedReportId = localStorage.getItem("selectedReportId");
    const savedInspections = JSON.parse(localStorage.getItem("inspectionRecords")) || {};

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Fire Extinguisher Report\n\n";
    csvContent += "S.No,Location,Type,Weight,Manufacturing Date,HPT Date,Inspected By,Inspection Date,Inspection Due Date\n";

    inspections.forEach((inspection, index) => {
      csvContent += `${inspection.id || 'N/A'},${inspection.location || 'N/A'},${inspection.type || 'N/A'},${inspection.weight || 'N/A'},${inspection.serviceDate || 'N/A'},${inspection.hptDate || 'N/A'},${inspection.inspectedBy || 'N/A'},${inspection.inspectionDate || 'N/A'},${inspection.inspectionDueDate || 'N/A'}\n`;

      if (index === 0) {
        csvContent += "\nChecklist Details:\n";
        csvContent += "Inspection,Checklist Item,Status,Remarks\n";
      }

      if (inspection.checklist && Array.isArray(inspection.checklist)) {
        inspection.checklist.forEach(item => {
          csvContent += `"Inspection ${index + 1}","${item.checklist || ''}","${item.response || ''}","${item.remarks || ''}"\n`;
        });
      }

      csvContent += "\n";
    });

    csvContent += "\nSummary:\n";
    csvContent += `Total Inspections,${inspections.length}\n`;
    csvContent += `Last Inspection Date,${inspections[0]?.inspectionDate || 'N/A'}\n`;
    csvContent += `Next Due Date,${inspections[0]?.inspectionDueDate || 'N/A'}\n`;
    csvContent += `Report Generated On,${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Fire_Extinguisher_Report_${selectedReportId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("Report saved successfully!");
  };

  return (
    <div>
      <div className="navigation-buttons">
        <button onClick={() => navigate("/dashboard")} className="nav-btn">Home</button>
        <div className="nav-controls">
          <button onClick={() => navigate(-1)} className="nav-btn">Previous</button>
          <button onClick={() => navigate(1)} className="nav-btn">Next</button>
        </div>
      </div>

      <div id="report-container">
        <h2>Fire Extinguisher Report</h2>
        <table id="report-table" ref={reportTableRef}>
          {inspections.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan="6">No inspections found in last 24 hours.</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {inspections.map((inspection, index) => (
                <React.Fragment key={`insp-${index}`}>
                  <tr>
                    <th colSpan="6" className="section-header">Inspection {index + 1}</th>
                  </tr>
                  <tr>
                    <th>S.No</th><td>{inspection.id || 'N/A'}</td>
                    <th>Location</th><td>{inspection.location || 'N/A'}</td>
                    <th>Type</th><td>{inspection.type || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Weight</th><td>{inspection.weight || 'N/A'} kg</td>
                    <th>Manufacturing Date</th><td>{inspection.serviceDate || 'N/A'}</td>
                    <th>HPT Date</th><td>{inspection.hptDate || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Last Inspection</th><td>{inspection.inspectionDate || 'N/A'}</td>
                    <th>Next Due</th><td>{inspection.inspectionDueDate || 'N/A'}</td>
                    <th>Inspected By</th><td>{inspection.inspectedBy || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th colSpan="2">Checklist</th>
                    <th>Yes/No</th>
                    <th colSpan="3">Remarks</th>
                  </tr>
                  {inspection.checklist && inspection.checklist.map((item, i) => (
                    <tr key={`item-${index}-${i}`}>
                      <td colSpan="2">{item.checklist || `Checklist Item ${i + 1}`}</td>
                      <td>{item.status || 'N/A'}</td>
                      <td colSpan="3">{item.remarks || 'N/A'}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          )}
        </table>

        <button id="save-report-btn" onClick={saveReport}>Save Report</button>
      </div>
    </div>
  );
};

export default Report;