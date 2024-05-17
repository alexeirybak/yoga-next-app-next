import Image from "next/image";
import { RootState } from "@/app/store";
import Link from "next/link";
import { useSelector } from "react-redux";
import { SubscribeButton } from "../subscribeButton/SubscribeButton";
import { UnSubscribeButton } from "../unSubscribedButton/UnSubscribeButton";
import { handleSubscribe } from "../connectDB/handleSubscribe";
import { handleUnsubscribe } from "../connectDB/handleUnsubscribe";
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
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  return (
    <div
      className={`flex flex-col h-[500px] relative bg-white rounded-3xl card`}
    >
      {isSubscribed ? (
        <UnSubscribeButton
          handleUnsubscribe={(event) =>
            handleUnsubscribe(event, isAuthenticated, cardData, onCourseDeleted)
          }
        />
      ) : (
        <SubscribeButton
          handleSubscribe={(event) =>
            handleSubscribe(event, isAuthenticated, cardData)
          }
        />
      )}
      <Link href={`/${cardData._id}`}>
        <Image
          src={`/smallImg${cardData._id}.jpg`}
          alt={cardData.name}
          className="rounded-3xl mb-6"
          width={360}
          height={325}
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
    </div>
  );
};
