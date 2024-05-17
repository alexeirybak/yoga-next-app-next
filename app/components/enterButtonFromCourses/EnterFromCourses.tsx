"use client";

import { handleSubscribe } from "../connectDB/handleSubscribe";
import { CardData } from "../card/Card";
import { openLogin } from "@/app/store/slices/formSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";

type Props = {
  courseId: string;
  courseName: string;
};

export const EnterButtonFromCourses = ({ courseId, courseName }: Props) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleLoginClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (isAuthenticated) {
      const cardData: CardData = { _id: courseId, name: courseName };
      await handleSubscribe(event, isAuthenticated, cardData);
    } else {
      dispatch(openLogin());
    }
  };

  return (
    <button
      className="bg-custom-lime h-14 rounded-[46px] flex items-center justify-center leading-110 text-lg"
      onClick={handleLoginClick}
    >
      {isAuthenticated ? "Добавить курс" : "Войдите, чтобы добавить курс"}
    </button>
  );
};
