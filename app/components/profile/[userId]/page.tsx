"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { NewPassword } from "../../changePassword/ChangePassword";
import { removeUser } from "@/app/store/slices/userSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../../header/Header.module.css";

export default function UserProfile() {
  const dispatch = useDispatch();
  const userPro = useSelector((state: RootState) => state.user);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    dispatch(removeUser());
    router.push("/");
  };

  return (
    <>
      <h1 className="font-semibold text-4xl mb-10">Профиль</h1>
      <div className={`${styles.modalContentProfile}`}>
        <Image
          src="/icon-profile.svg"
          width={197}
          height={197}
          alt="Аватар профиля"
          className="pr-[33px]"
        />
        <div className="flex flex-col text-lg leading-110 gap-y-[30px]">
          <div className="text-[32px] font-medium">Имя</div>
          <div className="flex flex-col gap-y-2.5">
            {userPro ? `Почта: ${userPro.email}` : ""}
            <p>Пароль: *...*</p>
          </div>
          <div className="flex flex-row gap-x-2.5">
            <button
              onClick={() => setShowChangePasswordForm(true)}
              className="bg-custom-lime py-4 px-[26px] rounded-[46px] w-[210px] h-[52px]"
            >
              Изменить пароль
            </button>
            <button
              onClick={handleLogout}
              className="border-[1px] border-black py-4 px-[26px] rounded-[46px] w-[210px] h-[52px]"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
      {showChangePasswordForm && (
        <NewPassword setShowChangePasswordForm={setShowChangePasswordForm} />
      )}
    </>
  );
}
