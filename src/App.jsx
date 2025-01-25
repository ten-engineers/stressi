import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function App() {
  const [achievements, setAchievements] = useState([]); // Начальное значение — 0

  const addAchievement = () => {
    setAchievements(achievements + text);
    clearText(); //
  };

  const [text, setText] = useState(""); // Начальное состояние пустое

  const handleChange = (event) => {
    setText(event.target.value); // Обновляем состояние на основе ввода
  };
  const clearText = () => {
    setText(""); // Очищаем состояние (и поле)
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
        value={text} // Привязываем значение к состоянию
        onChange={handleChange} // Обрабатываем изменение текста
        label="Enter something"
        variant="outlined"
      />
      <div>
        <Button onClick={addAchievement} variant="contained" color="primary">
          Add achievement
        </Button>
      </div>
      <div>
        <p>Текущее значение: {achievements}</p>
      </div>
    </>
  );
}

export default App;
