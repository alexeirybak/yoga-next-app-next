"use client"

import { useContext } from "react";
import { WorkoutContext } from "@/app/context/workoutContext";

interface ProgressCardProps {
  setProgressModal: (value: boolean) => void;
  courseName: string
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  setProgressModal,
  courseName,
}) => {

  const { setCourseByWorkout } = useContext(WorkoutContext);
  const handleProgress = () => {
    setProgressModal(true);
    setCourseByWorkout(courseName)
  };

  return (
    <div className="mx-auto bg-white text-lg">
      <div className="leading-110 mt-5 mb-2.5">Прогресс 50%</div>
      <div className="w-[300px] h-[6px] bg-[#f7f7f7] mb-10">
        <div className="w-[150px] h-[6px] bg-[#00c1ff] rounded-[50px]"></div>
      </div>
      <button
        onClick={handleProgress}
        className="bg-custom-lime hover:bg-[#c6ff00] active:bg-black active:text-white py-4 px-[26px] rounded-[46px] w-[300px] h-[52px] leading-110"
      >
        Продолжить
      </button>
    </div>
  );
};

export default ProgressCard;
