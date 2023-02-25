import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { complete, setTimerTime } from "../reducers/settingsReducer";
import { Questions } from "./Questions";
import Tooltip from "./ToolTip";

export const MathsView = () => {
  const dispatch = useDispatch();
  const { usingTimer, timerTime, questions, numQuestions } = useSelector(
    (state) => state.settings
  );
  const [elapsedTime, setElapsedTime] = useState(timerTime);
  const [usingTimerLocal, setUsingTimerLocal] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  // let interval;

  useEffect(() => {
    setUsingTimerLocal(usingTimer);
  }, [usingTimer]);

  useEffect(() => {
    let interval = setInterval(() => {
      setElapsedTime((prevElapsedTime) =>
        usingTimerLocal ? prevElapsedTime - 1 : prevElapsedTime + 1
      );

      if (!usingTimerLocal) dispatch(setTimerTime({ timerTime: elapsedTime }));

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
        <Tooltip text={`${showInfo ? "Hide" : "Show"} information`}>
          <span
            style={{
              position: "absolute",
              top: 25,
              right: 0,
              transform: "translate(-50%, 0)",
              fontSize: 28,
              paddingRight: 10,
              width: usingTimerLocal ? 300 : 350,
              cursor: "pointer",
              color: showInfo ? "black" : "#33b0ff",
            }}
            onClick={() => {
              setShowInfo(!showInfo);
            }}
          >
            {usingTimerLocal
              ? `Time Remaining: ${elapsedTime}`
              : `Questions Remaining: ${numQuestions - questions.length}`}
          </span>
        </Tooltip>
      </div>
      <Questions />
    </>
  );
};
