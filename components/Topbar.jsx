import { AppBar, Toolbar, Typography } from "@mui/material";
import AvatarComponent from "./Avatar";
import colorConfigs from "../configs/colorConfigs";
import sizeConfigs from "../configs/sizeConfigs";

const Topbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sizeConfigs.sidebar.width})`,
        ml: sizeConfigs.sidebar.width,
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            fontFamily: "Arial",
            color: "#fff",
          }}
        >
          E-Safety Work Permit
        </Typography>
        <AvatarComponent />
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;