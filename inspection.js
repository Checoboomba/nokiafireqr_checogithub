document.addEventListener("DOMContentLoaded", () => {
    const extData = JSON.parse(localStorage.getItem("currentExtinguisher"));
    if (!extData) {
        alert("No fire extinguisher data found. Scan or upload a QR Code first.");
        window.location.href = "dashboard.html";
        return;
    }

    document.getElementById("ext-id").textContent = extData.id;
    document.getElementById("ext-location").textContent = extData.location;
    document.getElementById("ext-type").textContent = extData.type;
    document.getElementById("ext-weight").textContent = extData.weight;
    document.getElementById("ext-serviceDate").textContent = extData.serviceDate;
    document.getElementById("ext-hptDate").textContent = extData.hptDate;

    document.getElementById("save-inspection-btn").addEventListener("click", () => {
        const csvContent = `S.No,Location,Type,Weight,Manufacturing Date,HPT Date\n${extData.id},${extData.location},${extData.type},${extData.weight},${extData.serviceDate},${extData.hptDate}`;
        const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "inspection.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});