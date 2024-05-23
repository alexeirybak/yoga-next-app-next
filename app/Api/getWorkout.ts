import { databaseURL } from "../firebase";

export async function getWorkoutData(workoutId: string) {
  const response = await fetch(
    `${databaseURL}/workouts/${workoutId}.json`,
  );

  if (!response.ok) {
    throw new Error("На данный момент невозможно получить данные о тренировке");
  }

  return response.json();
}
