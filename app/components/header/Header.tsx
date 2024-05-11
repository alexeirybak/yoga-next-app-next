import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex flex-row gap-y-5 justify-between px-[140px] mb-[60px] mt-12 mx-auto">
      <div className="flex flex-col gap-y-5">
        <Link href={`/`}>
          <Image src="/logo.svg" alt="logo" width={220} height={35} />
        </Link>
        <p className="text-black text-base leading-loose text-lg">
          Онлайн-тренировки для занятий дома
        </p>
      </div>
      <button className="flex items-center justify-center w-32 h-14 p-4 rounded-full bg-custom-lime leading-110 text-center text-lg">
        Войти
      </button>
    </header>
  );
};
