import { useState, useMemo, useEffect } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  useMediaQuery,
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
import Auth from "./Auth";
import ThemeSwitcher from "./ThemeSwitcher";
import AES from "crypto-js/aes";
import encUtf8 from "crypto-js/enc-utf8";
import SHA256 from "crypto-js/sha256";
import encHex from "crypto-js/enc-hex";

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const derivedKey = useMemo(() => {
    if (!user) return null;
 
    const salt = user.id;
    const combined = `${user.email}:${salt}`;
    return SHA256(combined).toString(encHex);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchWins = async () => {
      const { data, error } = await supabase
        .from("wins")
        .select("*")
        .eq("user", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching wins:", error.message);
        return;
      }

      const formattedWins = data.map((win) => {
        let decryptedText;
        if (!derivedKey) return win; // Skip decrypting if derivedKey is not available
        try {
          const bytes = AES.decrypt(win.win_text, derivedKey);
          decryptedText = bytes.toString(encUtf8);
        } catch (err) {
          console.error("Failed to decrypt win:", err.message);
          decryptedText = "[Encrypted Text]";
        }

        return {
          id: win.id,
          text: decryptedText,
          date: win.created_at.split("T")[0],
        };
      });

      setWins(formattedWins);
      localStorage.setItem("wins", JSON.stringify(formattedWins));
    };

    fetchWins();
  }, [user, derivedKey]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const addWin = async () => {
    if (!derivedKey) return; // Return early if derivedKey is not available
    if (text.trim()) {
      const encryptedText = AES.encrypt(text.trim(), derivedKey).toString();

      const newWin = {
        id: crypto.randomUUID(), // generate local UUID
        user: user.id,
        win_text: encryptedText,
      };

      const { data, error } = await supabase
        .from("wins")
        .insert([newWin])
        .select();

      if (error) {
        console.error("Error inserting win:", error.message);
        return;
      }

      const insertedWin = data[0];
      let decryptedText;
      try {
        const bytes = AES.decrypt(insertedWin.win_text, derivedKey);
        decryptedText = bytes.toString(encUtf8);
      } catch (err) {
        console.error("Decryption failed after insert:", err.message);
        decryptedText = "[Encrypted Text]";
      }

      const updatedWins = [
        ...wins,
        {
          id: insertedWin.id,
          text: decryptedText,
          date: insertedWin.created_at.split("T")[0],
        },
      ];

      setWins(updatedWins);
      localStorage.setItem("wins", JSON.stringify(updatedWins));
      setText("");
      setError(false);
    } else {
      setError(true);
    }
  };

  // Remove a win by its unique ID
  const removeWin = async (id) => {
    const { error } = await supabase.from("wins").delete().eq("id", id);

    if (error) {
      console.error("Error deleting win:", error.message);
      alert("Failed to delete win. Please try again.");
      return;
    }

    const updatedWins = wins.filter((win) => win.id !== id);
    setWins(updatedWins);
    localStorage.setItem("wins", JSON.stringify(updatedWins));
    setTimeout(() => document.activeElement.blur(), 100);
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

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Auth onLogin={() => {}} darkMode={darkMode} setDarkMode={setDarkMode} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ paddingBottom: "90px" }} />
      <ThemeSwitcher darkMode={darkMode} setDarkMode={setDarkMode} onLogout={handleLogout} />

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

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          bgcolor: "background.default",
          padding: "10px 1rem",
          borderTop: "1px solid",
          borderColor: "divider",
          zIndex: 1000,
        }}
      >
        <TextField
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addWin();
            }
          }}
          label="Enter your win..."
          variant="outlined"
          error={error}
          fullWidth
          sx={{ flex: 1 }}
        />
        <Button
          onClick={addWin}
          variant="contained"
          color="primary"
          sx={{
            height: "56px",
            marginLeft: 1,
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
