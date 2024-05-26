import Image from "next/image";

type SubscribeButtonProps = {
  handleSubscribe: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({ handleSubscribe }) => {
  return (
    <button
      className="absolute top-[20px] right-[20px] flex items-center justify-center md:text-[18px] leading-110 cursor-pointer"
      onClick={handleSubscribe}
    >
      <Image
        src="/icon-plus.svg"
        alt="Добавить курс"
        width={27}
        height={27}
        title="Добавить курс"
      />
    </button>
  );
};