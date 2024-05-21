export async function getDescriptionById(id: any) {
    const response = await fetch(
      `https://fitness-54b16-default-rtdb.europe-west1.firebasedatabase.app/courses/${id}.json`,
      {
        next: {
          revalidate: 60,
        },
      }
    );
    if (!response.ok) throw Error("На данный момент невозможно получить данные");
  
    return response.json();
  }