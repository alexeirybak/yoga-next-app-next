import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { fetchWorkoutStatus } from "../connectDB/fetchWorkoutStatus";

type WorkoutData = {
  _id: string;
  name: string;
  details?: string;
};

interface ProgressModalProps {
  setProgressModal: (value: boolean) => void;
  workouts: WorkoutData[];
  courseId: number | null;
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
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const userId = user.id || 0;

  const handleProgress = () => {
    setProgressModal(false);
  };

  const handleWorkoutSelect = (workout: string) => {
    setSelectedWorkout(workout);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const { fetchedWorkouts, workoutStatus } = await fetchWorkoutStatus(
        workouts,
        userId,
        courseId
      );
      setWorkoutNames(fetchedWorkouts);
      setWorkoutStatus(workoutStatus);
    };

    fetchStatus();
  }, [workouts, userId, courseId]);

  useEffect(() => {}, [workoutStatus]);

  const handleChoiceWorkout = (workoutId: string) => {
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
          <div className="text-[32px] mb-5">Выберите тренировки</div>
          <ul className="flex flex-col mb-[35px] max-h-[360px] overflow-y-auto listMenuScroll pr-5">
            {workoutNames.map((workout, index) => (
              <li
                key={index}
                className={`flex flex-row gap-x-3 border-b-[1px] border-[#c4c4c4] px-2.5 pr-2.5 pt-5 w-full  ${
                  activeWorkout === workout._id ? "bg-gray-200" : ""
                }`}
                onClick={() => handleChoiceWorkout(workout._id)}
              >
                <Image
                  src={
                    workoutStatus[index]
                      ? "/icon-check-train.svg"
                      : "/icon-check-train-no.svg"
                  }
                  alt="Checkbox"
                  width={20}
                  height={20}
                />

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
