"use client";

import { getAuth, updatePassword, User } from "firebase/auth";
import { MouseEventHandler, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { removeUser } from "@/app/store/slices/userSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { validatePassword } from "@/app/services/validation";
import styles from "../../header/Header.module.css";

export default function UserProfile() {
  const dispatch = useDispatch();
  const userPro = useSelector((state: RootState) => state.user);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, []);

  const handleLogout = () => {
    dispatch(removeUser());
    router.push("/");
  };

  const handleChangePassword = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (!newPassword.trim()) {
      setError("Введите новый пароль");
      return;
    }

    if (!confirmNewPassword.trim()) {
      setError("Введите повтор пароля");
      return;
    }

    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmNewPassword = confirmNewPassword.trim();

    const newPasswordError = validatePassword(trimmedNewPassword);
    const confirmNewPasswordError = validatePassword(trimmedConfirmNewPassword);

    if (newPasswordError || confirmNewPasswordError) {
      setError(newPasswordError || confirmNewPasswordError);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setIsChanging(true);

    ChangePassword(event);
  };

  const ChangePassword: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();

    if (!user) {
      setError("Пользователь не найден. Попробуйте выйти и войти снова");
      setIsChanging(false);
      return;
    }

    try {
      await updatePassword(user, newPassword);
      setError("Пароль успешно изменен");
      setIsChanging(false);
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      setError((error as Error).message);
      setIsChanging(false);
    } finally {
      setTimeout(() => {
        setError(null);
        setShowChangePasswordForm(false);
      }, 2000);
    }
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
            <p>Логин: {userPro.email}</p>
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
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className="relative">
              <Image
                src="/logo.svg"
                alt="logo"
                width={220}
                height={35}
                className="mx-auto"
              />

              <div className="flex flex-col gap-y-2.5 mt-12 mb-[34px]">
                <div className="h-[30px]">
                  {error && (
                    <div className="text-[#db0030] text-center">{error}</div>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="Новый пароль"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="outline-none w-full rounded-lg h-[52px] border-[1px] border-[#D0CECE] rounded-lg py-4 px-[26px] text-lg leading-110"
                />
                <input
                  type="password"
                  placeholder="Подтвердите новый пароль"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="outline-none w-full rounded-lg h-[52px] border-[1px] border-[#D0CECE] rounded-lg py-4 px-[26px] text-lg leading-110"
                />
              </div>
              <div className="flex flex-col gap-y-2.5">
                <button
                  onClick={handleChangePassword}
                  disabled={isChanging}
                  className={`w-full h-[52px] py-4 px-[26px] text-lg leading-110 rounded-[46px] transition-colors duration-300 ease-in-out ${
                    isChanging
                      ? "bg-white text-[#999] border-[1px] border-[#999]"
                      : "bg-custom-lime hover:bg-[#c6ff00] active:bg-black text-black active:text-white"
                  }`}
                >
                  {isChanging ? "Меняем..." : "Изменить пароль"}
                </button>
                <button
                  onClick={() => setShowChangePasswordForm(false)}
                  className="w-full rounded-[46px] h-[52px] text-lg border-[1px] border-black leading-110 hover:bg-[#f7f7f7] active:bg-[#e9eced] transition-colors duration-300 ease-in-out"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
