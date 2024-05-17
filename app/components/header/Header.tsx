"use client";

import Image from "next/image";
import Link from "next/link";
import { Login } from "@/app/components/login/SignIn";
import { Register } from "../register/SignUp";
import { PopUp } from "../popUp/PopUp";
import { TopMenu } from "../menu/Menu";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { setUser } from "@/app/store/slices/userSlice";
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
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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

  return (
    <header className="flex flex-row gap-y-5 justify-between px-[140px] mb-[60px] pt-12 mx-auto">
      <div className="flex flex-col gap-y-5">
        <Link href={`/`}>
          <Image src="/logo.svg" alt="logo" width={220} height={35} />
        </Link>
        <p className="text-black text-base leading-loose text-lg">
          Онлайн-тренировки для занятий дома
        </p>
      </div>
      {user.email ? (
        <div className="relative">
          <button
            onClick={() => setIsOpenMenu(!isOpenMenu)}
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
            />
          </button>
          {isOpenMenu && (
            <TopMenu userEmail={user.email} setIsOpenMenu={setIsOpenMenu} />
          )}
        </div>
      ) : (
        <button
          className="flex flex-row justify-center text-center text-lg items-center min-w-32 h-14 rounded-full p-4 bg-custom-lime leading-110"
          onClick={handleLoginClick}
        >
          Войти
        </button>
      )}

      {isLoginOpen && (
        <Login
          handleClose={handleCloseLogin}
          handleRegisterClick={handleRegisterClick}
          setShowModal={setShowModal}
          setModalMessage={setModalMessage}
        />
      )}

      {isRegisterOpen && (
        <Register
          handleClose={handleCloseRegister}
          handleLoginClick={handleLoginClick}
          setShowModal={setShowModal}
          setModalMessage={setModalMessage}
        />
      )}
      {showModal && <PopUp message={modalMessage}/>}
    </header>
  );
};
