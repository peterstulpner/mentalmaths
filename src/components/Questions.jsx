import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input, Button } from "semantic-ui-react";
import {
  addIncorrectQuestion,
  addQuestion,
  complete,
  incrementCorrect,
  removeIncorrectQuestion,
} from "../reducers/settingsReducer";
import { useNavigate } from "react-router-dom";

export const Questions = () => {
  const dispatch = useDispatch();
  const {
    timerTime,
    numQuestions,
    bannedQuestions,
    maxNum,
    minNum,
    questions,
    incorrectQuestions,
    excersizeComplete,
  } = useSelector((state) => state.settings);
  const [inputValue, setInputValue] = useState("");
  const [questionValue, setQuestionValue] = useState("");
  const [question, setQuestion] = useState({});
  const [correct, setCorrect] = useState(true);
  const [numQuestionsSinceLastAttempt, setNumQuestionsSinceLastAttempt] =
    useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (timerTime === 0 && numQuestions === 0) {
      navigate("/");
    }
  }, [timerTime, numQuestions, navigate]);

  useEffect(() => {
    if (
      questions.length - incorrectQuestions.length === numQuestions &&
      numQuestions !== 0
    ) {
      dispatch(complete());
    }
  }, [questions, numQuestions]);

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

    for (var incorrectQuestion of incorrectQuestions) {
      console.log("Incorrect Questin: ", incorrectQuestion);
      if (incorrectQuestion.questionsSinceWrong === 3) {
        let num1 = incorrectQuestion.num1;
        let num2 = incorrectQuestion.num2;
        setQuestionValue(`${num1} x ${num2} =`);
        setQuestion({ num1, num2, answer: num1 * num2 });
        console.log("USING PREVIOUSLY INCORRECT QUESTION");
        dispatch(removeIncorrectQuestion());
        return;
      }
    }

    if (prevQuestion.answer) {
      dispatch(
        addQuestion({
          question: {
            ...prevQuestion,
            correct: inputValue === prevQuestion.answer,
          },
        })
      );

      if (inputValue === prevQuestion.answer) dispatch(incrementCorrect());

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
      <span style={{ fontSize: 100, paddingRight: 10, width: 450 }}>
        {questionValue}
      </span>
      <Input
        size="large"
        style={{ fontSize: 100, width: 450 }}
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
            style={{ fontSize: 50 }}
          >
            Click to Continue
          </Button>
        </>
      )}
    </>
  );
};
