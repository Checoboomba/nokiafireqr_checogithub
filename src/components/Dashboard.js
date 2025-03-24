import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from "html5-qrcode";
import jsQR from "jsqr";
import colorConfigs from "../components/colorConfigs";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scanOptionsVisible, setScanOptionsVisible] = useState(false);
  const qrRef = useRef(null);
  const qrReaderRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!userData) {
      alert("No user logged in. Redirecting to login page.");
      navigate("/"); // Redirect to login page
      return;
    }
    setUser(userData);
  }, [navigate]);

  const handleScanSuccess = (decodedText) => {
    const qrData = {};
    decodedText.split("\n").forEach(line => {
      const [key, value] = line.split(": ");
      if (key && value) qrData[key.trim()] = value.trim();
    });

    const extinguisherData = {
      id: qrData["S.No"] || "N/A",
      type: qrData["Type of Fire Extinguisher"] || "ABC",
      location: qrData.Location || "Reception",
      weight: qrData["Weight in Kg"] || "6",
      serviceDate: qrData["Manufacturing / Refilling Date"] || "2024-06-06",
      hptDate: qrData["HPT Date"] || "2027-06-05"
    };

    localStorage.setItem("currentExtinguisher", JSON.stringify(extinguisherData));
    setScanOptionsVisible(true);
  };

  const handleScanQR = async () => {
    try {
      qrReaderRef.current = new Html5Qrcode("qr-reader");
      await qrReaderRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          handleScanSuccess(decodedText);
          qrReaderRef.current.stop();
        },
        (error) => console.error("QR Scan Error:", error)
      );
      qrRef.current.style.display = "block";
    } catch (err) {
      alert(`Camera Error: ${err.message}`);
    }
  };

  const handleUploadQR = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png, image/jpeg";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) handleScanSuccess(code.data);
          else alert("No QR code found");
        };
      };
      reader.readAsDataURL(file);
    };
    fileInput.click();
  };

  return (
    <div>
      <div className="navigation-buttons">
        <button onClick={() => navigate("/")} className="nav-btn">Home</button>
        <div className="nav-controls">
          <button onClick={() => navigate(-1)} className="nav-btn">Previous</button>
          <button onClick={() => navigate("/report")} className="nav-btn">Next</button>
        </div>
      </div>

      <div id="dashboard-container">
        <h1>Welcome, <span>{user ? user.email.split("@")[0] : ""}</span></h1>

        {/* Vertical button layout */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center", marginTop: "20px" }}>
          <button onClick={handleScanQR} className="scan-button" style={{
            backgroundColor: colorConfigs.topbar.bg,
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            border: "none"
          }}>Scan QR</button>
          <button onClick={handleUploadQR} className="scan-button" style={{
            backgroundColor: colorConfigs.topbar.bg,
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            border: "none"
          }}>Upload QR Code</button>
        </div>
      </div>

      <div id="qr-reader" ref={qrRef} style={{ display: "none" }}></div>

      {scanOptionsVisible && (
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
          <button
            className="nav-btn"
            onClick={() => {
              if (user?.role === "manager") navigate("/inspection");
              else alert("Only managers can perform inspections");
            }}
          >Inspection</button>
          <button className="nav-btn" onClick={() => navigate("/report")}>Report</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;