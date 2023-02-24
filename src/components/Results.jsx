import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Grid, Label, Table, Icon, Button } from "semantic-ui-react";
import { reset } from "../reducers/settingsReducer";

export const Results = () => {
  const dispatch = useDispatch();
  const {
    usingTimer,
    timerTime,
    numQuestions,
    bannedQuestions,
    maxNum,
    minNum,
    questions,
    numCorrect,
  } = useSelector((state) => state.settings);

  const [showTable, setShowTable] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (timerTime === 0 && numQuestions === 0) {
      navigate("/");
    }
  }, [timerTime, numQuestions, navigate]);

  return (
    <div
      style={{
        fontSize: 38,
        left: "50%",
        top: showTable ? "0" : "40%",
        position: "absolute",
        transform: "translate(-50%, 0)",
        paddingRight: 10,
        display: "inline",
        padding: "10px",
        lineHeight: "1.5em",
        overflow: "auto",
      }}
    >
      <div>
        Elapsed Time: {timerTime}, Questions Answered: {questions.length},
        Number Correct: {numCorrect}
      </div>

      <Button
        onClick={() => {
          dispatch(reset());
          navigate("/");
        }}
      >
        {" "}
        Start Again{" "}
      </Button>
      <Button
        onClick={() => {
          setShowTable(!showTable);
        }}
      >
        {showTable ? "Hide full Results" : "See full Results"}
      </Button>

      {showTable && (
        <Table celled padded style={{ fontSize: 20, overflow: "auto" }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell singleLine>Question</Table.HeaderCell>
              <Table.HeaderCell>Correct Answer</Table.HeaderCell>
              <Table.HeaderCell>Result</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {questions.map((question, index) => {
              console.log("Question: ", question.correct);
              return (
                <Table.Row key={index}>
                  <Table.Cell>{`${question.num1} x ${question.num2}`}</Table.Cell>
                  <Table.Cell>{question.answer}</Table.Cell>
                  <Table.Cell>
                    {question.correct ? (
                      <Icon color="green" name="checkmark" size="large" />
                    ) : (
                      <Icon color="red" name="close" size="large" />
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};
