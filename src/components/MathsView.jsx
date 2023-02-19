import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Grid, Label, Input, Button } from "semantic-ui-react";
import {
  addIncorrectQuestion,
  addQuestion,
  complete,
  setTimerTime,
} from "../reducers/settingsReducer";
import { Questions } from "./Questions";

export const MathsView = () => {
  const dispatch = useDispatch();
  const { usingTimer, timerTime, excersizeComplete, numQuestions } =
    useSelector((state) => state.settings);
  const [elapsedTime, setElapsedTime] = useState(timerTime);

  const [completeFromChild, setCompleteFromChild] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (timerTime === 0 && numQuestions === 0) {
      navigate("/");
    }
  }, [timerTime, numQuestions, navigate]);

  useEffect(() => {
    const interval = setInterval(timerControl, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const timerControl = () => {
    setElapsedTime(usingTimer ? elapsedTime - 1 : elapsedTime + 1);

    if ((usingTimer && elapsedTime - 1 === 0) || completeFromChild) {
      !usingTimer && dispatch(setTimerTime({ timerTime: elapsedTime }));
      dispatch(complete());
    }
  };

  useEffect(() => {
    if (excersizeComplete) {
      navigate("/results");
    }
  }, [excersizeComplete]);

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
      <Questions setComplete={setCompleteFromChild} />
    </>
  );
};
