import { databaseURL } from "../firebase";

export async function getSubscribedCourses(userId: string) {
    const response = await fetch(
      `${databaseURL}/users/${userId}/courses.json`,
      {
        next: {
          revalidate: 60,
        },
      }
    );
  
    if (!response.ok) throw Error("На данный момент невозможно получить данные");
  
    return response.json();
  }
