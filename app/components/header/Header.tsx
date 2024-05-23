"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Login } from "@/app/components/login/SignIn";
import { Register } from "../register/SignUp";
import { PopUp } from "../popup/Popup";
import { TopMenu } from "../menu/Menu";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "@/app/store/slices/modalSlice";
import { RootState } from "@/app/store";
import {
  openLogin,
  closeLogin,
  openRegister,
  closeRegister,
} from "@/app/store/slices/formSlice";

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { isLoginOpen, isRegisterOpen } = useSelector(
    (state: RootState) => state.form
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const modal = useSelector((state: RootState) => state.modal);
  const pathname = usePathname();

  const shouldHideParagraph = pathname.startsWith('/pages/profile/') || pathname.startsWith('/pages/workouts/');

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
      }, 1500);
    }
  }, [modal.isOpen, dispatch]);

  return (
    <header className="flex flex-row gap-y-5 justify-between px-[140px] mb-[60px] pt-12 mx-auto">
      <div className="flex flex-col gap-y-5">
        <Link href={`/`}>
          <Image src="/logo.svg" alt="logo" width={220} height={35} />
        </Link>
        {!shouldHideParagraph && (
          <p className="text-black text-base leading-loose text-lg">
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
            <div className="flex justify-center text-center text-lg leading-110">
              {user.email}
            </div>
            <Image
              src="/icon-arrow-to-bottom.svg"
              alt="Открыть меню"
              width={15}
              height={15}
              className="ml-3"
              style={{
                transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.8s ease'
              }}
            />
          </button>
          {isMenuOpen && (
            <TopMenu userEmail={user.email} setIsOpenMenu={setIsMenuOpen} />
          )}
        </div>
      ) : (
        <button
          className="btnGreen flex flex-row justify-center items-center min-w-32 h-14 rounded-full p-4"
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
      {modal.isOpen && <PopUp message={modal.message} />}
    </header>
  );
};
