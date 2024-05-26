import { getAuth } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import { CardData } from "../card/Card";

export const handleSubscribe = async (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  cardData: CardData
) => {
  event.stopPropagation();

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

    try {
      await update(ref(db, `users/${userId}/courses`), courseData);
      return "Вы успешно подписались";
    } catch (error) {
      console.error("Ошибка при подписке на курс:", error);
      return "Ошибка при подписке на курс";
    }
  }
};
