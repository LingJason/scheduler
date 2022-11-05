import { useState } from "react";


export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {
    setMode(newMode);
    if (replace) {
      // replace the current mode in the history with the new mode
      // For example [1,2] new mode = 3 replace = true
      // new array will be [1,3]
      history[history.length -1] = newMode;
      setHistory(history);
    } else {
      history.push(newMode);
    }
  }

  const back = function () {
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