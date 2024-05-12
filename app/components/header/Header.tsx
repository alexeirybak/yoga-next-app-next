"use client";

import Image from "next/image";
import Link from "next/link";
import { Login } from "@/app/components/login/SignIn";
import { Register } from "../register/SignUp";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import styles from "./Header.module.css";
import { setUser } from "@/app/store/slices/userSlice";

export const Header = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      dispatch(setUser(parsedUserData));
    }
  }, [dispatch]);

  const handleLoginClick = () => {
    setShowLoginForm(true);
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
      <button
        className="flex items-center justify-center min-w-32 h-14 p-4 rounded-full bg-custom-lime leading-110 text-center text-lg"
        onClick={handleLoginClick}
      >
        {user.email ? user.email : "Войти"}
      </button>
      {showLoginForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <Login
              setShowLoginForm={setShowLoginForm}
              setShowRegisterForm={setShowRegisterForm}
            />
          </div>
        </div>
      )}
      {showRegisterForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <Register
              setShowRegisterForm={setShowRegisterForm}
              setShowLoginForm={setShowLoginForm}
            />
          </div>
        </div>
      )}
    </header>
  );
};
