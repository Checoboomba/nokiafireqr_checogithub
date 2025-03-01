document.addEventListener("DOMContentLoaded", function () {
    const userData = JSON.parse(localStorage.getItem("loggedInUser "));
    if (userData && userData.email) {
        const firstName = userData.email.split("@")[0];
        document.getElementById("user-name").textContent = ` ${firstName}`;
    } else {
        alert("No user logged in. Redirecting to login page.");
        window.location.href = "index.html";
        return;
    }

    const scanBtn = document.getElementById("scan-qr");
    let qrScanner = null;

    scanBtn.addEventListener("click", async function () {
        try {
            document.getElementById("qr-reader").style.display = "block";
            
            if (!qrScanner) {
                qrScanner = new Html5Qrcode("qr-reader");
            }

            await qrScanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                (decodedText) => {
                    handleScanSuccess(decodedText, qrScanner);
                },
                (errorMessage) => {
                    console.log("Scanning error:", errorMessage);
                }
            );
        } catch (err) {
            document.getElementById("qr-reader").style.display = "none";
            if (qrScanner && qrScanner.isScanning) {
                qrScanner.stop();
            }
            alert(`Camera error: ${err.message}`);
            console.log("Camera access error:", err);
        }
    });

    function handleScanSuccess(decodedText, scanner) {
        alert("QR Code Scanned: " + decodedText);
        scanner.stop();
        document.getElementById("qr-reader").style.display = "none";

        // Mock data based on scanned QR code
        const mockData = {
            id: decodedText,
            location: "Reception",
            type: "ABC",
            weight: 6,
            manufacturingDate: "2024-06-06",
            hptDate: "2027-06-05",
            inspectedBy: "",
            inspectionDone: "",
            inspectionDue: ""
        };

        // Fill in the details
        document.getElementById("location").value = mockData.location;
        document.getElementById("type").value = mockData.type;
        document.getElementById("weight").value = mockData.weight;
        document.getElementById("manufacturing-date").value = mockData.manufacturingDate;
        document.getElementById("hpt-date").value = mockData.hptDate;

        // Show inspection and report buttons
        document.getElementById("fire-extinguisher-details").style.display = "block";
    }

    document.getElementById("inspection-btn").addEventListener("click", function () {
        document.getElementById("inspection-sheet").style.display = "block";
        document.getElementById("report-sheet").style.display = "none";
    });

    document.getElementById("report-btn").addEventListener("click", function () {
        document.getElementById("report-sheet").style.display = "block";
        document.getElementById("inspection-sheet").style.display = "none";
    });
});