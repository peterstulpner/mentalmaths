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
    if (questions.length >= numQuestions && numQuestions !== 0) {
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
    console.log("Generating new question =========");
    const prevQuestion = question;
    console.log("Previous Question: ", prevQuestion);

    if (prevQuestion.answer) {
      dispatch(
        addQuestion({
          question: {
            ...prevQuestion,
            correct: inputValue === prevQuestion.answer,
          },
        })
      );

      if (inputValue === question.answer) {
        setCorrect(true);
      } else {
        setCorrect(false);
        dispatch(
          addIncorrectQuestion({
            question: prevQuestion,
          })
        );
        return;
      }
    }

    console.log(
      "Checking incorrect question bank: Num incorrect: ",
      incorrectQuestions.length
    );
    for (var incorrectQuestion of incorrectQuestions) {
      if (
        incorrectQuestion.questionsSinceWrong % 3 === 0 &&
        incorrectQuestion.questionsSinceWrong < 10 &&
        incorrectQuestion.questionsSinceWrong > 0
      ) {
        console.log("Using Incorrect Question: ", incorrectQuestion);
        let num1 = incorrectQuestion.num1;
        let num2 = incorrectQuestion.num2;
        setQuestionValue(`${num1} x ${num2} =`);
        setQuestion({ num1, num2, answer: num1 * num2 });
        // dispatch(
        //   addQuestion({
        //     question: {
        //       ...prevQuestion,
        //       correct: inputValue === prevQuestion.answer,
        //     },
        //   })
        // );
        return;
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

      // eslint-disable-next-line no-loop-func
      incorrectQuestions.forEach((question) => {
        if (
          (num1 === question.num1 && num2 === question.num2) ||
          (num2 === question.num1 && num1 === question.num2)
        ) {
          num1 = Math.floor(Math.random() * maxNum) + minNum;
          num2 = Math.floor(Math.random() * maxNum) + minNum;
          questionGenerated = false;
        }
      });
    }

    console.log(`Question Generated: ${num1} x ${num2}`);
    setQuestionValue(`${num1} x ${num2} =`);

    setQuestion({ num1, num2, answer: num1 * num2 });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: 28,
      }}
    >
      <span style={{ fontSize: 70, paddingRight: 10, width: 450 }}>
        {questionValue}
      </span>
      <Input
        size="large"
        style={{ fontSize: 70, width: 275 }}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={correct ? inputValue : question.answer}
        error={!correct}
        enabled={correct}
      />
      {!correct && (
        <div style={{ paddingTop: 10 }}>
          <Button
            onClick={() => {
              setCorrect(true);
            }}
            style={{ fontSize: 38 }}
          >
            Click to Continue
          </Button>
        </div>
      )}
    </div>
  );
};
