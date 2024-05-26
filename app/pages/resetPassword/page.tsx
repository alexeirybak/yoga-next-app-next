"use client";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { validateEmail } from "@/app/services/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEmail = (event: { target: { value: string } }) => {
    const trimmedValue = event.target.value.trim();
    const errorMessage = validateEmail(trimmedValue);
    setEmail(trimmedValue);
    setError(errorMessage);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const emailVal = target.email.value.trim();
    const auth = getAuth();

    if (!emailVal.trim()) {
      setError("Введите логин");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, emailVal);
      setSuccessMessage(
        `Ссылка для востановления пароля отправлена на ${emailVal}`
      );
      setError(null);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      setError((error as Error).message);
      setSuccessMessage(null);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div>
      <div className="modalOverlay ">
        <div className="modalContentProgress w-[460px]">
          <div className="relative"></div>
          <Image
            src="/logo.png"
            alt="logo"
            width={220}
            height={35}
            className="mx-auto mb-[48px]"
          />
          
          {!successMessage && (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center"
            >
              <input
                name="email"
                value={email}
                onChange={handleEmail}
                placeholder="Введите почту"
                className="outline-none w-full rounded-lg border-[1px] border-[#D0CECE] rounded-lg py-4 px-[26px] text-[18px] leading-110"
              />
              <button className="btnGreen rounded-[30px] px-[26px] py-4 my-5 text-center my-2.5">
                Сбросить пароль
              </button>
            </form>
          )}

          <div className="min-h-[30px] mb-5">
            {error && (
              <p className="mb-2 text-sm text-[#db0030] leading-110 text-center">
                {error}
              </p>
            )}
            {successMessage && (
              <div className="text-[18px] leading-110 text-center">
                {successMessage}
              </div>
            )}
          </div>
          {!successMessage && (
            <button
              onClick={handleCancel}
              className="btnGray rounded-[30px] px-[26px] py-4 text-center mb-2.5 w-full"
            >
              Отмена
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
