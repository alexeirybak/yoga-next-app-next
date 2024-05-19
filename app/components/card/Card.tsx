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
import { useState } from "react";
import { useAuth } from "@/app/hooks/use-auth";
import "../../globals.css";

export type CardData = {
  _id: string;
  name: string;
};

type CardProps = {
  cardData: CardData;
  isSubscribed?: boolean;
  onCourseDeleted: (courseId: string) => void;
};

export const Card: React.FC<CardProps> = ({
  cardData,
  isSubscribed,
  onCourseDeleted,
}) => {
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
      const message = await handleUnsubscribe(
        unsubscribeEvent,
        cardData,
        onCourseDeleted
      );
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
          <button>
            <Image
              src={`/smallImg${cardData._id}.jpg`}
              alt={cardData.name}
              className="rounded-3xl mb-6"
              width={360}
              height={325}
              title="Перейти к описанию курса"
            />
          </button>
        ) : (
          <Link href={`/${cardData._id}`}>
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
          {isProfilePage && (
            <ProgressCard setProgressModal={setProgressModal} />
          )}
          {progressModal && <ProgressModal setProgressModal={setProgressModal}/>}
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
