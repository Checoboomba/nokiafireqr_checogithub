document.addEventListener("DOMContentLoaded", () => {
    // ... (keep existing code until downloadInspectionAsExcel function)

    // Modified download function
    function downloadInspectionAsExcel(inspection) {
        const checklistNames = [
            "Located in Designated Place",
            "Readily Visible not obstructed",
            "Fire extinguisher is in good condition",
            "Inspect tamper seal and safety pin",
            "Check pressure gauge",
            "Check fire extinguisher body for damage",
            "Inspect hose and nozzle"
        ];

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "S.No,Location,Type,Weight,Manufacturing Date,HPT Date,Inspected By,Inspection Date,Inspection Due Date\n";
        csvContent += `${inspection.id},${inspection.location},${inspection.type},${inspection.weight},${inspection.serviceDate},${inspection.hptDate},${inspection.inspectedBy},${inspection.inspectionDate},${inspection.inspectionDueDate}\n`;
        
        csvContent += "\nChecklist:\n";
        csvContent += "Checklist,Status,Remarks\n";
        inspection.checklist.forEach((item, index) => {
            csvContent += `"${checklistNames[index]}",${item.status},"${item.remarks}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Inspection_${inspection.id}_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Modified save handler with 3 attempts limit
    document.getElementById("save-inspection-btn").addEventListener("click", () => {
        if (!validateForm()) return;
        
        const MAX_ATTEMPTS = 3;
        const currentAttempts = (savedInspections[extData.id] || []).length;
        
        if (currentAttempts >= MAX_ATTEMPTS) {
            alert("Maximum of 3 inspections allowed per extinguisher!");
            return;
        }

        // ... (keep rest of the save handler code)
    });

    // ... (rest of existing code)
});