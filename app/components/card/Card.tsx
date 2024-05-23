"use client";

import Image from "next/image";
import Link from "next/link";
import { CourseInfo } from "../courseInfo/courseInfo";
import { usePathname } from "next/navigation";
import { SubscribeButton } from "../subscribeBtn/SubscribeBtn";
import { UnsubscribeButton } from "../unsubscribedBtn/UnsubscribeBtn";
import { handleSubscribe } from "../connectDB/handleSubscribe";
import { handleUnsubscribe } from "../connectDB/handleUnsubscribe";
import { ModalConfirm } from "../modalConfirm/ModalConfirm";
import { ProgressModal } from "../progressModal/progressModal";
import { ProgressCard } from "../progressCard/ProgressCard";
import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/app/store/slices/modalSlice";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/use-auth";
import { db } from "@/app/firebase";
import { ref, onValue } from "firebase/database";



export type CardData = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  name: string;
};

type CardProps = {
  cardData: CardData;
  isSubscribed?: boolean;
};

type WorkoutData = {
  _id: string;
  name: string;
};

export const Card: React.FC<CardProps> = ({ cardData, isSubscribed }) => {
  const pathname = usePathname();
  const isProfilePage = pathname.includes("/profile/");

  const dispatch = useDispatch();
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);
  const [unsubscribeEvent, setUnsubscribeEvent] = useState<React.MouseEvent<
    HTMLButtonElement,
    MouseEvent
  > | null>(null);
  const { isAuth } = useAuth();
  const [progressModal, setProgressModal] = useState(false);
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState<number | null>(null);

  useEffect(() => {
    const courseId = parseInt(cardData._id, 10) - 1;
    setCourseId(courseId);
    const courseRef = ref(db, `courses/${courseId}`);
    const getCoursesId = onValue(courseRef, (snapshot) => {
      const courseData = snapshot.val();
      setCourseName(courseData.name);
      if (courseData && courseData.workout) {
        const workouts: WorkoutData[] = [];
        for (const key in courseData.workout) {
          if (courseData.workout.hasOwnProperty(key)) {
            workouts.push({ _id: key, name: courseData.workout[key] });
          }
        }
        setWorkouts(workouts);
      } else {
        setWorkouts([]);
      }
    });

    return () => {
      getCoursesId();
    };
  }, [cardData._id]);

  const handleSubscribeClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!isAuth) {
      dispatch(openModal("Нужна авторизация"));
      return;
    }
    await handleSubscribe(event, cardData);
    dispatch(openModal("Вы успешно подписались"));
    setTimeout(() => {
      dispatch(closeModal());
    }, 1500);
  };

  const handleUnsubscribeClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setUnsubscribeEvent(event);
    setShowUnsubscribeConfirm(true);
  };

  const handleConfirmUnsubscribe = async () => {
    if (unsubscribeEvent) {
      const message = await handleUnsubscribe(unsubscribeEvent, cardData);
      if (message) {
        dispatch(openModal(message));
        setTimeout(() => {
          dispatch(closeModal());
        }, 1500);
      }
    }
    setShowUnsubscribeConfirm(false);
  };

  const handleCancelUnsubscribe = () => {
    setShowUnsubscribeConfirm(false);
  };

  return (
    <div
      className={`flex flex-col relative bg-white rounded-3xl card pb-[15px]`}
    >
      {isSubscribed ? (
        <UnsubscribeButton handleUnsubscribe={handleUnsubscribeClick} />
      ) : (
        <SubscribeButton handleSubscribe={handleSubscribeClick} />
      )}
      <div>
        {isProfilePage ? (
          <Image
            src={`/smallImg${cardData._id}.jpg`}
            alt={cardData.name}
            className="rounded-3xl mb-6"
            width={360}
            height={325}
            title={cardData.name}
          />
        ) : (
          <Link href={`/pages/courseDescription/${cardData._id}`}>
            <Image
              src={`/smallImg${cardData._id}.jpg`}
              alt={cardData.name}
              className="rounded-3xl mb-6"
              width={360}
              height={325}
              title="Перейти к описанию курса"
            />
          </Link>
        )}

        <div className="flex flex-col mx-auto px-[30px]">
          <div className="text-3xl mb-5">{cardData.name}</div>
          <CourseInfo />
          {isProfilePage && courseId !== null && (
            <ProgressCard
              setProgressModal={setProgressModal}
              courseName={courseName}
              courseId={courseId}
            />
          )}
          {progressModal && (
            <ProgressModal
              setProgressModal={setProgressModal}
              workouts={workouts}
              courseId={courseId}
            />
          )}
        </div>
      </div>

      {showUnsubscribeConfirm && (
        <ModalConfirm
          onConfirm={handleConfirmUnsubscribe}
          onCancel={handleCancelUnsubscribe}
        />
      )}
    </div>
  );
};
