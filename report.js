document.addEventListener("DOMContentLoaded", () => {
    const selectedReportId = localStorage.getItem("selectedReportId");
    const savedInspections = JSON.parse(localStorage.getItem("inspectionRecords")) || {};
    const reportTable = document.getElementById("report-table");

    // Function to download report as CSV
    function downloadReportAsCSV(inspections) {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "S.No,Location,Type,Weight,Manufacturing Date,HPT Date,Inspected By,Inspection Date,Inspection Due Date\n";

        inspections.slice(0, 3).forEach(inspection => {
            csvContent += `${inspection.id},${inspection.location},${inspection.type},${inspection.weight},${inspection.serviceDate},${inspection.hptDate},${inspection.inspectedBy},${inspection.inspectionDate},${inspection.inspectionDueDate}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Report_${selectedReportId}_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Add Save Report button
    const saveReportBtn = document.createElement("button");
    saveReportBtn.textContent = "Save Report";
    saveReportBtn.className = "nav-btn";
    saveReportBtn.style.margin = "20px auto";
    saveReportBtn.addEventListener("click", () => {
        if (selectedReportId && savedInspections[selectedReportId]) {
            downloadReportAsCSV(savedInspections[selectedReportId]);
        }
    });
    document.getElementById("report-container").appendChild(saveReportBtn);

    if (selectedReportId && savedInspections[selectedReportId]) {
        const inspections = savedInspections[selectedReportId].slice(0, 3); // Limit to 3 reports
        reportTable.innerHTML = "";

        inspections.forEach((inspection, index) => {
            reportTable.innerHTML += `
                <tr>
                    <th colspan="3">Inspection ${index + 1}</th>
                </tr>
                <tr>
                    <th>S.No</th><td>${inspection.id}</td>
                    <th>Location</th><td>${inspection.location}</td>
                </tr>
                <tr>
                    <th>Type</th><td>${inspection.type}</td>
                    <th>Weight</th><td>${inspection.weight} kg</td>
                </tr>
                <tr>
                    <th>Manufacturing Date</th><td>${inspection.serviceDate}</td>
                    <th>HPT Date</th><td>${inspection.hptDate}</td>
                </tr>
                <tr>
                    <th>Inspected By</th><td>${inspection.inspectedBy}</td>
                    <th>Inspection Date</th><td>${inspection.inspectionDate}</td>
                </tr>
                <tr>
                    <th colspan="4" style="background:#007bff;color:white;">Checklist</th>
                </tr>
                <tr>
                    <th>Checklist</th>
                    <th>Status</th>
                    <th colspan="2">Remarks</th>
                </tr>
            `;

            inspection.checklist.forEach((item, i) => {
                reportTable.innerHTML += `
                    <tr>
                        <td>${i + 1}. ${checklistNames[i]}</td>
                        <td>${item.status}</td>
                        <td colspan="2">${item.remarks}</td>
                    </tr>
                `;
            });
        });
    } else {
        reportTable.innerHTML = "<tr><td colspan='4'>No inspections found for this extinguisher.</td></tr>";
    }
});