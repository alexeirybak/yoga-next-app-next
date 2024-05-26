import { databaseURL } from "../firebase";

export async function getCommonMovies(workoutId: number) {
    const response = await fetch(
      `${databaseURL}/workouts/${workoutId}.json`
    );
    if (!response.ok) throw Error("На данный момент невозможно получить данные");
  
    const data = await response.json();
    return data;
  }