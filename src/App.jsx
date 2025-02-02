import { useState, useMemo, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useMediaQuery, Switch, FormControlLabel } from "@mui/material";

function App() {
  // Set the light theme by default
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    // If there is no data in localStorage, use the system preference or light theme by default
    return storedTheme ? storedTheme === "dark" : prefersDarkMode; // Use system preference if no stored theme
  });

  // Save the selected theme in localStorage
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Create MUI theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light", // Switch the theme based on the darkMode state
        },
      }),
    [darkMode]
  );

  const [wins, setWins] = useState([]);

  const addWin = () => {
    setWins(wins + text);
    clearText();
  };

  const [text, setText] = useState("");

  const handleChange = (event) => {
    setText(event.target.value);
  };
  const clearText = () => {
    setText("");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="theme-switcher">
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          }
          label="Dark Mode"
        />
      </div>

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <TextField
        value={text}
        onChange={handleChange}
        label="Enter something"
        variant="outlined"
      />
      <div>
        <Button onClick={addWin} variant="contained" color="primary">
          Add win
        </Button>
      </div>
      <div>
        <p>Current value: {wins}</p>
      </div>
    </ThemeProvider>
  );
}

export default App;
