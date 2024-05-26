import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseId: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourseId(state, action) {
      state.courseId = action.payload;
    },
  },
});

export const { setCourseId } = courseSlice.actions;

export default courseSlice.reducer;
