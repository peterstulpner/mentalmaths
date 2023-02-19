import { createSlice } from "@reduxjs/toolkit";

const initState = {
  usingTimer: true,
  numCorrect: 0,
  questions: [],
  timerTime: 0,
  numQuestions: 0,
  bannedQuestions: [
    [1, "*"],
    [2, "*"],
  ],
  maxNum: 12,
  minNum: 1,
  incorrectQuestions: [],
  excersizeComplete: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: initState,
  reducers: {
    toggleTimer: (state, action) => {
      state.usingTimer = !state.usingTimer;
    },
    setNumQuestions: (state, { type, payload }) => {
      state.numQuestions = payload.numQuestions;
    },
    incrementCorrect: (state, action) => {
      state.numCorrect++;
    },
    addQuestion: (state, { type, payload }) => {
      state.questions.push(payload.question);
    },
    setTimerTime: (state, { type, payload }) => {
      state.timerTime = payload.timerTime;
    },
    addIncorrectQuestion: (state, { type, payload }) => {
      state.incorrectQuestions.push(payload.question);
    },
    complete: (state, action) => {
      state.excersizeComplete = true;
    },
    reset: (state, action) => {
      state.questions = initState.questions;
      state.usingTimer = initState.usingTimer;
      state.excersizeComplete = false;
      state.timerTime = 0;
      state.numQuestions = 0;
      state.numCorrect = 0;
    },
  },
});

export const {
  toggleTimer,
  setNumQuestions,
  incrementCorrect,
  addQuestion,
  setTimerTime,
  addIncorrectQuestion,
  complete,
  reset,
} = settingsSlice.actions;

export default settingsSlice.reducer;
