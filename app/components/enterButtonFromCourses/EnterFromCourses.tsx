"use client";

import { openLogin } from "@/app/store/slices/formSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";

export const EnterButtonFromCourses = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const handleLoginClick = () => {
    if (user.email) {
      alert("Вы уже вошли");
    } else {
      dispatch(openLogin());
    }
  };

  return (
    <button
      className="bg-custom-lime h-14 rounded-[46px] flex items-center justify-center leading-110 text-lg"
      onClick={handleLoginClick}
    >
      {user ? "Добавить курс" : "Войдите, чтобы добавить курс"}
    </button>
  );
};
