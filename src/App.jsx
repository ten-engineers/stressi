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
  // Theme Management
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme === "dark" : prefersDarkMode;
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  // Wins State
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

  // Custom Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(true);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true); // Show the "Install App" button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("App installed successfully!");
        } else {
          console.log("App installation dismissed.");
        }
        setDeferredPrompt(null);
        setIsInstallable(false); // Hide the "Install App" button after the action
      });
    }
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

      {/* ✅ Install App Button */}
      {isInstallable && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleInstallClick}
          sx={{ marginBottom: 2 }}
        >
          Install App
        </Button>
      )}

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