import { databaseURL } from "../firebase";

export async function getCoursesData() {
    const response = await fetch(
      `${databaseURL}/courses.json`,
      {
        next: {
          revalidate: 60,
        },
      }
    );
  
    if (!response.ok) throw Error("На данный момент невозможно получить данные");
  
    return response.json();
  }