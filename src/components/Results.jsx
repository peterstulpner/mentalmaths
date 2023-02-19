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
    <>
      <Grid columns="3">
        <Grid.Column></Grid.Column>
        <Grid.Column>
          <h1>Times Tables - Results</h1>
          <div>
            <span>
              Elapsed Time: {timerTime}, Questions Answered: {questions.length},
              Number Correct: {numCorrect}
            </span>
          </div>
        </Grid.Column>
        <Grid.Column></Grid.Column>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column>
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
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
      </Grid>

      {showTable && (
        <Table celled padded>
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
    </>
  );
};
