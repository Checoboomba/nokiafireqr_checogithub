document.addEventListener("DOMContentLoaded", () => {
    const selectedReportId = localStorage.getItem("selectedReportId");
    const savedInspections = JSON.parse(localStorage.getItem("inspectionRecords")) || {};
    const reportTable = document.getElementById("report-table");

    if (selectedReportId && savedInspections[selectedReportId]) {
        const inspections = savedInspections[selectedReportId];
        reportTable.innerHTML = "";

        inspections.forEach((inspection, index) => {
            reportTable.innerHTML += `
                <tr>
                    <th>Inspection ${index + 1}</th>
                </tr>
                <tr>
                    <th>S.No</th><td>${inspection.id}</td>
                    <th>Location</th><td>${inspection.location}</td>
                    <th>Type</th><td>${inspection.type}</td>
                </tr>
                <tr>
                    <th>Weight</th><td>${inspection.weight} kg</td>
                    <th>Manufacturing Date</th><td>${inspection.serviceDate}</td>
                    <th>HPT Date</th><td>${inspection.hptDate}</td>
                </tr>
                <tr>
                    <th>Last Inspection</th><td>${inspection.inspectionDate}</td>
                    <th>Next Due</th><td>${inspection.inspectionDueDate}</td>
                    <th>Inspected By</th><td>${inspection.inspectedBy}</td>
                </tr>
                <tr>
                    <th colspan="6">Checklist</th>
                </tr>
            `;
            reportTable.innerHTML += `
                <tr>
                    <th>Checklist</th>
                    <th>Yes/No</th>
                    <th>Remarks</th>
                </tr>
            `;
            const checklistNames = [
                "Located in Designated Place",
                "Readily Visible not obstructed",
                "Fire extinguisher is in good condition.",
                "Inspect tamper seal and safety pin ( which holds safety pin inplace )",
                "Check pressure gauge ( if green its good for use , red- overcharged, and yellow – low charged)",
                "Check fire extinguisher body for any corrosion/physical damage",
                "Inspect hose and nozzle for any defects"
            ];

            checklistNames.forEach((name, i) => {
                const item = inspection.checklist[i];
                reportTable.innerHTML += `
                    <tr>
                        <td>${name}</td>
                        <td>${item.status}</td>
                        <td>${item.remarks}</td>
                    </tr>
                `;
            });
        });
        
    } else {
        reportTable.innerHTML = "<tr><td colspan='6'>No inspections found for this extinguisher.</td></tr>";
    }

    // Save Report functionality
    document.getElementById("save-report-btn").addEventListener("click", () => {
        const reportData = inspections.map(inspection => ({
            id: inspection.id,
            location: inspection.location,
            type: inspection.type,
            weight: inspection.weight,
            serviceDate: inspection.serviceDate,
            hptDate: inspection.hptDate,
            inspectionDate: inspection.inspectionDate,
            inspectionDueDate: inspection.inspectionDueDate,
            inspectedBy: inspection.inspectedBy
        }));

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "S.No,Location,Type,Weight,Manufacturing Date,HPT Date,Inspected By,Inspection Date,Inspection Due Date\n";
        reportData.forEach(data => {
            csvContent += `${data.id},${data.location},${data.type},${data.weight},${data.serviceDate},${data.hptDate},${data.inspectedBy},${data.inspectionDate},${data.inspectionDueDate}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Report_${selectedReportId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    document.getElementById("prev-btn").addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
    document.getElementById("home-btn").addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
});