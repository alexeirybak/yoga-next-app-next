import Image from "next/image";

type SubscribeButtonProps = {
  handleSubscribe: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({ handleSubscribe }) => {
  return (
    <button
      className="absolute top-[20px] right-[20px] flex items-center justify-center leading-110 text-lg"
      onClick={handleSubscribe}
    >
      <Image
        src="/icon-plus.svg"
        alt="Добавить курс"
        width={27}
        height={27}
        className="cursor-pointer"
      />
    </button>
  );
};