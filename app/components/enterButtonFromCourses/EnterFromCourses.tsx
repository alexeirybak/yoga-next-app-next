"use client";

import { handleSubscribe } from "../connectDB/handleSubscribe";
import { CardData } from "../card/Card";
import { openLogin } from "@/app/store/slices/formSlice";
import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/app/store/slices/modalSlice";
import { useAuth } from "@/app/hooks/use-auth";

type Props = {
  courseId: string;
  courseName: string;
};

export const EnterButtonFromCourses = ({ courseId, courseName }: Props) => {
  const dispatch = useDispatch();
  const { isAuth } = useAuth();

  const handleLoginClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (isAuth) {
      const cardData: CardData = {
        _id: courseId, name: courseName,
        title: "",
        description: "",
        imageUrl: ""
      };
      await handleSubscribe(event, cardData);
      dispatch(openModal("Вы успешно подписались"));
      setTimeout(() => {
        dispatch(closeModal());
      }, 1500);
    } else {
      dispatch(openLogin());
    }
  };

  return (
    <button
      className="btnGreen h-14 rounded-[46px] flex items-center justify-center"
      onClick={handleLoginClick}
    >
      {isAuth ? "Добавить курс" : "Войдите, чтобы добавить курс"}
    </button>
  );
};
