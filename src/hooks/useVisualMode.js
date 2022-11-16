import { useState } from "react";


export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const transition = function (newMode, replace = false) {
    setMode(newMode);
    if (replace) {
      // Replace last element of history with newMode
      // Ex: [1,2] newMode = 3, history = [1,3]
      history[history.length -1] = newMode;
      setHistory(history);
    } else {
      setHistory(prev => [...prev, newMode]);
    }
  }

  const back = function () {
    const newHistory =[...history]
    if (history.length === 1) {
      return mode;
    } else {
      if (typeof history === "object") {
        history.pop()
        let num = history.length - 1;
        setMode(history[num]);
      }
    }
  }

  return { mode, transition, back };
};