document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (userData?.role !== "manager") {
        alert("Only managers can access this page");
        window.location.href = "dashboard.html";
        return;
    }

    const extData = JSON.parse(localStorage.getItem("currentExtinguisher")) || {};
    let savedInspections = JSON.parse(localStorage.getItem("inspectionRecords")) || {};

    // Auto-fill inspection data
    const elements = {
        "ext-id": extData.id,
        "ext-location": extData.location,
        "ext-type": extData.type,
        "ext-weight": extData.weight,
        "ext-serviceDate": extData.serviceDate,
        "ext-hptDate": extData.hptDate
    };

    Object.entries(elements).forEach(([id, value]) => {
        document.getElementById(id).textContent = value;
    });

    document.getElementById("inspection-time").textContent = new Date().toLocaleTimeString();

    // Function to validate form before saving
    function validateForm() {
        const inspectedBy = document.getElementById("inspected-by").value.trim();
        const inspectionDate = document.getElementById("inspection-date").value.trim();
        const inspectionDueDate = document.getElementById("inspection-due-date").value.trim();
        let isChecklistFilled = false;

        Array.from({ length: 7 }, (_, i) => {
            if (document.querySelector(`input[name="check${i + 1}"]:checked`)) {
                isChecklistFilled = true;
            }
        });

        if (!inspectedBy || !inspectionDate || !inspectionDueDate || !isChecklistFilled) {
            alert("You're trying to save an empty form. Please fill in the required fields.");
            return false;
        }
        return true;
    }

    // Function to download inspection as CSV
    function downloadInspectionAsCSV(inspection) {
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

    // Save handler
    document.getElementById("save-inspection-btn").addEventListener("click", () => {
        if (!validateForm()) return;

        const MAX_ATTEMPTS = 3;
        const currentAttempts = (savedInspections[extData.id] || []).length;

        if (currentAttempts >= MAX_ATTEMPTS) {
            alert("Maximum of 3 inspections allowed per extinguisher!");
            return;
        }

        const newInspection = {
            id: extData.id,
            location: extData.location,
            type: extData.type,
            weight: extData.weight,
            serviceDate: extData.serviceDate,
            hptDate: extData.hptDate,
            inspectedBy: document.getElementById("inspected-by").value,
            inspectionDate: document.getElementById("inspection-date").value,
            inspectionDueDate: document.getElementById("inspection-due-date").value,
            checklist: Array.from({ length: 7 }, (_, i) => ({
                status: document.querySelector(`input[name="check${i + 1}"]:checked`)?.value || "",
                remarks: document.getElementById(`remarks${i + 1}`).value
            }))
        };

        if (!savedInspections[extData.id]) {
            savedInspections[extData.id] = [];
        }
        savedInspections[extData.id].push(newInspection);
        localStorage.setItem("inspectionRecords", JSON.stringify(savedInspections));
        localStorage.setItem("selectedReportId", extData.id);

        // Download the inspection as a CSV file
        downloadInspectionAsCSV(newInspection);

        alert("Inspection saved successfully!");
        window.location.href = "dashboard.html";
    });
});