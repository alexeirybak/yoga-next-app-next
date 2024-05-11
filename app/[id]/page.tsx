import Image from "next/image";
import { Metadata } from "next";
import { getCoursesDataById } from "../services/Api/getCoursesData";
import styles from "./CourseDescription.module.css";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata | { notFound: true }> {
  const parsedId = parseInt(id, 10) - 1;
  const courseDescriptionData = await getCoursesDataById(parsedId);

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

  const courseDescriptionData = await getCoursesDataById(parsedId);
  const courseData = courseDescriptionData;

  return (
    <div>
      <h1
        className={`max-w-[1440px] h-[310px] mx-auto pl-[40px] pt-[40px] mb-[60px] rounded-3xl text-6xl text-white ${styles.bgTitle} }`}
        style={{ backgroundImage: `url(${courseData.image}-large.jpg)` }}
      >
        {courseData.name}
      </h1>
      <div>
        <p className="text-[40px] font-semibold leading-110 text-left mb-[40px]">
          Подойдет для вас, если:
        </p>
        <ul className="flex flex-row flex-nowrap gap-[17px] text-2xl text-white mb-[60px]">
          {courseData.reasons.map((reason: [], index: number) => (
            <li
              key={index}
              className={`p-5 rounded-[28px] flex flex-row flex-nowrap gap-x-6 items-center ${styles.bgReasons}`}
            >
              <p className="text-[75px] text-custom-lime">{index + 1}</p>
              <p>{reason}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-[40px] mb-10 font-semibold leading-110 text-left ">
          Направления
        </div>
        <div className="p-[30px] grid grid-cols-3 bg-custom-lime rounded-[28px] text-2xl gap-y-[34px] gap-x-[124px] mb-[102px]">
          {courseData.directions.map((direction: [], indexDir: number) => (
            <div key={indexDir} className="flex gap-x-1">
              <div className="flex flex-row ">
                <Image
                  src="/icon-sparcle.svg"
                  width={26}
                  height={26}
                  alt="Пункт"
                />
                <div>{direction}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`relative ${styles.path}`}>
        <div
          className={`absolute inset-0 ${styles.bgLine} bg-no-repeat bg-center bg-contain transform -rotate-9}`}
        ></div>
        <div className="relative p-10 rounded-[30px] flex flex-row justify-between">
          <div className="max-w-[437px] flex flex-col justify-between gap-y-[30px]">
            <div className="">
              <div className="text-5xl font-bold mb-7">
                Начните путь к новому телу
              </div>
              <ul className="list-disc pl-5 text-2xl">
                {courseData.description.map((benefit: [], indexBen: number) => (
                  <li key={indexBen}>{benefit}</li>
                ))}
              </ul>
            </div>

            <button className="bg-custom-lime h-14 rounded-[46px] flex items-center justify-center leading-110 text-lg">
              Войдите, чтобы добавить курс
            </button>
          </div>
          <Image
            src="/man.png"
            width={487}
            height={542}
            alt="Man"
            className="rotate-[-3deg]"
          />
        </div>
      </div>
    </div>
  );
}
