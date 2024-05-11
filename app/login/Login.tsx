import Image from "next/image";

export const Login = () => {
  return (
    <div>
      <Image
        src="/logo.svg"
        alt="logo"
        width={220}
        height={35}
        className="mx-auto"
      />
      <div className="flex flex-col gap-y-2.5 mt-12 mb-[34px]">
        <input
          type="text"
          placeholder="Логин"
          className="w-full rounded-lg h-[52px] border-[1px] border-[#D0CECE] rounded-lg py-4 px-[26px] text-lg leading-110"
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full rounded-lg h-[52px] border-[1px] border-[#D0CECE] rounded-lg py-4 px-[26px] text-lg leading-110"
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          className="w-full rounded-lg h-[52px] border-[1px] border-[#D0CECE] rounded-lg py-4 px-[26px] text-lg leading-110"
        />
      </div>
      <div className="flex flex-col gap-y-2.5">
        <button className="w-full bg-custom-lime rounded-[46px] h-[52px] py-4 px-[26px] text-lg leading-110">
          Войти
        </button>
        <button className="w-full rounded-[46px] h-[52px] text-lg border-[1px] border-black leading-110">
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
};
