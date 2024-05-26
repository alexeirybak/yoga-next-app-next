import { databaseURL } from "../firebase";

export async function getWorkoutProgress(userId: string, courseId: string) {
  const response = await fetch(
    `${databaseURL}/users/${userId}/progress/${courseId}.json`
  );

  if (!response.ok) {
    throw new Error("На данный момент невозможно получить данные о тренировке");
  }

  return response.json();
}
