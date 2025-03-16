import React, { useState, useEffect } from "react";
import { Avatar, Menu, MenuItem, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    borderRadius: "50%",
    width: "12px",
    height: "12px",
    border: `2px solid ${theme.palette.background.paper}`,
  },
}));

const AvatarMenu = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const userId = sessionStorage.getItem("UserId");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/fetchUserDetails`, { userId });
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <StyledBadge onClick={(e) => setAnchorEl(e.currentTarget)} overlap="circular" variant="dot">
        <Avatar sx={{ bgcolor: "#fff", color: "rgb(1, 67, 133)" }}>
          {userDetails.PersonName ? userDetails.PersonName.charAt(0) : "U"}
        </Avatar>
      </StyledBadge>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default AvatarMenu;