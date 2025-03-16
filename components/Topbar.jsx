import { AppBar, Toolbar, Typography } from "@mui/material";
import colorConfigs from "../configs/colorConfigs";
import sizeConfigs from "../configs/sizeConfigs";
import AvatarMenu from "./AvatarMenu"; // Import Avatar Component

const Topbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sizeConfigs.sidebar.width})`,
        ml: sizeConfigs.sidebar.width,
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
          E-Safety Work Permit
        </Typography>
        <AvatarMenu />
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;