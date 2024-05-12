"use client";

import { openLogin } from "@/app/store/slices/formSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/store/slices/userSlice";
import { useEffect, useState } from "react";
import { RootState } from "@/app/store";

export const EnterButtonFromCourses = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        dispatch(setUser(parsedUserData));
      }
    }
  }, [dispatch, isClient]);

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
      Войдите, чтобы добавить курс
    </button>
  );
};
