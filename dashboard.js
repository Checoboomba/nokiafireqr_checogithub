document.addEventListener("DOMContentLoaded", function () {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (userData && userData.email) {
        const firstName = userData.email.split("@")[0];
        document.getElementById("user-name").textContent = `${firstName}`;
    } else {
        alert("No user logged in. Redirecting to login page.");
        window.location.href = "index.html";
        return;
    }

    // Navigation buttons
    const homeBtn = document.getElementById("home-btn");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    if (homeBtn) {
        homeBtn.addEventListener("click", function() {
            window.location.href = "dashboard.html";
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", function() {
            window.history.back();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function() {
            window.history.forward();
        });
    }

    // QR scanning functionality
    const scanBtn = document.getElementById("scan-qr");
    const scanOptions = document.getElementById("scan-options");
    const inspectionBtn = document.getElementById("inspection-btn");
    const reportBtn = document.getElementById("report-btn");
    const inspectionChecksheet = document.getElementById("inspection-checksheet");
    const reportSheet = document.getElementById("report-sheet");
    let qrScanner = null;

    scanBtn.addEventListener("click", async function () {
        try {
            document.getElementById("qr-reader").style.display = "block";
            
            // Initialize scanner only once
            if (!qrScanner) {
                qrScanner = new Html5Qrcode("qr-reader");
            }

            // Start scanning directly with Html5Qrcode's built-in camera handling
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
        
        // Store scanned extinguisher data
        const mockData = {
            id: decodedText,
            type: "ABC",
            location: "Receiption",
            weight: "6",
            serviceDate: "2024-06-06",
            expiryDate: "2027-06-05",
            hptDate: "2027-06-05"
        };

        // Store in localStorage for access across views
        localStorage.setItem("currentExtinguisher", JSON.stringify(mockData));
        
        // Show options instead of details directly
        scanOptions.style.display = "block";
    }

    // Inspection Button Click
    inspectionBtn.addEventListener("click", function() {
        const extData = JSON.parse(localStorage.getItem("currentExtinguisher"));
        scanOptions.style.display = "none";
        
        // Only managers can view and edit inspection sheet
        if (userData.role === "manager") {
            inspectionChecksheet.style.display = "block";
            populateInspectionSheet(extData);
        } else {
            alert("Only managers can access inspection checksheets.");
            inspectionChecksheet.style.display = "none";
        }
    });

    // Report Button Click
    reportBtn.addEventListener("click", function() {
        scanOptions.style.display = "none";
        reportSheet.style.display = "block";
        loadReportData();
    });

    function populateInspectionSheet(extData) {
        // Populate inspection sheet with extinguisher data
        document.getElementById("inspection-sno").value = extData.id;
        document.getElementById("inspection-location").value = extData.location;
        document.getElementById("inspection-type").value = extData.type;
        document.getElementById("inspection-weight").value = extData.weight;
        document.getElementById("inspection-mfg-date").value = extData.serviceDate;
        document.getElementById("inspection-hpt-date").value = extData.hptDate;
        
        // Set default date values
        const today = new Date().toISOString().split('T')[0];
        document.getElementById("inspection-date").value = today;
        
        // Calculate due date (3 months from today)
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + 3);
        document.getElementById("inspection-due-date").value = dueDate.toISOString().split('T')[0];
        
        // Set current time
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById("inspection-time").value = `${hours}:${minutes}`;
        
        // Set inspected by field
        document.getElementById("inspection-by").value = userData.email.split("@")[0];
    }

    // Save Inspection Button
    document.getElementById("save-inspection-btn").addEventListener("click", function() {
        saveInspectionData();
        alert("Inspection saved successfully!");
        inspectionChecksheet.style.display = "none";
    });

    function saveInspectionData() {
        const extId = document.getElementById("inspection-sno").value;
        const inspectionData = {
            id: extId,
            location: document.getElementById("inspection-location").value,
            type: document.getElementById("inspection-type").value,
            weight: document.getElementById("inspection-weight").value,
            mfgDate: document.getElementById("inspection-mfg-date").value,
            hptDate: document.getElementById("inspection-hpt-date").value,
            inspectedBy: document.getElementById("inspection-by").value,
            inspectionDate: document.getElementById("inspection-date").value,
            dueDate: document.getElementById("inspection-due-date").value,
            time: document.getElementById("inspection-time").value,
            checklistItems: [
                { item: "Located in Designated Place", status: getRadioValue("check1"), remarks: document.getElementById("remarks1").value },
                { item: "Readily Visible not obstructed", status: getRadioValue("check2"), remarks: document.getElementById("remarks2").value },
                { item: "Fire extinguisher is in good condition", status: getRadioValue("check3"), remarks: document.getElementById("remarks3").value },
                { item: "Inspect tamper seal and safety pin", status: getRadioValue("check4"), remarks: document.getElementById("remarks4").value },
                { item: "Check pressure gauge", status: getRadioValue("check5"), remarks: document.getElementById("remarks5").value },
                { item: "Check fire extnguisher body for any corrosion/physical damage", status: getRadioValue("check6"), remarks: document.getElementById("remarks6").value },
                { item: "Inspect hose and nozzle for any defects", status: getRadioValue("check7"), remarks: document.getElementById("remarks7").value }
            ],
            timestamp: new Date().toLocaleString()
        };

        // Get existing inspections or initialize new array
        const inspections = JSON.parse(localStorage.getItem("inspections")) || [];
        inspections.push(inspectionData);
        localStorage.setItem("inspections", JSON.stringify(inspections));
    }

    function getRadioValue(name) {
        const radios = document.getElementsByName(name);
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }
        return "";
    }

    function loadReportData() {
        const reportTable = document.getElementById("report-table");
        // Clear existing rows except header
        while (reportTable.rows.length > 1) {
            reportTable.deleteRow(1);
        }

        // Get inspections from localStorage
        const inspections = JSON.parse(localStorage.getItem("inspections")) || [];
        
        // Sample data if no inspections yet
        if (inspections.length === 0) {
            const sampleData = [
                {
                    id: "1",
                    location: "Receiption",
                    type: "ABC",
                    weight: "6",
                    mfgDate: "2024-06-06",
                    hptDate: "2027-06-05",
                    inspectionDate: "2025-02-06",
                    dueDate: "2025-05-06",
                    remarks: "Ok"
                },
                {
                    id: "2",
                    location: "Production office cafeteria",
                    type: "ABC",
                    weight: "6",
                    mfgDate: "2024-01-06",
                    hptDate: "2027-01-05",
                    inspectionDate: "2025-02-06",
                    dueDate: "2025-05-06",
                    remarks: "Ok"
                }
            ];
            
            sampleData.forEach((item, index) => {
                addReportRow(reportTable, item, index);
            });
        } else {
            inspections.forEach((item, index) => {
                // Check if all checklist items are OK to determine overall remarks
                const allOk = item.checklistItems ? 
                    item.checklistItems.every(check => check.status === "yes" || !check.status) : 
                    true;
                
                const reportItem = {
                    id: item.id,
                    location: item.location,
                    type: item.type,
                    weight: item.weight,
                    mfgDate: item.mfgDate,
                    hptDate: item.hptDate,
                    inspectionDate: item.inspectionDate,
                    dueDate: item.dueDate,
                    remarks: allOk ? "Ok" : "Needs attention"
                };
                
                addReportRow(reportTable, reportItem, index);
            });
        }
    }

    function addReportRow(table, data, index) {
        const row = table.insertRow();
        
        const cellSNo = row.insertCell(0);
        cellSNo.textContent = index + 1;
        
        const cellLocation = row.insertCell(1);
        cellLocation.textContent = data.location;
        
        const cellType = row.insertCell(2);
        cellType.textContent = data.type;
        
        const cellWeight = row.insertCell(3);
        cellWeight.textContent = data.weight;
        
        const cellMfgDate = row.insertCell(4);
        cellMfgDate.textContent = formatDate(data.mfgDate);
        
        const cellHptDate = row.insertCell(5);
        cellHptDate.textContent = formatDate(data.hptDate);
        
        const cellInspectionDate = row.insertCell(6);
        cellInspectionDate.textContent = formatDate(data.inspectionDate);
        
        const cellDueDate = row.insertCell(7);
        cellDueDate.textContent = formatDate(data.dueDate);
        
        const cellChecksheet = row.insertCell(8);
        const checksheetLink = document.createElement("a");
        checksheetLink.href = "#";
        checksheetLink.textContent = "View Inspection";
        checksheetLink.dataset.id = data.id;
        checksheetLink.addEventListener("click", function(e) {
            e.preventDefault();
            const extId = this.dataset.id;
            showInspectionDetails(extId);
        });
        cellChecksheet.appendChild(checksheetLink);
        
        const cellRemarks = row.insertCell(9);
        cellRemarks.textContent = data.remarks;
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        
        // Check if date is in ISO format (yyyy-mm-dd)
        if (dateString.includes("-")) {
            const parts = dateString.split("-");
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
        
        // If already in DD.MM.YYYY format, return as is
        return dateString;
    }

    function showInspectionDetails(extId) {
        // Get the inspection data for this extinguisher
        const inspections = JSON.parse(localStorage.getItem("inspections")) || [];
        const inspection = inspections.find(item => item.id === extId);
        
        if (inspection) {
            reportSheet.style.display = "none";
            inspectionChecksheet.style.display = "block";
            
            // Fill in the inspection data
            populateInspectionSheet(inspection);
            
            // Disable all inputs if user is not a manager
            if (userData.role !== "manager") {
                const inputs = inspectionChecksheet.querySelectorAll("input");
                inputs.forEach(input => {
                    input.disabled = true;
                });
                
                document.getElementById("save-inspection-btn").style.display = "none";
            }
        } else {
            alert("Inspection details not found.");
        }
    }

    // For edit & submit functionality (from original code)
    document.getElementById("edit-btn").addEventListener("click", function() {
        const inputs = document.querySelectorAll("#fire-extinguisher-details input");
        inputs.forEach(input => {
            input.disabled = false;
        });
    });

    document.getElementById("submit-btn").addEventListener("click", function() {
        const history = JSON.parse(localStorage.getItem("history")) || [];
        history.push({
            id: document.getElementById("ext-id").value,
            type: document.getElementById("ext-type").value,
            serviceDate: document.getElementById("ext-service").value,
            expiryDate: document.getElementById("ext-expiry").value,
            timestamp: new Date().toLocaleString()
        });

        localStorage.setItem("history", JSON.stringify(history));
        alert("Changes saved.");
        loadHistory(document.getElementById("ext-id").value);
    });

    function loadHistory(extinguisherId) {
        const historyDiv = document.getElementById("history");
        historyDiv.innerHTML = "";
        const history = JSON.parse(localStorage.getItem("history")) || [];

        history.forEach(entry => {
            if (entry.id === extinguisherId) {
                const p = document.createElement("p");
                p.textContent = `ID: ${entry.id}, Type: ${entry.type}, Service: ${entry.serviceDate}, Expiry: ${entry.expiryDate}, Time: ${entry.timestamp}`;
                historyDiv.appendChild(p);
            }
        });
    }
});