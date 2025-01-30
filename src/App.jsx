import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function App() {
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
    <>
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
    </>
  );
}

export default App;
