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
  },
});

export const {
  toggleTimer,
  setNumQuestions,
  incrementCorrect,
  addQuestion,
  setTimerTime,
} = settingsSlice.actions;

export default settingsSlice.reducer;
