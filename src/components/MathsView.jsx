import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Grid, Label, Input } from "semantic-ui-react";
import { addQuestion, setTimerTime } from "../reducers/settingsReducer";

export const MathsView = () => {
  const dispatch = useDispatch();
  const {
    usingTimer,
    timerTime,
    numQuestions,
    bannedQuestions,
    maxNum,
    minNum,
    questions,
  } = useSelector((state) => state.settings);
  const [inputValue, setInputValue] = useState("");
  const [questionValue, setQuestionValue] = useState("");
  const [question, setQuestion] = useState({});
  const [numAnswered, setNumAnswered] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(timerTime);
  const [excersizeComplete, setExcersizeComplete] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (questions.length === numQuestions && numQuestions !== 0) {
      dispatch(setTimerTime({ timerTime: elapsedTime }));
      setExcersizeComplete(true);
    }
  }, [questions, numQuestions]);

  useEffect(() => {
    const interval = setInterval(timerControl, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const timerControl = () => {
    setElapsedTime(usingTimer ? elapsedTime - 1 : elapsedTime + 1);

    if (usingTimer && elapsedTime - 1 === 0) {
      setExcersizeComplete(true);
    }
  };

  useEffect(() => {
    if (timerTime === 0 && numQuestions === 0) {
      navigate("/");
    }
  }, [timerTime, numQuestions, navigate]);

  useEffect(() => {
    if (excersizeComplete) {
      navigate("/results");
    }
  }, [excersizeComplete]);

  useEffect(() => {
    if (questionValue === "") {
      generateQuestion();
    }
  }, [questionValue]);

  const onInputChange = (event) => {
    const eventVal = event.target.value;

    if (eventVal.length === 0) {
      setInputValue("");
    }
    if (!/^[0-9]+$/.test(eventVal)) {
      return;
    } else {
      if (eventVal.length > 3) {
        return;
      }
      const value = parseInt(eventVal);
      setInputValue(value);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("Input value: ", inputValue);
      console.log("Typeof input value: ", typeof inputValue);
      if (typeof inputValue !== "string") {
        console.log("Enter pressed");
        generateQuestion();
        setInputValue("");
      }
    }
  };

  const generateQuestion = () => {
    const prevQuestion = question;

    if (prevQuestion.answer) {
      dispatch(
        addQuestion({
          question: {
            ...prevQuestion,
            correct: inputValue === prevQuestion.answer,
          },
        })
      );
    }

    let questionGenerated = false;

    let num1 = Math.floor(Math.random() * maxNum) + minNum;
    let num2 = Math.floor(Math.random() * maxNum) + minNum;

    while (!questionGenerated) {
      questionGenerated = true;

      // eslint-disable-next-line no-loop-func
      bannedQuestions.forEach((question) => {
        console.log(question[1] === "*");
        if (
          question[1] === "*" &&
          (num2 === question[0] || num1 === question[0])
        ) {
          questionGenerated = false;
          if (num2 === question[0]) {
            num2 = Math.floor(Math.random() * maxNum) + minNum;
          } else {
            num1 = Math.floor(Math.random() * maxNum) + minNum;
          }
        }
      });
    }

    console.log(`Question Generated: ${num1} x ${num2}`);
    setQuestionValue(`${num1} x ${num2} =`);

    setQuestion({ num1, num2, answer: num1 * num2 });
  };

  return (
    <>
      <Grid columns="3">
        <Grid.Column></Grid.Column>
        <Grid.Column>
          <h1>Times Tables</h1>
          <div>
            <span style={{ fontSize: 30, paddingRight: 10, width: 300 }}>
              {usingTimer
                ? `Time Remaining: ${elapsedTime}`
                : `Time Taken: ${elapsedTime}`}
            </span>
          </div>
          <span style={{ fontSize: 30, paddingRight: 10, width: 300 }}>
            {questionValue}
          </span>
          <Input
            size="large"
            style={{ width: 75 }}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            value={inputValue}
          />
        </Grid.Column>
        <Grid.Column></Grid.Column>
      </Grid>
    </>
  );
};
