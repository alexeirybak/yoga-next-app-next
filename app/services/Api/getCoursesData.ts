export async function getCoursesData() {
  const response = await fetch(
    "https://fitness-next-default-rtdb.europe-west1.firebasedatabase.app/courses.json",
    {
      next: {
        revalidate: 60,
      },
    }
  );

  if (!response.ok) throw Error("На данный момент невозможно получить данные");

  return response.json();
}

export async function getCoursesDataById(id: any) {
  const response = await fetch(
    `https://fitness-next-default-rtdb.europe-west1.firebasedatabase.app/courses/${id}.json`,
    {
      next: {
        revalidate: 60,
      },
    }
  );
  if (!response.ok) throw Error("На данный момент невозможно получить данные");

  return response.json();
}
