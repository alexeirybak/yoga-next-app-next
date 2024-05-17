import { getAuth } from "firebase/auth";
import { getDatabase, ref, remove } from "firebase/database";
import { CardData } from "../card/Card";

export const handleUnsubscribe = async (
  event: React.MouseEvent<HTMLImageElement>,
  isAuthenticated: boolean,
  cardData: CardData,
  onCourseDeleted: (courseId: string) => void
) => {
  event.stopPropagation();

  if (!isAuthenticated) {
    alert("Нужна авторизация");
    return;
  }

  const auth = getAuth();
  const db = getDatabase();

  if (auth.currentUser) {
    const confirmed = window.confirm(
      "Вы уверены, что хотите отписаться от курса? Все, что связано с Вашим прогрессом, будет навсегда удалено"
    );

    if (confirmed) {
      const userId = auth.currentUser.uid;
      const courseId = cardData._id;

      try {
        await remove(ref(db, `users/${userId}/courses/${courseId}`));
        onCourseDeleted(courseId);
      } catch (error) {
        console.error("Ошибка при удалении курса:", error);
      }
    }
  } else {
    alert("Нужна авторизация");
  }
};
