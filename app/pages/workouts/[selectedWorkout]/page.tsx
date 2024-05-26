"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { db } from "@/app/firebase";
import { ref, onValue, update } from "firebase/database";
import { WorkoutContext } from "@/app/context/workoutContext";
import { openModal } from "@/app/store/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
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
  const courseId = useSelector((state: RootState) => state.course.courseId);
  const [hasProgress, setHasProgress] = useState(false);
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
  }, [id, user, fetchWorkoutData]);

  const checkProgress = useMemo(() => {
    return (dataWorkout: any) => {
      if (dataWorkout && dataWorkout[userId] && dataWorkout[userId].progress) {
        return dataWorkout[userId].progress.exercises.some(
          (exercise: any) => exercise.made > 0
        );
      }
      return false;
    };
  }, [userId]);

  useEffect(() => {
    if (workoutData && userId) {
      const hasMadeProgress = checkProgress(workoutData);
      setHasProgress(hasMadeProgress);
    }
  }, [workoutData, userId, checkProgress]);

  useEffect(() => {
    if (workoutData && userId) {
      const workoutRef = ref(db, `users/${userId}/progress/${courseId}/${id}`);
      const recordWorkout = onValue(workoutRef, (snapshot) => {
        const data = snapshot.val();
        const updatedWorkoutData = {
          ...workoutData,
          [userId]: { progress: data },
        };
        setWorkoutData(updatedWorkoutData);
      });

      return () => {
        recordWorkout();
      };
    }
  }, [userId, id, workoutData, courseId]);

  if (!workoutData) {
    return null;
  }

  const handleSaveProgress = async () => {
    if (user && user.id && id) {
      const userRef = ref(db, `users/${userId}/progress/${courseId}/${id}`);

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
        dispatch(openModal("Ошибка при сохранении прогресса:"));
      }
    }

    setProgressModal(false);
    dispatch(openModal("Ваш прогресс засчитан"));
  };

  const calculateProgressPercentage = (made: number, quantity: number) => {
    return (made / quantity) * 100;
  };

  const updateExerciseQuantity = (exerciseName: string, quantity: number) => {
    if (workoutData && workoutData.exercises) {
      const exercise = workoutData.exercises.find(
        (ex: Exercise) => ex.name === exerciseName
      );
      if (exercise) {
        const newQuantity = Math.min(quantity, exercise.quantity);
        setExerciseQuantities((prevQuantities: any) => ({
          ...prevQuantities,
          [exerciseName]: newQuantity,
        }));
      }
    }
  };

  return (
    <>
      <div className="max-w-[1440px] px-[16px] lg:px-[140px]">
        <h1 className="font-medium text-[24px] md:text-6xl mb-2.5 md:mb-6">{courseByWorkout}</h1>
        {workoutData.details && (
          <p className="text-[18px] md:text-[32px] mb-6 md:mb-10">{workoutData.details}</p>
        )}
        {workoutData.video && (
          <div className="mb-6 md:mb-10 flex justify-center">
            <iframe
              src={workoutData.video}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="screen rounded-[9px] md:rounded-[30px]"
            ></iframe>
          </div>
        )}
        <div className="w-full max-w-[1160px] bg-white modalContentProgress flex flex-col md:block">
          <h2 className="text-[32px] leading-110 mb-5">
            Упражнения тренировки “{workoutData.name}”
          </h2>
          {workoutData && (
            <ul className="flex flex-row flex-wrap gap-y-5 gap-x-[60px] mb-10 text-[18px] justify-center md:justify-between">
              {workoutData.exercises.map((exItem: Exercise, index: number) => {
                const userProgress = workoutData[userId]?.progress;
                const progressItem = userProgress?.exercises[index];

                return (
                  <li
                    key={index}
                    className="w-[320px] flex flex-col justify-between"
                  >
                    <div className="">
                      {exItem.name} ({exItem.quantity} повторений)
                    </div>
                    <div className="w-full h-[6px] bg-[#f7f7f7] mt-2.5 relative">
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
            className="btnGreen rounded-[46px] px-[26px] py-4 mx-auto"
          >
            {hasProgress ? "Обновить свой прогресс" : "Заполнить свой прогресс"}
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
