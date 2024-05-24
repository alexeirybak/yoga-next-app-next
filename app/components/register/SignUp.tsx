"use client";

import Image from "next/image";
import { MouseEventHandler, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/userSlice";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { validateEmail, validatePassword } from "@/app/services/validation";
import { openModal, closeModal } from "@/app/store/slices/modalSlice";

type RegisterProps = {
  handleClose: () => void;
  handleLoginClick: () => void;
};

export const Register: React.FC<RegisterProps> = ({
  handleClose,
  handleLoginClick,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [passEqual, setPassEqual] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const dispatch = useDispatch();
  const auth = getAuth();

  const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isRegistering) return;

    if (!email.trim()) {
      setError("Введите логин");
      return;
    }
    if (!password.trim()) {
      setError("Введите пароль");
      return;
    }
    if (!repeatPassword.trim()) {
      setError("Повторите пароль");
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedRepeatPassword = repeatPassword.trim();

    const emailError = validateEmail(trimmedEmail);
    const passwordError = validatePassword(trimmedPassword);
    const repeatPasswordError = validatePassword(trimmedRepeatPassword);

    if (emailError || passwordError || repeatPasswordError) {
      setError(emailError || passwordError || repeatPasswordError);
      return;
    }

    if (trimmedPassword !== trimmedRepeatPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setEmail(trimmedEmail);
    setPassword(trimmedPassword);
    setRepeatPassword(trimmedRepeatPassword);
    setIsRegistering(true);
    createUser(event);
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

  const handleRepeatPassword = (event: { target: { value: string } }) => {
    const trimmedValue = event.target.value.trim();
    setRepeatPassword(trimmedValue);
    setPassEqual(password === trimmedValue);
  };

  const createUser: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    try {
      if (password !== repeatPassword) {
        setError("Пароли не совпадают");
        return;
      }

      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await user.getIdToken(true);

      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: idToken,
        })
      );
      handleClose();
      setIsRegistering(false);

      dispatch(openModal("Вы успешно зарегистрировались"));
      setTimeout(() => {
        dispatch(closeModal());
      }, 1500);
    } catch (error) {
      const typedError = error as Error;
      if (typedError.message.includes("auth/email-already-in-use")) {
        setError("Данная почта уже используется. Попробуйте войти");
      } else {
        setError(typedError.message);
      }
      setIsRegistering(false);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent w-[360px]">
        <div className="relative">
          <button
            className="text-2xl pl-2.5 w-5 absolute right-0"
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

          <div className="flex flex-col gap-y-2.5 mt-12 mb-[10px]">
            <input
              type="email"
              placeholder="Логин"
              value={email}
              onChange={handleEmail}
              className="inputSign"
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={handlePassword}
              className="inputSign"
            />

            <input
              type="password"
              placeholder="Повторите пароль"
              value={repeatPassword}
              onChange={handleRepeatPassword}
              style={{ color: passEqual ? "green" : "#db0030" }}
              className="inputSign"            />
          </div>
          <div className="min-h-[30px] my-2 text-sm">
            {error && <p className="text-[#db0030] text-center leading-110">{error}</p>}

            {!passEqual && (
              <div className="text-[#db0030] text-center">
                Пароли пока не совпадают
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-2.5">
            <button
              onClick={handleSignUp}
              disabled={isRegistering}
              className={`w-full h-[52px] py-4 px-[26px] text-lg leading-110 rounded-[46px] transition-colors duration-300 ease-in-out ${
                isRegistering
                  ? "bg-white text-[#999] border-[1px] border-[#999]"
                  : "btnGreen"
              }`}
            >
              {isRegistering ? "Регистрируемся..." : "Зарегистрироваться"}
            </button>

            <button
              onClick={handleLoginClick}
              className="w-full rounded-[46px] h-[52px] btnGray"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
