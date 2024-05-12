"use client";

import Image from "next/image";
import Link from "next/link";
import { LoginReg } from "@/app/login/LoginReg";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import styles from "./Header.module.css";

export const Header = () => {
  const [showLoginRegForm, setShowLoginRegForm] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  const handleLoginClick = () => {
    setShowLoginRegForm(true);
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
      {showLoginRegForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <LoginReg setShowLoginRegForm={setShowLoginRegForm}/>
          </div>
        </div>
      )}
    </header>
  );
};
