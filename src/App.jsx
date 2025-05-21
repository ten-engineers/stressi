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
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import ThemeSwitcher from "./ThemeSwitcher";
import CalendarModal from "./components/CalendarModal";
import AES from "crypto-js/aes";
import encUtf8 from "crypto-js/enc-utf8";
import SHA256 from "crypto-js/sha256";
import encHex from "crypto-js/enc-hex";
import { format } from "date-fns";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

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

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [contextMenu, setContextMenu] = useState(null);
  const [selectedWin, setSelectedWin] = useState(null);

  const handleContextMenu = (event, win) => {
    event.preventDefault();
    setSelectedWin(win);
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    setSelectedWin(null);
  };

  const handleCopy = () => {
    if (selectedWin) {
      navigator.clipboard.writeText(selectedWin.text);
      handleCloseContextMenu();
    }
  };

  const handleEdit = () => {
    if (selectedWin) {
      setText(selectedWin.text);
      removeWin(selectedWin.id);
      handleCloseContextMenu();
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
          }}
        >
          <Typography>Loading...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Auth
          onLogin={() => {}}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ width: "100px" }} />{" "}
          {/* Spacer to balance the right side */}
          <Typography variant="h6" component="div">
            Stressi
          </Typography>
          <Box
            sx={{ width: "100px", display: "flex", justifyContent: "flex-end" }}
          >
            <ThemeSwitcher
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onLogout={handleLogout}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ paddingTop: "64px" }} />

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
          bgcolor: darkMode
            ? "rgba(18, 18, 18, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
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
          placeholder="Enter your win..."
          variant="outlined"
          error={error}
          fullWidth
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
            },
          }}
        />
        <Button
          onClick={addWin}
          variant="text"
          color="primary"
          sx={{
            height: "56px",
            marginLeft: 1,
            minWidth: "56px",
            padding: "0 16px",
          }}
        >
          <SendIcon />
        </Button>
      </Box>

      <Box>
        {wins.length > 0 && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <h3>Your wins:</h3>
          </Box>
        )}
        {wins.length > 0 ? (
          <>
            <List>
              {Object.entries(groupedWins).map(([date, wins]) => (
                <Paper
                  key={date}
                  sx={{
                    mb: 2,
                    p: 2,
                    boxShadow: darkMode ? undefined : "none",
                    bgcolor: darkMode ? undefined : "rgba(0, 0, 0, 0.02)",
                  }}
                  data-date={date}
                >
                  {wins.map((win, index) => (
                    <ListItem
                      key={index}
                      onContextMenu={(event) => handleContextMenu(event, win)}
                      onClick={(event) => {
                        // Only show menu on tap for mobile devices
                        if (window.innerWidth <= 600) {
                          handleContextMenu(event, win);
                        }
                      }}
                    >
                      <ListItemText primary={`• ${win.text}`} />
                    </ListItem>
                  ))}
                  <ListSubheader
                    sx={{
                      background: "transparent",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "4px",
                      marginLeft: "auto", // Сдвигает компонент вправо в родителе с display: flex
                      width: "fit-content", // Чтобы фон был по размеру контента
                      lineHeight: 1,
                      px: 0.5, // Горизонтальный внутренний отступ (padding-inline)
                      py: 0.5, // Вертикальный отступ
                    }}
                    onClick={() => {
                      setIsCalendarOpen(true);
                      // Set the current date in the calendar to the clicked date
                      const clickedDate = new Date(date);
                      setCurrentDate(clickedDate);
                    }}
                  >
                    {(() => {
                      const d = new Date(date);
                      const day = String(d.getDate()).padStart(2, "0");
                      const month = String(d.getMonth() + 1).padStart(2, "0");
                      const year = String(d.getFullYear()).slice(2);
                      return `${day}.${month}.${year}`;
                    })()}
                  </ListSubheader>
                </Paper>
              ))}
            </List>
          </>
        ) : (
          <h3>Add your first win</h3>
        )}
      </Box>

      <CalendarModal
        open={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        wins={wins}
        initialDate={currentDate}
        onDateSelect={(selectedDate) => {
          // Find the list item with the selected date
          const dateString = format(selectedDate, "yyyy-MM-dd");
          const listItem = document.querySelector(
            `[data-date="${dateString}"]`
          );
          if (listItem) {
            // Scroll the element into view
            listItem.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }}
      />

      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleCopy} disableRipple>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          Copy
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedWin) {
              removeWin(selectedWin.id);
              handleCloseContextMenu();
            }
          }}
          disableRipple
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </ThemeProvider>
  );
}

export default App;
