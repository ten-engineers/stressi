import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ThemeSwitcher = ({ darkMode, setDarkMode }) => {
  return (
    <IconButton
      onClick={() => setDarkMode(!darkMode)}
      color="inherit"
      size="small"
      sx={{ 
        width: 40, 
        height: 40, 
        padding: 1,
        '&:focus': { outline: 'none' },
        '&:active': { outline: 'none' }
      }}
    >
      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ThemeSwitcher;