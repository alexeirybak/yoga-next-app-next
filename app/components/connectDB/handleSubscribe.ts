import { getAuth } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import { CardData } from "../card/Card";

export const handleSubscribe = async (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  isAuthenticated: boolean,
  cardData: CardData
) => {
  event.stopPropagation();
  if (!isAuthenticated) {
    alert("Нужна авторизация");
    return;
  }

  const auth = getAuth();
  const db = getDatabase();

  if (auth.currentUser) {
    const userId = auth.currentUser.uid;
    const courseId = cardData._id;
    const courseName = cardData.name;

    const courseData = {
      [courseId]: {
        courseId: courseId,
        name: courseName,
      },
    };

    await update(ref(db, `users/${userId}/courses`), courseData);
    alert("Вы подписаны на курс");
  }
};
