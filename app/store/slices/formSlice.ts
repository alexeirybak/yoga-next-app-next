import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoginOpen: false,
  isRegisterOpen: false,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    openLogin(state) {
      state.isLoginOpen = true;
      state.isRegisterOpen = false;
    },
    closeLogin(state) {
      state.isLoginOpen = false;
    },
    openRegister(state) {
      state.isRegisterOpen = true;
      state.isLoginOpen = false;
    },
    closeRegister(state) {
      state.isRegisterOpen = false;
    },
  },
});

export const { openLogin, closeLogin, openRegister, closeRegister } = formSlice.actions;

export default formSlice.reducer;