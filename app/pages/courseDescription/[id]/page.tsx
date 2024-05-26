import Image from "next/image";
import { EnterButtonFromCourses } from "@/app/components/enterButtonFromCourses/EnterFromCourses";
import { getDescriptionByCourse } from "@/app/Api/getDescriptionByCourse";
import { Metadata } from "next";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata | { notFound: true }> {
  const parsedId = parseInt(id, 10) - 1;
  const courseDescriptionData = await getDescriptionByCourse(parsedId);

  if (parsedId > 5) {
    return { notFound: true };
  }

  const courseData = courseDescriptionData;

  if (!courseData) {
    return {
      title: "Курс не найден",
      description: "Запрашиваемый курс не существует или временно недоступен.",
    };
  }

  return {
    title: courseData.name,
    description: courseData.description.join(" "),
  };
}

export default async function CourseDescription({ params: { id } }: Props) {
  const parsedId = parseInt(id, 10) - 1;

  if (parsedId > 4) {
    return <p>Запрашиваемый курс не существует или временно недоступен.</p>;
  }

  const courseData = await getDescriptionByCourse(parsedId);

  if (courseData === null) {
    return null;
  }

  return (
    <div className="max-w-[1440px] px-[16px] md:px-[140px]">
      <h1
        className="h-[310px] mx-auto pl-[40px] pt-[40px] mb-[40px] md:mb-[60px] rounded-3xl text-6xl text-white bgTitle"
        style={{
          backgroundImage: `url(./../../largeImg${courseData._id}.jpg)`,
        }}
      >
        <p className="hidden md:block">{courseData.name}</p>
      </h1>
      <div>
        <p className="text-[24px] md:text-[40px] font-semibold text-left mb-6 md:mb-[40px] leading-110">
          Подойдет для вас, если:
        </p>
        <ul className="flex flex-row flex-wrap xl:flex-nowrap gap-[17px] text-2xl text-white mb-[40px] md:mb-[60px]">
          {courseData?.reasons.map((reason: string, index: number) => (
            <li
              key={index}
              className="p-[20px] rounded-[28px] flex flex-row flex-nowrap gap-x-6 items-center w-full bgReasons"
            >
              <p className="py-[20px] text-[75px] text-custom-lime">
                {index + 1}
              </p>
              <p>{reason}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-[24px] md:text-[40px] mb-10 font-semibold text-left mb-6 md:mb-[40px] leading-110">
          Направления
        </div>
        <div className="p-[30px] grid grid-col-1 xl:grid-cols-3 bg-custom-lime rounded-[28px] text-[18px] md:text-2xl gap-y-[30px] md:gap-y-[34px] xl:mb-[102px]">
          {courseData.directions.map((direction: string, indexDir: number) => (
            <ul key={indexDir} className="flex gap-x-1">
              <li className="flex flex-row gap-x-2 items-center">
                <Image
                  src="/icon-sparcle.svg"
                  width={26}
                  height={26}
                  alt="Пункт"
                />
                <div>{direction}</div>
              </li>
            </ul>
          ))}
        </div>
      </div>
      <div className="block xl:hidden relative bgLineTop w-[334px] h-[347px] right-0 bottom-0 overflow-hidden mx-auto -mt-[60px] -mb-[120px] z-10">
          <div className="bgMan absolute w-full h-full right-0 bottom-0 overflow-hidden"></div>
        </div>
      <div className="relative path rounded-[30px] p-[30px] md:p-10 z-10 bg-white">
        <div className="flex flex-col justify-between max-w-[437px] z-10">
          <div className="mb-[28px]">
            <div className="text-[32px] md:text-5xl font-bold mb-7 leading-110">
              Начните путь к новому телу
            </div>
            <ul className="list-disc pl-5 text-[18px] md:text-2xl leading-110">
              {courseData.description.map(
                (benefit: string, indexBen: number) => (
                  <li key={indexBen}>{benefit}</li>
                )
              )}
            </ul>
          </div>
          <EnterButtonFromCourses
            courseId={courseData._id.toString()}
            courseName={courseData.name}
          />
        </div>
        <div className="hidden xl:block absolute bgLine w-[600px] h-[540px] right-0 bottom-0 -z-10">
          <div className="bgMan absolute w-full h-full right-0 bottom-0 -z-10"></div>
        </div>
      </div>
    </div>
  );
}
