import Image from "next/image";
import "../../globals.css";

interface ProgressModalProps {
  setProgressModal: (value: boolean) => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  setProgressModal,
}) => {
  const handleProgress = () => {
    setProgressModal(false);
  };
  return (
    <div className="modalOverlay ">
      <div className="modalContentProgress w-[460px]">
        <div className="relative">
          <button
            className="text-2xl w-5 absolute right-0"
            onClick={handleProgress}
          >
            &#10060;
          </button>
          <div className="text-[32px]">Выберите тренировку</div>
          <ul className="flex flex-row flex-wrap mb-[35px] gap-y-5 max-h-[360px] overflow-y-auto">
            <li className="flex flex-row gap-x-3 border-b-[1px] border-[#c4c4c4] pb-[10px] w-full">
              <Image
                src="/icon-check-train.svg"
                alt="Тренировка завершена"
                width={20}
                height={20}
              />
              <div className="flex flex-col">
                <div className="text-[24px] leading-110 my-2.5">
                  Утренняя практика
                </div>
                <div className="leading-110">Йога на каждый день / 1 день</div>
              </div>
            </li>
            <li className="flex flex-row gap-x-3 border-b-[1px] border-[#c4c4c4] pb-[10px] w-full">
              <Image
                src="/icon-check-train.svg"
                alt="Тренировка завершена"
                width={20}
                height={20}
              />
              <div className="flex flex-col">
                <div className="text-[24px] leading-110 my-2.5">
                  Красота и здоровье
                </div>
                <div className="leading-110">Йога на каждый день / 2 день</div>
              </div>
            </li>
            <li className="flex flex-row gap-x-3 border-b-[1px] border-[#c4c4c4] pb-[10px] w-full">
              <Image
                src="/icon-check-train.svg"
                alt="Тренировка завершена"
                width={20}
                height={20}
              />
              <div className="flex flex-col">
                <div className="text-[24px] leading-110 my-2.5">Асаны стоя</div>
                <div className="leading-110">Йога на каждый день / 3 день</div>
              </div>
            </li>
            <li className="flex flex-row gap-x-3 border-b-[1px] border-[#c4c4c4] pb-[10px] w-full">
              <Image
                src="/icon-check-train.svg"
                alt="Тренировка завершена"
                width={20}
                height={20}
              />
              <div className="flex flex-col">
                <div className="text-[24px] leading-110 my-2.5">
                  Растягиваем мышцы бедра
                </div>
                <div className="leading-110">Йога на каждый день / 4 день</div>
              </div>
            </li>
            <li className="flex flex-row gap-x-3 border-b-[1px] border-[#c4c4c4] pb-[10px] w-full">
              <Image
                src="/icon-check-train.svg"
                alt="Тренировка завершена"
                width={20}
                height={20}
              />
              <div className="flex flex-col">
                <div className="text-[24px] leading-110 my-2.5">
                  Гибкость спины
                </div>
                <div className="leading-110">Йога на каждый день / 5 день</div>
              </div>
            </li>
          </ul>
          <div className="flex justify-center">
            <button className=" text-lg bg-custom-lime hover:bg-[#c6ff00] active:bg-black active:text-white py-4 px-[26px] rounded-[46px] w-[283px] h-[52px] leading-110">
              Начать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
