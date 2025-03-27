import React, { useState, useEffect, useRef } from "react";
import { AppBar, Toolbar, Typography, Slide, Box, useMediaQuery } from "@mui/material";
import colorConfigs from "../components/colorConfigs";
import AvatarComponent from '../components/avatar';
import nokiaLogo from '../assets/nokia1.png';
import "../styles/styles.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Topbar = () => {
  const [visible, setVisible] = useState(true);
  const prevScrollPos = useRef(window.pageYOffset);
  const ticking = useRef(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const isScrollingDown = prevScrollPos.current < currentScrollPos;
    const isScrolledEnough = currentScrollPos > 70;

    if (isScrolledEnough) {
      setVisible(!isScrollingDown);
    } else {
      setVisible(true);
    }

    prevScrollPos.current = currentScrollPos;
    ticking.current = false;
  };

  const handleScrollThrottled = () => {
    if (!ticking.current) {
      window.requestAnimationFrame(handleScroll);
      ticking.current = true;
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScrollThrottled);
    return () => window.removeEventListener('scroll', handleScrollThrottled);
  }, []);

  // Function to handle logo click
  const handleLogoClick = () => {
    navigate("/dashboard"); // navigate to dashboard
    
  };

  return (
    <Slide appear={false} direction="down" in={visible} timeout={{ enter: 300, exit: 200 }}>
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          boxShadow: "unset",
          backgroundColor: colorConfigs.topbar.bg,
          color: colorConfigs.topbar.color,
          transition: 'transform 0.3s ease-in-out, background-color 0.3s',
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", px: 2 }}>
          {/* Left side - Logo clickable */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flex: "1 1 auto",
              cursor: "pointer", // Pointer cursor on hover
            }}
            onClick={handleLogoClick} // Navigate on click
          >
            <img
              src={nokiaLogo}
              alt="Nokia Logo"
              style={{
                height: isMobile ? "15px" : "25px",
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Center - Title */}
          <Box
            sx={{
              flex: "1 1 auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                fontFamily: "Arial",
                textAlign: "center",
              }}
            >
              Fire-Extinguisher-Info
            </Typography>
          </Box>

          {/* Right side - Avatar */}
          <Box sx={{ flex: "1 1 auto", display: "flex", justifyContent: "flex-end" }}>
            <AvatarComponent />
          </Box>
        </Toolbar>
      </AppBar>
    </Slide>
  );
};

export default Topbar;

