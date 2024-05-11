export async function getCoursesData() {
  const response = await fetch(
    "https://fitness-next-default-rtdb.europe-west1.firebasedatabase.app/courses.json"
  );
  return response.json();
}
