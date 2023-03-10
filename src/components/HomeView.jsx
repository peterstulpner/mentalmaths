import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Grid } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import {
  setNumQuestions,
  setTimerTime,
  toggleTimer,
} from "../reducers/settingsReducer";

export default function HomeView() {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Settings Updated: ", settings);
  }, [settings]);

  const onRadioChange = (event) => {
    dispatch(toggleTimer());
    setInputValue("");
    setInputError(false);
  };

  const onInputChangeQuestions = (event) => {
    setInputError(false);
    const value = event.target.value;

    if (value.length === 0) {
      setInputValue("");
    }

    if (/^[0-9]+$/.test(value)) {
      if (value.length === 1 && value === "0") {
        return;
      }
      const valueInt = parseInt(value);
      if (valueInt > 100) {
        setInputValue("");
        setInputError(true);
        return;
      }

      setInputValue(value);
    }
  };

  const onInputChangeTime = (event) => {
    setInputError(false);
    const value = event.target.value;

    if (value.length === 0) {
      setInputValue("");
    }
    if (/^[0-9]+$/.test(value)) {
      if (value.length === 1 && value === "0") {
        return;
      }
      const valueInt = parseInt(value);
      if (valueInt >= 100) {
        setInputValue(`${value.slice(0, -2)}:${value.slice(-2)}`);
        return;
      }

      setInputValue(value);
    } else if (/^[0-9]+:$/.test(value)) {
      setInputValue(value);
    } else if (/^[0-9]+:[0-9]+$/.test(value)) {
      const valueSplit = value.split(":");

      let firstVal = valueSplit[0];
      let secondVal = valueSplit[1];

      if (secondVal.length > 2) {
        firstVal += secondVal.slice(0, -2);

        if (parseInt(firstVal) > 10) {
          setInputValue("");
          setInputError(true);
          return;
        }

        secondVal = secondVal.slice(-2);
      }

      setInputValue(`${firstVal}:${secondVal}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (settings.usingTimer) {
      let time = 0;
      const splitVals = inputValue.split(":");
      console.log(`Split vals: ${splitVals}`);

      if (splitVals.length > 1) {
        splitVals.forEach((val, index) => {
          const valInt = parseInt(val);

          switch (index) {
            case 1:
              time += valInt;
              break;
            default:
              time += valInt * 60;
              break;
          }
        });
      } else {
        time = parseInt(splitVals[0]);
      }

      console.log("Setting time: ", time);
      dispatch(setTimerTime({ timerTime: time }));
    } else {
      const numQuestions = parseInt(inputValue);

      dispatch(setNumQuestions({ numQuestions }));
    }

    navigate("/maths");
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: 38,
      }}
    >
      {/* <h1>Times Tables</h1> */}
      <div>
        <Form onSubmit={handleSubmit} style={{ fontSize: 38 }}>
          <Form.Group inline>
            <label>Format: </label>
            <Form.Radio
              label="Time"
              checked={settings.usingTimer}
              onChange={onRadioChange}
              style={{ fontSize: 38 }}
            />
            <Form.Radio
              label="Questions"
              style={{ fontSize: 38 }}
              checked={!settings.usingTimer}
              onChange={onRadioChange}
            />
          </Form.Group>
          <Form.Input
            inline
            label={settings.usingTimer ? "Time: " : "Questions: "}
            placeholder={settings.usingTimer ? "00:00" : "#"}
            type="text"
            onChange={
              settings.usingTimer ? onInputChangeTime : onInputChangeQuestions
            }
            value={inputValue}
            error={
              inputError &&
              (settings.usingTimer ? "Max 10 minutes" : "Max 100 questions")
            }
            style={{ fontSize: 38, width: 200 }}
          />
          <Form.Button
            type="submit"
            disabled={inputValue.length === 0}
            style={{ fontSize: 38 }}
          >
            Start
          </Form.Button>
        </Form>
      </div>
    </div>
  );
}
