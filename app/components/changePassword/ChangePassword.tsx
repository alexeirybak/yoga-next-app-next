"use client";

import Image from "next/image";
import { MouseEventHandler, SetStateAction, useEffect, useState } from "react";
import { validatePassword } from "@/app/services/validation";
import { updatePassword, getAuth, User } from "firebase/auth";

type NewPasswordProps = {
  setShowChangePasswordForm: (value: SetStateAction<boolean>) => void;
};

export const NewPassword: React.FC<NewPasswordProps> = ({
  setShowChangePasswordForm,
}) => {
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, []);

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
    }
  };
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="relative">
          <button
            className="text-2xl w-5 absolute right-0"
            onClick={() => setShowChangePasswordForm(false)}
          >
            &#10060;
          </button>
          <Image
            src="/logo.svg"
            alt="logo"
            width={220}
            height={35}
            className="mx-auto"
          />

          <div className="flex flex-col gap-y-2.5 mt-12 mb-[34px]">
            <div className="h-[40px]">
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
              placeholder="Подтвердите пароль"
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
                  : "btnGreen"
              }`}
            >
              {isChanging ? "Меняем..." : "Изменить пароль"}
            </button>
            <button
              onClick={() => setShowChangePasswordForm(false)}
              className="w-full rounded-[46px] h-[52px] btnGray"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
