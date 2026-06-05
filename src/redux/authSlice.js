import { createSlice } from "@reduxjs/toolkit";

const auth = createSlice({
  name: "auth",

  initialState: {
    token: (() => {
      const storedToken = localStorage.getItem("token");
      return storedToken && storedToken !== "null" && storedToken !== "undefined"
        ? storedToken
        : null;
    })(),
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  },

  reducers: {
    login: (state, action) => {
      const token = action.payload?.token;

      if (token && token !== "null" && token !== "undefined") {
        state.token = token;
        localStorage.setItem("token", token);
      } else {
        state.token = null;
        localStorage.removeItem("token");
      }

      // Normalize user information: accept either `user` object or `userRole` string
      if (action.payload?.user) {
        const userObj = { ...action.payload.user };
        if (userObj.role) userObj.role = String(userObj.role).toLowerCase();
        state.user = userObj;
        localStorage.setItem("user", JSON.stringify(userObj));
      } else if (action.payload?.userRole) {
        const normalized = { role: String(action.payload.userRole).toLowerCase() };
        state.user = normalized;
        localStorage.setItem("user", JSON.stringify(normalized));
      } else {
        state.user = null;
        localStorage.removeItem("user");
      }
    },

    logout: (state) => {
      state.token = null;
      state.user = null;

      localStorage.clear();
    },
  },
});

export const {
  login,

  logout,
} = auth.actions;

export default auth.reducer;
