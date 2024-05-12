"use client";

import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

type LoginProps = {
  setShowLoginRegForm: (value: boolean) => void;
};

export const LoginReg = ({ setShowLoginRegForm }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const dispatch = useDispatch();
  const auth = getAuth();

  const SignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          id: user.uid,
          token: token,
        })
      );

      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: token,
        })
      );
      setShowLoginRegForm(false);
    } catch (error) {
      const typedError = error as Error;
      setError(typedError.message);
    }
  };

  const createUser = async () => {
    setIsRegistering(true);
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

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          id: user.uid,
          token: idToken,
        })
      );

      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: idToken,
        })
      );
      setShowLoginRegForm(false);
    } catch (error) {
      const typedError = error as Error;
      setError(typedError.message);
    }
  };

  return (
    <div className="relative">
      <button
        className="text-2xl w-5 absolute right-0"
        onClick={() => setShowLoginRegForm(false)}
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
      {error}
      <div className="flex flex-col gap-y-2.5 mt-12 mb-[34px]">
        <input
          type="email"
          placeholder="Логин"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="outline-none w-full rounded-lg h-[52px] border-[1px] border-[#D0CECE] rounded-lg py-4 px-[26px] text-lg leading-110"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="outline-none w-full rounded-lg h-[52px] border-[1px] border-[#D0CECE] rounded-lg py-4 px-[26px] text-lg leading-110"
        />
        {isRegistering && (
          <input
            type="password"
            placeholder="Повторите пароль"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="outline-none w-full rounded-lg h-[52px] border-[1px] border-[#D0CECE] rounded-lg py-4 px-[26px] text-lg leading-110"
          />
        )}
      </div>
      <div className="flex flex-col gap-y-2.5">
        <button
          onClick={SignIn}
          className="w-full bg-custom-lime hover:bg-[#c6ff00] active:bg-black rounded-[46px] h-[52px] py-4 px-[26px] active:text-white text-lg leading-110 transition-colors duration-300 ease-in-out"
        >
          Войти
        </button>
        <button
          onClick={createUser}
          className="w-full rounded-[46px] h-[52px] text-lg border-[1px] border-black leading-110 hover:bg-[#f7f7f7] active:bg-[#e9eced] transition-colors duration-300 ease-in-out"
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
};
