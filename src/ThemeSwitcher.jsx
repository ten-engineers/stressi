import { FormControlLabel, Switch, Button, Box } from "@mui/material";

const ThemeSwitcher = ({ darkMode, setDarkMode, onLogout }) => {
  return (
    <div className="theme-switcher">
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          }
          label="Dark Mode"
        />
        {onLogout && (
          <Button onClick={onLogout} variant="outlined">
            Logout
          </Button>
        )}
      </Box>
    </div>
  );
};

export default ThemeSwitcher;