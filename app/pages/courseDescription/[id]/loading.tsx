import Image from "next/image";

export default function Loading() {
  return (
    <Image
      src="/loading-animation.gif"
      width={100}
      height={100}
      alt="Загрузка"
      className="mx-auto m-10"
    />
  );
}
