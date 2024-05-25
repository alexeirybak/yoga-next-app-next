import Image from "next/image";

export const CourseInfo = () => {
  return (
    <div className="flex flex-row flex-wrap gap-[6px] w-[300px]">
      <div className="flex flex-row p-[10px] h-[38px] rounded-3xl bg-stone-200 gap-x-11px">
        <Image
          src="/icon-days.svg"
          width={15}
          height={15}
          alt="Количество дней"
        />
        <div className="leading-110">25 дней</div>
      </div>
      <div className="flex flex-row justify-start items-center p-[10px] h-[38px] rounded-3xl bg-stone-200 gap-x-11px">
        <Image src="/icon-time.svg" width={15} height={15} alt="Время" />
        <div className="leading-110">20-50 мин/день</div>
      </div>
      <div className="flex flex-row justify-start items-center p-[10px] h-[38px] rounded-3xl bg-stone-200 gap-x-11px">
        <Image src="/icon-graf.svg" width={15} height={15} alt="Время" />
        <div className="leading-110">Сложность</div>
      </div>
      
    </div>
  );
};
