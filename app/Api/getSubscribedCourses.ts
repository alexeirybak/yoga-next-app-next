import { databaseURL } from "../firebase";

export async function getSubscribedCourses(userId: string) {
  const response = await fetch(`${databaseURL}/users/${userId}/courses.json`);

  if (!response.ok) throw Error("На данный момент невозможно получить данные");

  return response.json();
}
