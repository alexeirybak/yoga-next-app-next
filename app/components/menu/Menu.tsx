"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { removeUser } from "@/app/store/slices/userSlice";
import styles from "../header/Header.module.css";

interface TopMenuProps {
  userEmail: string | null;
  setIsOpenMenu: (value: SetStateAction<boolean>) => void;
}

export const TopMenu: React.FC<TopMenuProps> = ({
  userEmail,
  setIsOpenMenu,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const userId = user.id || null;

  const handleLogout = () => {
    dispatch(removeUser());
    setIsOpenMenu(false);
    router.push('/');
  };

  return (
    <div
      className={`${styles.modalContent} absolute right-0 w-[266px] bg-white top-[45px] p-10 rounded-[30px] z-10 mx-auto flex flex-col aligng-center text-center text-lg `}
    >
      <p>Имя</p>
      <p className="mb-[34px] text-[#999]">{userEmail}</p>
      <div className="flex flex-col">
        <Link
          href={`/components/profile/${userId}`}
          onClick={() => setIsOpenMenu(false)}
          className="bg-custom-lime rounded-[30px] px-[26px] py-4 text-center mb-2.5"
        >
          Мой профиль
        </Link>
        <button
          onClick={handleLogout}
          className="rounded-[30px] px-[26px] py-4 border-[1px] border-black"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};
