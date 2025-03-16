import { AppBar, Toolbar, Typography } from "@mui/material";
import colorConfigs from "../configs/colorConfigs";
import sizeConfigs from "../configs/sizeConfigs";
import Avatar from "./Avatar";

const Topbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sizeConfigs.sidebar.width})`,
        ml: sizeConfigs.sidebar.width,
        boxShadow: "unset",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#fff",
            fontFamily: "Arial",
          }}
        >
          E-Safety Work Permit
        </Typography>
        <Avatar />
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;