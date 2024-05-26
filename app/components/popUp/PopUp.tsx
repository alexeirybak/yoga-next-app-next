import Image from "next/image";

type PopUpProps = {
  message: string;
};

export const Popup: React.FC<PopUpProps> = ({ message }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="relative">
          <p className="text-[24px] md:text-[32px] mx-auto text-center mb-10">
            {message}
          </p>
          <Image
            src="/icon-ok.svg"
            alt="Сообщение"
            width={57}
            height={57}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
};
