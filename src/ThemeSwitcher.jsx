import { IconButton, Button } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";

const ThemeSwitcher = ({ darkMode, setDarkMode, onLogout }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <IconButton
        onClick={() => setDarkMode(!darkMode)}
        color="inherit"
        size="small"
      >
        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      {onLogout && (
        <Button
          onClick={onLogout}
          color="inherit"
          startIcon={<LogoutIcon />}
          size="small"
        >
          Logout
        </Button>
      )}
    </div>
  );
};

export default ThemeSwitcher;