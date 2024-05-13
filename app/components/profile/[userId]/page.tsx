"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Image from "next/image";
import styles from "../../header/Header.module.css";

export default function UserProfile() {
  const user = useSelector((state: RootState) => state.user);

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
            <p>{user.email}</p>
            <p>{user.id}</p>
          </div>
          <div className="flex flex-row gap-x-2.5">
            <button className="bg-custom-lime py-4 px-[26px] rounded-[46px] w-[210px] h-[52px]">Изменить пароль</button>
            <button className="border-[1px] border-black py-4 px-[26px] rounded-[46px] w-[210px] h-[52px]">Выйти</button>
          </div>
        </div>
      </div>
    </>
  );
}
