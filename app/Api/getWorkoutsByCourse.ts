import { databaseURL } from "../firebase";

export async function getWorkoutsByCourse(courseId: number) {
    const response = await fetch(
      `${databaseURL}/courses/${courseId}/workout.json`
    );
    if (!response.ok) throw Error("На данный момент невозможно получить данные");
  
    const data = await response.json();
    return data;
  }