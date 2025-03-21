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
  IconButton,
  Paper,
  ListSubheader,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { supabase } from './supabaseClient';

function App() {
  // Theme Management
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme === "dark" : prefersDarkMode;
  });

  const [wins, setWins] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wins")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("wins", JSON.stringify(wins));
  }, [wins]);

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

  const [text, setText] = useState("");
  const [error, setError] = useState(false);

  const addWin = () => {
    if (text.trim()) {
      setWins([
        ...wins,
        { id: Date.now(), text, date: new Date().toISOString().split("T")[0] }, // Store each win with a date in "YYYY-MM-DD" format.
      ]);

      setText("");
      setError(false);
    } else {
      setError(true);
    }
  };

  // Remove a win by its unique ID
  const removeWin = (id) => {
    setWins(wins.filter((win) => win.id !== id));
    setTimeout(() => document.activeElement.blur(), 100); // Remove button focus after a short delay
  };

  const handleChange = (event) => {
    setText(event.target.value);
    if (error) setError(false); // Remove the input error
  };

  // Custom Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;

    if (!isStandalone) {
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true); // Show the "Install App" button
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
      };
    }
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

  // Group wins by date to display them in sections.
  const groupedWins = wins.reduce((acc, win) => {
    acc[win.date] = acc[win.date] || [];
    acc[win.date].push(win);
    return acc;
  }, {});

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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // prevent line breaks
              addWin();
            }
          }}
          label="Enter your win..."
          variant="outlined"
          error={error} // show red error color
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
              {/* Render wins grouped by date, each inside a Paper container with a header. */}
              {Object.entries(groupedWins).map(([date, wins]) => (
                <Paper
                  key={date}
                  sx={{ mb: 2, p: 2, border: "1px solid gray" }}
                >
                  <ListSubheader sx={{ fontWeight: "bold" }}>
                    {new Date(date).toLocaleDateString("ru-RU")}
                  </ListSubheader>
                  {wins.map((win, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => removeWin(win.id)} // Find the correct index for deletion within the full wins list.
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={`${index + 1}. ${win.text}`} />
                    </ListItem>
                  ))}
                </Paper>
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
