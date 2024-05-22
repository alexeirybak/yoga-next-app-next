import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import "../../globals.css";
import { RootState } from "@/app/store";

type WorkoutData = {
  _id: string;
  name: string;
  details?: string;
};

interface ProgressModalProps {
  setProgressModal: (value: boolean) => void;
  workouts: WorkoutData[];
  courseId: number;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  setProgressModal,
  workouts,
  courseId,
}) => {
  const [workoutNames, setWorkoutNames] = useState<WorkoutData[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [workoutStatus, setWorkoutStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const [activeWorkout, setActiveWorkout] = useState(null);
  const user = useSelector((state: RootState) => state.user);
  const userId = user.id || 0;

  const handleProgress = () => {
    setProgressModal(false);
  };

  const handleWorkoutSelect = (workout: string) => {
    setSelectedWorkout(workout);
  };

  useEffect(() => {
    const fetchWorkoutStatus = async () => {
      const fetchedWorkouts: WorkoutData[] = [];

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
              (exercise) => exercise.done
            );
            setWorkoutStatus((prevStatus) => ({
              ...prevStatus,
              [workout._id]: allExercisesDone,
            }));
          }
        }
      }
      setWorkoutNames(fetchedWorkouts);
    };

    fetchWorkoutStatus();
  }, [workouts, userId, courseId]);

  useEffect(() => {}, [workoutStatus]);

  const handleChoiceWorkout = (workoutId) => {
    setActiveWorkout(workoutId);
    handleWorkoutSelect(workoutId);
  };

  return (
    <div className="modalOverlay ">
      <div className="modalContentProgress w-[460px]">
        <div className="relative">
          <button
            className="text-2xl w-5 absolute right-0"
            onClick={handleProgress}
          >
            &#10060;
          </button>
          <div className="text-[32px] mb-5">Выберите тренировку</div>
          <ul className="flex flex-col mb-[35px] gap-y-5 max-h-[360px] overflow-y-auto listMenuScroll pr-5">
            {workoutNames.map((workout, index) => (
              <li
                key={index}
                className={`flex flex-row gap-x-3 border-b-[1px] border-[#c4c4c4] p-[10px] w-full  ${
                  activeWorkout === workout._id ? "bg-gray-200" : ""
                }`}
                onClick={() => handleChoiceWorkout(workout._id)}
              >
                {workoutStatus[index] ? (
                  <Image
                    src="/icon-check-train.svg"
                    alt="Checkbox"
                    width={20}
                    height={20}
                  />
                ) : (
                  <Image
                    src="/icon-check-train-no.svg"
                    alt="Checkbox"
                    width={20}
                    height={20}
                  />
                )}

                <button className="flex flex-col flex-grow">
                  <div className="text-[24px] leading-110 my-2.5 text-left">
                    {workout.name}
                  </div>
                  {workout.details && (
                    <div className="text-left leading-110">
                      {workout.details}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-center">
            {selectedWorkout ? (
              <Link
                href={`/pages/workouts/${selectedWorkout}`}
                className="btnGreen flex justify-center py-4 px-[26px] rounded-[46px] w-[283px] h-[52px]"
              >
                Начать
              </Link>
            ) : (
              <button
                disabled
                className="text-lg border-[#999] border-[1px] text-[#999] py-4 px-[26px] rounded-[46px] w-[283px] h-[52px] leading-110 cursor-not-allowed"
              >
                Начать
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
