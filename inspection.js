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
