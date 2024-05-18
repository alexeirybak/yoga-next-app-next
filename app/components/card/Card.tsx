import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { SubscribeButton } from "../subscribeBtn/SubscribeBtn";
import { UnsubscribeButton } from "../unsubscribedBtn/UnsubscribeBtn";
import { handleSubscribe } from "../connectDB/handleSubscribe";
import { handleUnsubscribe } from "../connectDB/handleUnsubscribe";
import { ModalConfirm } from "../modalConfirm/ModalConfirm";
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
  const isProfilePage = pathname.includes('/profile/');

  const dispatch = useDispatch();
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);
  const [unsubscribeEvent, setUnsubscribeEvent] = useState<React.MouseEvent<
    HTMLButtonElement,
    MouseEvent
  > | null>(null);
  const { isAuth } = useAuth();

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
      className={`flex flex-col h-[500px] relative bg-white rounded-3xl card`}
    >
      {isSubscribed ? (
        <UnsubscribeButton handleUnsubscribe={handleUnsubscribeClick} />
      ) : (
        <SubscribeButton handleSubscribe={handleSubscribeClick} />
      )}
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

      <div className="flex flex-col w-[300px] mx-auto">
        <div className="text-3xl mb-5">{cardData.name}</div>
        <div className="flex flex-row flex-wrap gap-6px">
          <div className="flex flex-row justify-start items-center p-[10px] h-[38px] rounded-3xl bg-stone-200 gap-x-11px">
            <Image
              src="/icon-days.svg"
              width={15}
              height={15}
              alt="Количество дней"
            />
            <div className="leading-110">25 дней</div>
          </div>
          <div className="flex flex-row justify-start items-center p-[10px] h-[38px] rounded-3xl bg-stone-200 gap-x-11px">
            <Image src="/icon-time.svg" width={15} height={15} alt="Время" />
            <div className="leading-110">20-50 мин/день</div>
          </div>
          <div className="flex flex-row justify-start items-center p-[10px] h-[38px] rounded-3xl bg-stone-200 gap-x-11px">
            <Image src="/icon-graf.svg" width={15} height={15} alt="Время" />
            <div className="leading-110">Сложность</div>
          </div>
        </div>
      </div>
      {isProfilePage && <ProgressCard />}
      {showUnsubscribeConfirm && (
        <ModalConfirm
          onConfirm={handleConfirmUnsubscribe}
          onCancel={handleCancelUnsubscribe}
        />
      )}
    </div>
  );
};
