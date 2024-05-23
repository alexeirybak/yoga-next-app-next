"use client";

import Image from "next/image";
import { MouseEventHandler, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/userSlice";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { validateEmail, validatePassword } from "@/app/services/validation";
import { openModal, closeModal } from "@/app/store/slices/modalSlice";

type LoginProps = {
  handleClose: () => void;
  handleRegisterClick: () => void;
};

export const Login: React.FC<LoginProps> = ({
  handleClose,
  handleRegisterClick,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const dispatch = useDispatch();
  const auth = getAuth();

  const handleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isEntering) return;

    if (!email.trim()) {
      setError("Введите логин");
      return;
    }
    if (!password.trim()) {
      setError("Введите пароль");
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const emailError = validateEmail(trimmedEmail);
    const passwordError = validatePassword(trimmedPassword);

    if (emailError || passwordError) {
      setError(emailError || passwordError);
      return;
    }
    setIsEntering(true);
    signIn(event);
  };

  const handleEmail = (event: { target: { value: string } }) => {
    const trimmedValue = event.target.value.trim();
    const errorMessage = validateEmail(trimmedValue);
    setEmail(trimmedValue);
    setError(errorMessage);
  };

  const handlePassword = (event: { target: { value: string } }) => {
    const trimmedValue = event.target.value.trim();
    const errorMessage = validatePassword(trimmedValue);
    setPassword(trimmedValue);
    setError(errorMessage);
  };

  const signIn: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const token = await user.getIdToken();

      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: token,
        })
      );
      handleClose();
      setIsEntering(false);

      dispatch(openModal("Вы успешно вошли"));
      setTimeout(() => {
        dispatch(closeModal());
      }, 1500);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "message" in error
      ) {
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found" ||
          error.code === "auth/invalid-credential"
        ) {
          setError("Неправильная авторизация");
        } else {
          setError(String(error.message));
        }
      } else {
        setError("Произошла непредвиденная ошибка");
      }
      setIsEntering(false);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent w-[360px]">
        <div className="relative">
          <button
            className="text-2xl w-5 absolute right-0"
            onClick={handleClose}
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
            <div className="h-[30px]">
              {error && (
                <div className="text-[#db0030] text-center">{error}</div>
              )}
            </div>
            <input
              type="email"
              placeholder="Логин"
              value={email}
              onChange={handleEmail}
              className="inputSign"            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={handlePassword}
              className="inputSign"            />
          </div>
          <div className="flex flex-col gap-y-2.5">
            <button
              onClick={handleSignIn}
              disabled={isEntering}
              className={`w-full h-[52px] py-4 px-[26px] text-lg rounded-[46px] transition-colors duration-300 leading-110 ease-in-out ${
                isEntering
                  ? "bg-white text-[#999] border-[1px] border-[#999]"
                  : "btnGreen"
              }`}
            >
              {isEntering ? "Входим..." : "Войти"}
            </button>
            <button
              onClick={handleRegisterClick}
              className="w-full rounded-[46px] h-[52px] btnGray"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
