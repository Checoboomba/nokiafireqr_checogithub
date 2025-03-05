document.addEventListener("DOMContentLoaded", () => {
    const storedData = localStorage.getItem("currentExtinguisher");
    if (!storedData) {
        alert("No QR code data found. Redirecting to dashboard.");
        window.location.href = "dashboard.html";
        return;
    }

    const extData = JSON.parse(storedData);
    document.getElementById("ext-id").textContent = extData.id;
    document.getElementById("ext-location").textContent = extData.location;
    document.getElementById("ext-type").textContent = extData.type;
    document.getElementById("ext-weight").textContent = extData.weight;
    document.getElementById("ext-serviceDate").textContent = extData.serviceDate;
    document.getElementById("ext-hptDate").textContent = extData.hptDate;
    document.getElementById("inspection-time").textContent = new Date().toLocaleTimeString();

    document.getElementById("save-inspection-btn").addEventListener("click", () => {
        const inspectedBy = document.getElementById("inspected-by").value.trim();
        const inspectionDate = document.getElementById("inspection-date").value.trim();
        const dueDate = document.getElementById("inspection-due-date").value.trim();

        if (!inspectedBy || !inspectionDate || !dueDate) {
            alert("Please fill in all required fields before saving.");
            return;
        }

        const checklistRows = document.querySelectorAll("#checklist-table tbody tr");
        let checklistData = [];

        checklistRows.forEach((row, index) => {
            const checklistName = row.cells[0].textContent.trim();
            const yesChecked = row.cells[1].querySelector("input[type=radio]").checked;
            const noChecked = row.cells[2].querySelector("input[type=radio]").checked;
            const remarks = row.cells[3].querySelector("input").value.trim();

            if (!yesChecked && !noChecked) {
                alert(`Please select Yes/No for checklist item: ${checklistName}`);
                return;
            }

            const status = yesChecked ? "Yes" : "No";
            checklistData.push(`${index + 1},${checklistName},${status},${remarks}`);
        });

        if (checklistData.length !== checklistRows.length) {
            return; // Stop if all checklist items are not filled
        }

        let csvContent = `data:text/csv;charset=utf-8,`;
        csvContent += `S.No,Location,Type,Weight,Manufacturing Date,HPT Date,Inspected By,Inspection Date,Inspection Due Date\n`;
        csvContent += `${extData.id},${extData.location},${extData.type},${extData.weight},${extData.serviceDate},${extData.hptDate},${inspectedBy},${inspectionDate},${dueDate}\n\n`;

        csvContent += `Checklist,Yes/No,Remarks\n`;
        csvContent += checklistData.join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "inspection.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});