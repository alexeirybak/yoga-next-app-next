import Image from "next/image";

type PopUpProps = {
  message: string;
};

export const PopUp: React.FC<PopUpProps> = ({ message }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="relative">
          <p className="w-[343px] text-[32px] mx-auto text-center mb-10">
            {message}
          </p>
          <Image
            src="/icon-ok.svg"
            alt="Вы вошли"
            width={57}
            height={57}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
};
