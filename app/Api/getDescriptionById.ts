import { databaseURL } from "../firebase";

export async function getDescriptionById(id: any) {
  const response = await fetch(`${databaseURL}/courses/${id}.json`);
  if (!response.ok) throw Error("На данный момент невозможно получить данные");

  return response.json();
}
