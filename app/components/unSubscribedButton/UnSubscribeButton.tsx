import Image from "next/image";

type UnsubscribeButtonProps = {
    handleUnsubscribe: (event: React.MouseEvent<HTMLImageElement>) => Promise<void>;
};

export const UnSubscribeButton: React.FC<UnsubscribeButtonProps> = ({
  handleUnsubscribe,
}) => {
  return (
    <Image
      src="/icon-minus.svg"
      alt="Отписаться"
      width={27}
      height={27}
      onClick={handleUnsubscribe}
      className="absolute top-20px right-20px cursor-pointer"
      title="Отписаться от курса"
    />
  );
};