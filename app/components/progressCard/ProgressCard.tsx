export const ProgressCard = () => {
  return (
    <div className="mx-auto bg-white px-[30px] pb-[15px] pt-[40px] -mt-[40px] rounded-[30px] text-lg">
      <div className="leading-110 mt-5 mb-2.5">Прогресс 50%</div>
      <div className="w-[300px] h-[6px] bg-[#f7f7f7] mb-10">
        <div className="w-[150px] h-[6px] bg-[#00c1ff] rounded-[50px]"></div>
      </div>
      <button className="bg-custom-lime hover:bg-[#c6ff00] active:bg-black active:text-white py-4 px-[26px] rounded-[46px] w-[300px] h-[52px]">
        Продолжить
      </button>
    </div>
  );
};
