"use client";

import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { NewPassword } from "@/app/components/changePassword/ChangePassword";
import { removeUser } from "@/app/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { getSubscribedCourses } from "@/app/Api/getSubscribedCourses";
import { getAuth, signOut } from "firebase/auth";
import Image from "next/image";
import { Card } from "@/app/components/card/Card";
import Link from "next/link";
import { useAuth } from "@/app/hooks/use-auth";
import styles from "./../../../components/header/Header.module.css";

type CardData = {
  _id: string;
  name: string;
  description: string;
  title: string;
  imageUrl: string;
};

const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuth } = useAuth();
  const user = useSelector((state: RootState) => state.user);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [subscriptions, setSubscriptions] = useState<CardData[]>([]);
  const router = useRouter();

  const handleCourseDeleted = useCallback((courseId: string) => {
    setSubscriptions((prevSubscriptions) =>
      prevSubscriptions.filter((subscription) => subscription._id !== courseId)
    );
  }, []);

  useEffect(() => {
    if (!isAuth) {
      router.push("/");
    }
  }, [isAuth, router]);

  useEffect(() => {
    const fetchSubscribedCourses = async () => {
      try {
        if (user && user.id) {
          const data = await getSubscribedCourses(user.id);
          const courseData: CardData[] = data
            .filter((course: number) => course !== null)
            .map((course: { courseId: number; name: string }) => ({
              _id: course.courseId,
              name: course.name,
            }));
          setSubscriptions(courseData);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchSubscribedCourses();
  }, [user]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      dispatch(removeUser());
      router.push("/");
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
    }
  };

  return (
    <div className="mb-[200px]">
      <h1 className="text-[40px] font-semibold mb-10 leading-110">Профиль</h1>
      <div className={`${styles.modalContentProfile}`}>
        <Image
          src="/icon-profile.svg"
          width={197}
          height={197}
          alt="Аватар профиль"
          className="pr-[33px]"
        />
        <div className="flex flex-col text-lg leading-110 gap-y-[30px]">
          <div className="text-[32px] font-medium">Имя</div>
          <div className="flex flex-col gap-y-2.5">
            {user ? `Почта: ${user.email}` : ""}
            <p>Профиль: *...*</p>
          </div>
          <div className="flex flex-row gap-x-2.5">
            <button
              onClick={() => setShowChangePasswordForm(true)}
              className="btnGreen py-4 px-[26px] rounded-[46px] w-[210px] h-[52px]"
            >
              Изменить пароль
            </button>
            <button
              onClick={handleLogout}
              className="btnGray py-4 px-[26px] rounded-[46px] w-[210px] h-[52px]"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
      <h2 className="mt-[60px] mb-10 text-[40px] font-semibold leading-110">
        {subscriptions.length > 0 ? (
          "Мои курсы"
        ) : (
          <>
            <p>
              Нет подписок на курсы. Добавьте курс:{" "}
              <Image
                src="/addCourse.jpg"
                width={197}
                height={90}
                alt="Как добавить курс"
                className="m-10"
              />
            </p>
            <p className="text-lg">
              Для этого перейдите на
              <Link href="/" className="text-blue-600 hover:text-blue-800 ml-2">
                главную страницу
              </Link>
            </p>
          </>
        )}
      </h2>
      <div className={`flex flex-wrap justify-left gap-10 mx-auto cards`}>
        {subscriptions.map((cardData) => (
          <Card
            key={cardData._id}
            cardData={cardData}
            isSubscribed={true}
          />
        ))}
      </div>

      {showChangePasswordForm && (
        <NewPassword setShowChangePasswordForm={setShowChangePasswordForm} />
      )}
    </div>
  );
};

export default UserProfile;
