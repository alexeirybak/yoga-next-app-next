"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { NewPassword } from "@/app/components/changePassword/ChangePassword";
import { removeUser, setUser } from "@/app/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { getSubscribedCourses } from "@/app/Api/getSubscribedCourses";
import {
  getAuth,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import Image from "next/image";
import { Card } from "@/app/components/card/Card";
import Link from "next/link";
import { useAuth } from "@/app/hooks/use-auth";
import QRCode from "qrcode.react";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { openModal } from "@/app/store/slices/modalSlice";
import ScrollToTopButton from "@/app/components/ScrollToTopButton";

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
  const [username, setUsername] = useState("");
  const [changeName, setChangeName] = useState(false);
  const router = useRouter();

  const handleOpenSaver = () => {
    setChangeName(!changeName);
    setUsername("");
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || "");
      } else {
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveUsername = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      try {
        await updateProfile(user, { displayName: username });
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(
          userDocRef,
          {
            displayName: username,
          },
          { merge: true }
        );
        dispatch(
          setUser({
            email: user.email,
            token: await user.getIdToken(),
            id: user.uid,
            username: username,
          })
        );
        dispatch(openModal("Имя успешно изменено"));
        setChangeName(false);
      } catch (error) {
        console.error("Ошибка при сохранении имени пользователя:", error);
        dispatch(openModal("Ошибка при сохранении имени пользователя"));
      }
    }
  };

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
    <div className="max-w-[1440px] px-[16px] lg:px-[140px] mb-10 md:mb-[200px]">
      <h1 className="text-[24px] md:text-[40px] font-semibold mb-6 md:mb-10 leading-110">
        Профиль
      </h1>
      <div className="modalContentProfile md:flex-row">
        <div className="mb-[30px]">
          {user && user.email && (
            <QRCode
              value={user.email}
              size={197}
              bgColor="#FFFFFF"
              fgColor="#22c55e"
              className="md:mr-[33px]"
            />
          )}
        </div>

        <div className="flex flex-col leading-110 gap-[30px]">
          <div className="text-[24px] md:text-[32px] font-medium">
            {user.username || "Имя"}
          </div>

          {changeName && (
            <>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите имя"
                className="outline-none w-full rounded-lg border-[1px] border-[#D0CECE] rounded-lg py-4 px-[26px] md:text-[18px] leading-110"
              />
              <div className="flex flex-col md:flex-row gap-2.5 items-center">
                <button
                  className="btnGreen py-4 px-[26px] rounded-[46px] w-[210px] h-[52px]"
                  onClick={handleSaveUsername}
                >
                  Сохранить имя
                </button>
                <button
                  className="btnGray py-4 px-[26px] rounded-[46px] w-[210px] h-[52px]"
                  onClick={handleOpenSaver}
                >
                  Отмена
                </button>
              </div>
            </>
          )}

          {!changeName && (
            <button
              className="btnGreen py-4 px-[26px] rounded-[46px] w-[210px] h-[52px]"
              onClick={handleOpenSaver}
            >
              Изменение имени
            </button>
          )}

          <div className="md:text-[18px] flex flex-col gap-y-2.5">
            {user ? `Почта: ${user.email}` : ""}
            <p>Пароль: *...*</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2.5 items-center">
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
      <h2 className="mt-6 md:mt-[60px] mb-6 md:mb-10 text-[24px] md:text-[40px] font-semibold leading-110">
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
            <p className="md:text-[18px]">
              Для этого перейдите на
              <Link href="/" className="text-blue-600 hover:text-blue-800 ml-2">
                главную страницу
              </Link>
            </p>
          </>
        )}
      </h2>
      <div
        className="cards"
      >
        {subscriptions.map((cardData) => (
          <Card key={cardData._id} cardData={cardData} isSubscribed={true} />
        ))}
      </div>

      {showChangePasswordForm && (
        <NewPassword setShowChangePasswordForm={setShowChangePasswordForm} />
      )}

      <ScrollToTopButton />
    </div>
  );
};

export default UserProfile;
