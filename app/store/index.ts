import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import formReducer from "./slices/formSlice"; // Импортируйте новый слайс

export const store = configureStore({
  reducer: {
    user: userReducer,
    form: formReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
