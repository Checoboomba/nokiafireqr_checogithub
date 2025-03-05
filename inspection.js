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
            checklist: document.querySelector(`td:nth-child(1)`).textContent,
            response: yes ? "Yes" : "No",
            remarks: remarks
        });
    }

    if (!allChecked) {
        alert("Please fill all 7 fields.");
        return;
    }

    let csvContent = "Checklist,Yes/No,Remarks\n";
    checklistValues.forEach(item => {
        csvContent += `${item.checklist},${item.response},${item.remarks}\n`;
    });

    let blob = new Blob([csvContent], { type: "text/csv" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "inspection_report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});