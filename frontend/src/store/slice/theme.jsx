// themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Detect OS theme preference
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const theme = createSlice({
  name: "common",
  initialState: {
    darkMode: prefersDark ? "dark" : "light"
  },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = state.darkMode === "dark" ? "light" : "dark";
    },
    setTheme: (state, action) => {
      state.darkMode = action.payload; // "dark" or "light"
    }
  }
});

export const { toggleTheme, setTheme } = theme.actions;
export default theme.reducer;
