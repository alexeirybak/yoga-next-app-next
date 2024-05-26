import { getAuth } from "firebase/auth";
import { getDatabase, ref, remove } from "firebase/database";
import { CardData } from "../card/Card";

export const handleUnsubscribe = async (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  cardData: CardData,
) => {
  event.stopPropagation();

  const auth = getAuth();
  const db = getDatabase();

  if (auth.currentUser) {
    const userId = auth.currentUser.uid;
    const courseId = cardData._id;

    try {
      await remove(ref(db, `users/${userId}/courses/${courseId}`));
      return "Вы успешно отписались";
    } catch (error) {
      console.error("Ошибка при удалении курса:", error);
      return "Ошибка при отписке от курса";
    }
  }
};
