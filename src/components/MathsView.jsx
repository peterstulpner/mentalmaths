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

  useEffect(() => {
    let interval = setInterval(() => {
      setElapsedTime((prevElapsedTime) =>
        usingTimerLocal ? prevElapsedTime - 1 : prevElapsedTime + 1
      );

      if (usingTimer && elapsedTime - 1 === 0) {
        !usingTimer && dispatch(setTimerTime({ timerTime: elapsedTime }));
        dispatch(complete());
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [elapsedTime, usingTimerLocal, usingTimer]);

  return (
    <>
      <div>
        <span
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            transform: "translate(-50%, 0)",
            fontSize: 28,
            paddingRight: 10,
            width: 300,
          }}
        >
          {usingTimerLocal
            ? `Time Remaining: ${elapsedTime}`
            : `Time Taken: ${elapsedTime}`}
        </span>
      </div>
      <Questions />
    </>
  );
};
