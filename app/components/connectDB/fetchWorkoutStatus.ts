import { ref, get } from "firebase/database";
import { db } from "../../firebase";

type WorkoutData = {
  _id: string;
  name: string;
  details?: string;
};

export const fetchWorkoutStatus = async (
  workouts: WorkoutData[],
  userId: number,
  courseId: number | null
) => {
  const fetchedWorkouts: WorkoutData[] = [];
  const workoutStatus: { [key: string]: boolean } = {};

  for (const workout of workouts) {
    const workoutRef = ref(db, `workouts/${workout.name}`);
    const snapshot = await get(workoutRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      fetchedWorkouts.push({
        _id: data._id,
        name: data.name,
        details: data.details,
      });

      const userProgressRef = ref(
        db,
        `users/${userId}/progress/${courseId}/${workout.name}/exercises`
      );

      const userProgressSnapshot = await get(userProgressRef);
      if (userProgressSnapshot.exists()) {
        const exercises = userProgressSnapshot.val();
        const allExercisesDone = exercises.every(
          (exercise: { done: number }) => exercise.done
        );
        workoutStatus[workout._id] = allExercisesDone;
      }
    }
  }
  return { fetchedWorkouts, workoutStatus };
};
