import { useState } from "react";


export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const transition = function (newMode, replace = false) {
    setMode(newMode);
    setHistory((prev) => {
      if (!replace) {
        return [...prev, newMode];
      } else {
        return [...prev.slice(0, -1), newMode];
      }
    })
  }

  const back = function () {
    const newHistory = [...history].slice(0, -1);
    if (history.length > 1) {
      setMode(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  };

  return { mode, transition, back };
};