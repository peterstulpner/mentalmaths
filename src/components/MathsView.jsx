import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { complete, setTimerTime } from "../reducers/settingsReducer";
import { Questions } from "./Questions";

export const MathsView = () => {
  const dispatch = useDispatch();
  const { usingTimer, timerTime } = useSelector((state) => state.settings);
  const [elapsedTime, setElapsedTime] = useState(timerTime);
  const [usingTimerLocal, setUsingTimerLocal] = useState(false);
  // let interval;

  useEffect(() => {
    setUsingTimerLocal(usingTimer);
  }, [usingTimer]);

  console.log("This was called");
  useEffect(() => {
    console.log("And so was this");
    let interval = setInterval(() => {
      setElapsedTime(usingTimerLocal ? elapsedTime - 1 : elapsedTime + 1);

      if (usingTimer && elapsedTime - 1 === 0) {
        !usingTimer && dispatch(setTimerTime({ timerTime: elapsedTime }));
        dispatch(complete());
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <h1>Times Tables</h1>
      <div>
        <span style={{ fontSize: 30, paddingRight: 10, width: 300 }}>
          {usingTimer
            ? `Time Remaining: ${elapsedTime}`
            : `Time Taken: ${elapsedTime}`}
        </span>
      </div>
      <Questions />
    </>
  );
};
