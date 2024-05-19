"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { removeUser } from "@/app/store/slices/userSlice";
import { getAuth, signOut } from "firebase/auth";
import "../../globals.css";

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

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      dispatch(removeUser());
      setIsOpenMenu(false);
      router.push("/");
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
    }
  };

  return (
    <div className="modalContent absolute right-0 w-[266px] bg-white top-[45px] p-10 rounded-[30px] z-10 mx-auto flex flex-col aligng-center text-center text-lg">
      <p>Имя</p>
      <p className="mb-[34px] text-[#999]">{userEmail}</p>
      <div className="flex flex-col">
        <Link
          href={`/pages/profile/${userId}`}
          onClick={() => setIsOpenMenu(false)}
          className="bg-custom-lime hover:bg-[#c6ff00] active:bg-black active:text-white transition-colors duration-300 ease-in-out rounded-[30px] px-[26px] py-4 text-center mb-2.5"
        >
          Мой профиль
        </Link>
        <button
          onClick={handleLogout}
          className="rounded-[30px] px-[26px] py-4 border-[1px] border-black hover:bg-[#f7f7f7] active:bg-[#e9eced] transition-colors duration-300 ease-in-out"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};
