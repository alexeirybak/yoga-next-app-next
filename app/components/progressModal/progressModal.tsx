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
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  setProgressModal,
  workouts,
}) => {
  const [workoutNames, setWorkoutNames] = useState<WorkoutData[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
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
    const fetchWorkoutNames = async () => {
      const fetchedWorkouts = [];
  
      for (const workout of workouts) {
        try {
          const response = await fetch(`https://fitness-54b16-default-rtdb.europe-west1.firebasedatabase.app/workouts/${workout.name}.json`);
          if (!response.ok) {
            throw new Error('Ошибка при загрузке данных тренировки');
          }
          const data = await response.json();
          console.log(data);
          
          fetchedWorkouts.push({
            _id: data._id,
            name: data.name,
            details: data.details,
          });
        } catch (error) {
          console.error('Ошибка при получении данных тренировки:', error);
        }
      }
  
      setWorkoutNames(fetchedWorkouts);
    };
  
    fetchWorkoutNames();
  }, [workouts]); 

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
            {workoutNames.map((workout) => (
              <li
                key={workout._id}
                className={`flex flex-row gap-x-3 border-b-[1px] border-[#c4c4c4] p-[10px] w-full  ${
                  activeWorkout === workout._id ? "bg-gray-200" : ""
                }`}
                onClick={() => handleChoiceWorkout(workout._id)}
              >
                <Image
                  src={
                    selectedWorkout === workout._id
                      ? "/icon-check-train.svg"
                      : "/icon-check-train.svg"
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
