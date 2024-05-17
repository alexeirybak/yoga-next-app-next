
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import formReducer from "./slices/formSlice";
import modalReducer from "./slices/modalSlice"; 

export const store = configureStore({
  reducer: {
    user: userReducer,
    form: formReducer,
    modal: modalReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
