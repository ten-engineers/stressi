import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ThemeSwitcher = ({ darkMode, setDarkMode }) => {
  return (
    <IconButton
      onClick={() => setDarkMode(!darkMode)}
      color="inherit"
      size="small"
    >
      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ThemeSwitcher;