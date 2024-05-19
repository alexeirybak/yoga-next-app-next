"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { ref, onValue } from "firebase/database";
import { useContext } from "react";
import { WorkoutContext } from "@/app/context/workoutContext";
import { openModal, closeModal } from "@/app/store/slices/modalSlice";
import { useDispatch } from "react-redux";
import "../../../globals.css";

export default function Workout() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [workoutData, setWorkoutData] = useState<any>(null);
  const { courseByWorkout } = useContext(WorkoutContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      const workoutRef = ref(db, `workouts/${id}`);
      onValue(workoutRef, (snapshot) => {
        const data = snapshot.val();
        setWorkoutData(data);
      });
    }
  }, [id]);

  if (!workoutData) {
    return <div>Загрузка...</div>;
  }

  const handleWriteProgress = () => {
    dispatch(openModal("Ваш прогресс засчитан"));
    setTimeout(() => {
      dispatch(closeModal());
    }, 1500);
  };

  return (
    <div>
      <h1 className="font-medium text-6xl mb-6">{courseByWorkout}</h1>
      {workoutData.details && (
        <p className="text-[32px] mb-10">{workoutData.details}</p>
      )}
      {workoutData.video && (
        <div className="mb-10 ">
          <iframe
            src={workoutData.video}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-[1160px] h-[639px] rounded-[30px]"
          ></iframe>
        </div>
      )}
      <div className="w-full max-w-[1160px] p-10 bg-white modalContentProgress">
        <h2 className="text-[32px] leading-110 mb-5">
          Упражнения тренировки “{workoutData.name}”
        </h2>
        {workoutData.exercises && (
          <ul className="flex flex-row flex-wrap gap-y-5 gap-x-[60px] mb-10">
            {workoutData.exercises.map((exercise: any, index: number) => (
              <li key={index} className="w-[320px]">
                <div className="">
                  {exercise?.name} ({exercise?.quantity} повторений)
                </div>
                <div className="w-[320px] h-[6px] bg-[#f7f7f7] mt-2.5">
                  <div className="w-[150px] h-[6px] bg-[#00c1ff] rounded-[50px]"></div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleWriteProgress}
          className="text-lg leading-110 rounded-[46px] px-[26px] py-4 bg-custom-lime hover:bg-[#c6ff00] active:bg-black active:text-white transition-colors duration-300 ease-in-out"
        >
          Обновить свой прогресс
        </button>
      </div>
    </div>
  );
}
