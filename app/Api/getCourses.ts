import { databaseURL } from "../firebase";

export async function getCoursesData() {
  const response = await fetch(`${databaseURL}/courses.json`);

  if (!response.ok) throw Error("На данный момент невозможно получить данные");

  return response.json();
}
