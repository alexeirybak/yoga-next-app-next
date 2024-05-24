"use client";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { validateEmail } from "@/app/services/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(true);

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
      setSuccessMessage("Проверьте вашу почту для сброса пароля");
      setError(null);
      setCancelOpen(false);
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
          <h1 className="text-center text-[24px] mb-10">
            Страница сброса пароля
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center"
          >
            <input
              name="email"
              value={email}
              onChange={handleEmail}
              placeholder="Логин"
              className="outline-none w-full rounded-lg border-[1px] border-[#D0CECE] rounded-lg py-4 px-[26px] text-lg leading-110"
            />
            <button
              disabled={!cancelOpen}
              className={`btnGreen rounded-[30px] px-[26px] py-4 my-5 text-center my-2.5 ${
                !cancelOpen ? "cursor-not-allowed btnGray" : "btnGreen"
              }`}
            >
              Сбросить пароль
            </button>
          </form>
          <div className="min-h-[30px] mb-5">
            {error && (
              <p className="mb-2 text-sm text-[#db0030] leading-110 text-center">
                {error}
              </p>
            )}
            {successMessage && (
              <div className="mb-2 text-sm text-green-500 leading-110 text-center">
                {successMessage}
              </div>
            )}
          </div>

          <button
            onClick={handleCancel}
            className="btnGray rounded-[30px] px-[26px] py-4 text-center mb-2.5 w-full"
          >
            {cancelOpen ? "Отмена" : "На главную"}
          </button>
        </div>
      </div>
    </div>
  );
}
