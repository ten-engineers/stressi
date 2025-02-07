import { useState, useMemo, useEffect } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  useMediaQuery,
  Switch,
  FormControlLabel,
  Box,
  createTheme,
  ThemeProvider,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

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
  const [text, setText] = useState("");

  const addWin = () => {
    if (text.trim()) {
      setWins([...wins, text]);
      setText("");
    }
  };

  const handleChange = (event) => {
    setText(event.target.value);
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

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          value={text}
          onChange={handleChange}
          label="Enter your win..."
          variant="outlined"
          sx={{ width: { xs: "100%", sm: "300px" } }}
        />
        <Button
          onClick={addWin}
          variant="contained"
          color="primary"
          sx={{
            width: { xs: "100%", sm: "300px" },
            height: "56px",
          }}
        >
          Add win
        </Button>
      </Box>

      <Box mt={3}>
        {wins.length > 0 ? (
          <>
            <h3>Your wins today:</h3>
            <List>
              {wins.map((win, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${index + 1}. ${win}`} />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <h3>Add your first win</h3>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
