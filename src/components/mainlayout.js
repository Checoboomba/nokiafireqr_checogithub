import React from 'react';
import Topbar from '../components/topbar';
import { Box } from '@mui/material';
import "../styles/styles.css";

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Topbar />
      <Box sx={{ paddingTop: "64px" }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;

