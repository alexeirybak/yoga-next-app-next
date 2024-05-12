"use client";

import Image from "next/image";
import Link from "next/link";
import { Login } from "@/app/components/login/SignIn";
import { Register } from "../register/SignUp";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import styles from "./Header.module.css";
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

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      dispatch(setUser(parsedUserData));
    }
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

  return (
    <header className="flex flex-row gap-y-5 justify-between px-[140px] mb-[60px] mt-12 mx-auto">
      <div className="flex flex-col gap-y-5">
        <Link href={`/`}>
          <Image src="/logo.svg" alt="logo" width={220} height={35} />
        </Link>
        <p className="text-black text-base leading-loose text-lg">
          Онлайн-тренировки для занятий дома
        </p>
      </div>
      <div>
        <button
          className="flex items-center justify-center min-w-32 h-14 p-4 rounded-full bg-custom-lime leading-110 text-center text-lg"
          onClick={handleLoginClick}
        >
          {user.email ? user.email : "Войти"}
        </button>
      </div>

      {isLoginOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <Login
              handleClose={handleCloseLogin}
              handleRegisterClick={handleRegisterClick}
            />
          </div>
        </div>
      )}

      {isRegisterOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <Register
              handleClose={handleCloseRegister}
              handleLoginClick={handleLoginClick}
            />
          </div>
        </div>
      )}
    </header>
  );
};
