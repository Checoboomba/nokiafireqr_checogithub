document.addEventListener("DOMContentLoaded", function () {
    // Retrieve QR Code Data from Local Storage
    let qrData = localStorage.getItem("qr_scan_data");
    
    if (qrData) {
        let parsedData = JSON.parse(qrData);
        console.log("QR Data Loaded:", parsedData); // Debugging Log

        // Auto-Fill the Form Fields
        document.getElementById("ext-id").textContent = parsedData.extinguisher_id || "N/A";
        document.getElementById("ext-location").textContent = parsedData.location || "N/A";
        document.getElementById("ext-type").textContent = parsedData.extinguisher_type || "N/A";
        document.getElementById("ext-weight").textContent = parsedData.weight || "N/A";
        document.getElementById("ext-serviceDate").textContent = parsedData.service_date || "N/A";
        document.getElementById("ext-hptDate").textContent = parsedData.hpt_date || "N/A";

        // Set Current Date & Time for Inspection
        let currentDate = new Date().toISOString().split("T")[0];
        document.getElementById("inspection-date").value = currentDate;
        document.getElementById("inspection-time").textContent = new Date().toLocaleTimeString();

        // Clear Local Storage After Auto-Filling
        localStorage.removeItem("qr_scan_data");
    } else {
        console.warn("No QR data found!");
    }
});

// Save Inspection Button Click Event
document.getElementById("save-inspection-btn").addEventListener("click", function () {
    let checklistValues = [];
    let allChecked = true;

    for (let i = 1; i <= 7; i++) {
        let yes = document.querySelector(`input[name="check${i}"][value="Yes"]:checked`);
        let no = document.querySelector(`input[name="check${i}"][value="No"]:checked`);
        let remarks = document.getElementById(`remarks${i}`).value || "N/A";

        if (!yes && !no) {
            allChecked = false;
            break;
        }

        checklistValues.push({
            checklist: document.querySelector(`#checklist-table tr:nth-child(${i}) td:first-child`).textContent,
            response: yes ? "Yes" : "No",
            remarks: remarks
        });
    }

    if (!allChecked) {
        alert("Please fill all 7 fields.");
        return;
    }

    // Format Data for CSV Download
    let csvContent = "Checklist,Yes/No,Remarks\n";
    checklistValues.forEach(row => {
        csvContent += `${row.checklist},${row.response},${row.remarks}\n`;
    });

    let blob = new Blob([csvContent], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Fire_Extinguisher_Inspection.csv";
    link.click();
});