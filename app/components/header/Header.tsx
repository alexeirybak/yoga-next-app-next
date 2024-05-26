"use client";
 
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Login } from "@/app/components/login/SignIn";
import { Register } from "../register/SignUp";
import { Popup } from "../popup/Popup";
import { TopMenu } from "../menu/Menu";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { closeModal } from "@/app/store/slices/modalSlice";
import { RootState } from "@/app/store";
import {
  openLogin,
  closeLogin,
  openRegister,
  closeRegister,
} from "@/app/store/slices/formSlice";
import { removeUser, setUser } from "@/app/store/slices/userSlice";
import { getFirestore, doc, getDoc } from "firebase/firestore";
 
export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { isLoginOpen, isRegisterOpen } = useSelector(
    (state: RootState) => state.form
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const modal = useSelector((state: RootState) => state.modal);
  const pathname = usePathname();
 
  const shouldHideParagraph =
    pathname.startsWith("/pages/profile/") ||
    pathname.startsWith("/pages/workouts/");
 
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const db = getFirestore();
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
 
            dispatch(
              setUser({
                email: user.email,
                token: await user.getIdToken(),
                id: user.uid,
                username: userData.displayName || "Имя пользователя",
              })
            );
          } else {
            dispatch(removeUser());
          }
        } catch (error) {
          console.error(
            "Ошибка при получении данных пользователя из Firestore:",
            error
          );
          dispatch(removeUser());
        }
      } else {
        dispatch(removeUser());
      }
    });
 
    return () => unsubscribe();
  }, [dispatch]);
 
  const handleLoginClick = () => {
    dispatch(openLogin());
  };
 
  const handleCloseLogin = () => {
    dispatch(closeLogin());
  };
 
  const handleRegisterClick = () => {
    dispatch(openRegister());
  };
 
  const handleCloseRegister = () => {
    dispatch(closeRegister());
  };
 
  useEffect(() => {
    if (modal.isOpen) {
      setTimeout(() => {
        dispatch(closeModal());
      }, 3000);
    }
  }, [modal.isOpen, dispatch]);
 
  return (
    <header className="max-w-[1440px] flex flex-row gap-y-5 justify-between align-center px-[16px] lg:px-[140px] mb-[40px] md:mb-[60px] pt-12 mx-auto">
      <div className="flex flex-col gap-y-5">
        <Link href={`/`}>
          <Image src="/logo.png" alt="logo" width={220} height={35} />
        </Link>
        {!shouldHideParagraph && (
          <p className="text-black text-base leading-loose md:text-[18px] hidden md:block">
            Онлайн-тренировки для занятий дома
          </p>
        )}
      </div>
      {user.email ? (
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-row items-center"
          >
            <Image
              src="/icon-avatar.svg"
              alt="Аватар"
              width={41}
              height={41}
              className="mr-5"
            />
            <div className="flex justify-center text-center md:text-[18px] leading-110 hidden md:block">
              {user.username || user.email}
            </div>
            <Image
              src="/icon-arrow-to-bottom.svg"
              alt="Открыть меню"
              width={15}
              height={15}
              className="ml-3"
              style={{
                transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.8s ease",
              }}
            />
          </button>
          {isMenuOpen && (
            <TopMenu
              userEmail={user.email}
              userName={user.username}
              setIsOpenMenu={setIsMenuOpen}
            />
          )}
        </div>
      ) : (
        <button
          className="btnGreen flex flex-row justify-center items-center w-[83px] h-[36px] md:w-[103px] md:h-[52px] rounded-full p-4"
          onClick={handleLoginClick}
        >
          Войти
        </button>
      )}
 
      {isLoginOpen && (
        <Login
          handleClose={handleCloseLogin}
          handleRegisterClick={handleRegisterClick}
        />
      )}
 
      {isRegisterOpen && (
        <Register
          handleClose={handleCloseRegister}
          handleLoginClick={handleLoginClick}
        />
      )}
      {modal.isOpen && <Popup message={modal.message} />}
    </header>
  );
};
