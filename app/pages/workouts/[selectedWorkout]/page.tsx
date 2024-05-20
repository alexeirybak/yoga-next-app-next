"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { ref, onValue, update } from "firebase/database";
import { useContext } from "react";
import { WorkoutContext } from "@/app/context/workoutContext";
import { openModal, closeModal } from "@/app/store/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import "../../../globals.css";
import { RootState } from "@/app/store";
import { getWorkoutData } from "@/app/Api/getWorkout";
import { ProgressSave } from "@/app/components/progressSave/progressSave";

interface Exercise {
  name: string;
  quantity: number;
  made: number;
}

export default function Workout() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [workoutData, setWorkoutData] = useState<any>(null);
  const [exerciseQuantities, setExerciseQuantities] = useState<any>({});
  const [progressModal, setProgressModal] = useState(false);
  const { courseByWorkout } = useContext(WorkoutContext);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const userId = user.id || 0;

  const fetchWorkoutData = useCallback(async () => {
    try {
      if (id && user && user.id) {
        const dataWorkout = await getWorkoutData(id);
        setWorkoutData(dataWorkout);
      }
    } catch (error) {
      console.error("Ошибка при получении данных о тренировке:", error);
    }
  }, [id, user]);

  useEffect(() => {
    if (id && user && user.id) {
      fetchWorkoutData();
    }
  }, [dispatch, id, user, fetchWorkoutData]);

  useEffect(() => {
    if (id) {
      const workoutRef = ref(db, `workouts/${id}/${user.id}/progress/`);
      onValue(workoutRef, (snapshot) => {
        const data = snapshot.val();
      });
    }
  }, [user.id, id]);

  if (!workoutData) {
    return null;
  }

  const handleSaveProgress = async () => {
    if (user && user.id && id) {
      const userRef = ref(db, `workouts/${id}/${user.id}/progress/`);

      const exercisesData = workoutData.exercises.map((exercise: Exercise) => {
        const exerciseName = exercise.name;
        const exerciseQuantity = exerciseQuantities[exerciseName];
        const isDone = exerciseQuantity >= exercise.quantity;
        return {
          done: isDone,
          made: exerciseQuantity || 0,
          name: `${exerciseName} (${exercise.quantity} повторений)`,
          quantity: exercise.quantity,
        };
      });
      try {
        await update(userRef, {
          exercises: exercisesData,
        });
        fetchWorkoutData();
      } catch (error) {
        console.error("Ошибка при сохранении прогресса:", error);
      }
    }

    setProgressModal(false);
    dispatch(openModal("Ваш прогресс засчитан"));
    setTimeout(() => {
      dispatch(closeModal());
    }, 1500);
  };

  const calculateProgressPercentage = (made: number, quantity: number) => {
    return (made / quantity) * 100;
  };

  const updateExerciseQuantity = (exerciseName: string, quantity: number) => {
    setExerciseQuantities((prevQuantities: any) => ({
      ...prevQuantities,
      [exerciseName]: quantity,
    }));
  };

  return (
    <>
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
          {workoutData && (
            <ul className="flex flex-row flex-wrap gap-y-5 gap-x-[60px] mb-10">
              {workoutData.exercises.map((exItem: Exercise, index: number) => {
                const userProgress = workoutData[userId]?.progress;
                const progressItem = userProgress?.exercises[index];

                return (
                  <li key={index} className="w-[320px]">
                    <div className="">
                      {exItem.name} ({exItem.quantity} повторений)
                    </div>
                    <div className="w-[320px] h-[6px] bg-[#f7f7f7] mt-2.5 relative">
                      <div
                        className="h-[6px] bg-[#00c1ff] rounded-[50px]"
                        style={{
                          width: `${calculateProgressPercentage(
                            progressItem?.made || 0,
                            exItem.quantity
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <button
            onClick={() => setProgressModal(true)}
            className="text-lg leading-110 rounded-[46px] px-[26px] py-4 bg-custom-lime hover:bg-[#c6ff00] active:bg-black active:text-white transition-colors duration-300 ease-in-out"
          >
            Обновить свой прогресс
          </button>
        </div>
      </div>
      {progressModal && (
        <ProgressSave
          exercises={workoutData?.exercises || []}
          exerciseQuantities={exerciseQuantities}
          onClose={() => setProgressModal(false)}
          onSaveProgress={handleSaveProgress}
          onUpdateExerciseQuantity={updateExerciseQuantity}
        />
      )}
    </>
  );
}
