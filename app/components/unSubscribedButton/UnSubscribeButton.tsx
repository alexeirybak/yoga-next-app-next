import Image from "next/image";

type UnsubscribeButtonProps = {
  handleUnsubscribe: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

export const UnSubscribeButton: React.FC<UnsubscribeButtonProps> = ({
  handleUnsubscribe,
}) => {
  return (
    <button
      className="absolute top-[20px] right-[20px] flex items-center justify-center text-lg"
      onClick={handleUnsubscribe}
    >
      <Image
        src="/icon-minus.svg"
        alt="Отписаться"
        width={27}
        height={27}
        title="Отписаться от курса"
      />
    </button>
  );
};
