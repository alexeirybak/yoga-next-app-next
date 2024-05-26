"use client";

import { useContext, useEffect, useState } from "react";
import { WorkoutContext } from "@/app/context/workoutContext";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { getWorkoutsByCourse } from "@/app/Api/getWorkoutsByCourse";
import { getCommonMovies } from "@/app/Api/getCommonMovies";
import { getWorkoutProgress } from "@/app/Api/getWorkoutProgress";
import { useDispatch } from "react-redux";
import { setCourseId } from "@/app/store/slices/courseSlice";

interface ProgressCardProps {
  setProgressModal: (value: boolean) => void;
  courseName: string;
  courseId: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  setProgressModal,
  courseName,
  courseId,
}) => {
  const { setCourseByWorkout } = useContext(WorkoutContext);

  const handleProgress = () => {
    setProgressModal(true);
    setCourseByWorkout(courseName);
    dispatch(setCourseId(courseId));
  };

  const user = useSelector((state: RootState) => state.user);
  const userId = user.id || 0;
  const [workoutsList, setWorkoutsList] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalMade, setTotalMade] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWorkoutsList = async () => {
      try {
        const workoutsListData = await getWorkoutsByCourse(courseId);
        setWorkoutsList(workoutsListData);
      } catch (error) {
        console.error("Ошибка при получении списка тренировок курса:", error);
      }
    };

    fetchWorkoutsList();
  }, [courseId]);

  useEffect(() => {
    if (workoutsList !== null) {
    }
  }, [workoutsList]);

  useEffect(() => {
    const fetchWorkoutsData = async () => {
      try {
        if (workoutsList.length > 0) {
          const workoutsPromises = workoutsList.map((workout) =>
            getCommonMovies(workout)
          );

          const workoutsData = await Promise.all(workoutsPromises);

          let totalQuantity = 0;
          workoutsData.forEach((workout) => {
            if (workout && workout.exercises) {
              totalQuantity += workout.exercises.reduce(
                (sum: number, exercise: { quantity: number }) => {
                  return exercise.quantity > 0 ? sum + exercise.quantity : sum;
                },
                0
              );
            }
          });

          setTotalQuantity(totalQuantity);
        }
      } catch (error) {
        console.error("Ошибка при получении данных о тренировках:", error);
      }
    };

    if (Array.isArray(workoutsList) && workoutsList.length > 0) {
      fetchWorkoutsData();
    }
  }, [workoutsList]);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const progressData = await getWorkoutProgress(
          userId.toString(),
          courseId.toString()
        );
        let totalMade = 0;

        if (progressData && typeof progressData === "object") {
          for (const key in progressData) {
            if (
              progressData[key] &&
              progressData[key].exercises &&
              Array.isArray(progressData[key].exercises)
            ) {
              const exercises = progressData[key].exercises.filter(
                (exercise: string) => exercise !== null
              );
              totalMade += exercises.reduce(
                (
                  total: number,
                  exercise: { hasOwnProperty: (arg0: string) => any; made: any }
                ) => {
                  if (exercise && exercise.hasOwnProperty("made")) {
                    return total + exercise.made;
                  }
                  return total;
                },
                0
              );
            }
          }
        }

        setTotalMade(totalMade);
      } catch (error) {
        console.error("Ошибка при получении данных о тренировках:", error);
      }
    };

    if (userId && courseId !== null) {
      fetchProgressData();
    }
  }, [userId, courseId]);

  const calculatePercentage = (totalMade: number, totalQuantity: number) => {
    if (totalQuantity === 0) {
      return 0;
    }
    return Math.round((totalMade / totalQuantity) * 100);
  };

  let buttonText = "Продолжить";
  const progressPercentage = calculatePercentage(totalMade, totalQuantity);
  if (progressPercentage === 0) {
    buttonText = "Начать тренировки";
  } else if (progressPercentage === 100) {
    buttonText = "Начать заново";
  }

  return (
    <div className="mx-auto bg-white text-[18px]">
      <div className="leading-110 mt-5 mb-2.5">
        Прогресс {calculatePercentage(totalMade, totalQuantity)}%
      </div>
      <div className="w-[300px] h-[6px] bg-[#f7f7f7] mb-10">
        <div
          className="h-[6px] bg-[#00c1ff] rounded-[50px]"
          style={{
            width: `${calculatePercentage(totalMade, totalQuantity)}%`,
          }}
        ></div>
      </div>
      <button
        onClick={handleProgress}
        className="md:md:text-[18px] btnGreen py-4 px-[26px] rounded-[46px] w-[300px] h-[52px]"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ProgressCard;
