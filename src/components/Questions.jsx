import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Grid, Label, Input, Button } from "semantic-ui-react";
import {
  addIncorrectQuestion,
  addQuestion,
  setTimerTime,
} from "../reducers/settingsReducer";

export const Questions = () => {
  const dispatch = useDispatch();
  const {
    usingTimer,
    timerTime,
    numQuestions,
    bannedQuestions,
    maxNum,
    minNum,
    questions,
    incorrectQuestions,
  } = useSelector((state) => state.settings);
  const [inputValue, setInputValue] = useState("");
  const [questionValue, setQuestionValue] = useState("");
  const [question, setQuestion] = useState({});
  const [numAnswered, setNumAnswered] = useState(0);
  const [excersizeComplete, setExcersizeComplete] = useState(false);
  const [correct, setCorrect] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      questions.length - incorrectQuestions.length === numQuestions &&
      numQuestions !== 0
    ) {
      setExcersizeComplete(true);
    }
  }, [questions, numQuestions]);

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
      if (typeof inputValue !== "string") {
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

      if (inputValue !== prevQuestion.answer) {
        setCorrect(false);
        dispatch(
          addIncorrectQuestion({
            question: prevQuestion,
          })
        );
        return;
      } else {
        setCorrect(true);
      }
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
      <span style={{ fontSize: 30, paddingRight: 10, width: 300 }}>
        {questionValue}
      </span>
      <Input
        size="large"
        style={{ width: 75 }}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={correct ? inputValue : question.answer}
        error={!correct}
        enabled={correct}
      />
      {!correct && (
        <>
          <Button
            onClick={() => {
              setCorrect(true);
            }}
          >
            Click to Continue
          </Button>
        </>
      )}
    </>
  );
};
