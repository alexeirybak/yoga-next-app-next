import Image from "next/image";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import styles from "../../Home.module.css";

type CardData = {
  _id: number;
  image: string;
  name: string;
};

type CardProps = {
  cardData: CardData;
};

export const Card: React.FC<CardProps> = ({ cardData }) => {
  const handleSubscribe = async () => {
    const auth = getAuth();
    const db = getDatabase();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        const courseId = cardData._id;

        // Явно указываем тип для объекта updates
        const updates: { [key: string]: boolean } = {};
        updates[`subscriptions/${courseId}`] = true;

        // Обновляем базу данных Firebase
        await update(ref(db, `users/${userId}`), updates);
      } else {
        alert("Нужна авторизация");
      }
    });
  };

  return (
    <div
      className={`flex flex-col h-[500px] relative bg-white rounded-3xl ${styles.card}`}
    >
      <Link href={`/${cardData._id}`} className="absolute top-20px right-20px">
        <Image
          src="/icon-plus.svg"
          alt="Добавить"
          width={27}
          height={27}
          onClick={handleSubscribe}
        />
      </Link>
      <Image
        src={`/${cardData.image}.jpg`}
        alt={cardData.name}
        className="rounded-3xl mb-6"
        width={360}
        height={325}
      />
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
