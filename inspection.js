document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser "));
    if (!userData || userData.role !== "manager") {
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

    // Function to download inspection as Excel
    function downloadInspectionAsExcel(inspection) {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "S.No,Location,Type,Weight,Manufacturing Date,HPT Date,Inspected By,Inspection Date,Inspection Due Date\n";
        csvContent += `${inspection.id},${inspection.location},${inspection.type},${inspection.weight},${inspection.serviceDate},${inspection.hptDate},${inspection.inspectedBy},${inspection.inspectionDate},${inspection.inspectionDueDate}\n`;
        
        csvContent += "\nChecklist Names,Yes/No,Remarks\n";
        const checklistNames = [
            "Located in Designated Place",
            "Readily Visible not obstructed",
            "Fire extinguisher is in good condition.",
            "Inspect tamper seal and safety pin ( which holds safety pin inplace )",
            "Check pressure gauge ( if green its good for use , red- overcharged, and yellow – low charged)",
            "Check fire extinguisher body for any corrosion/physical damage",
            "Inspect hose and nozzle for any defects"
        ];
