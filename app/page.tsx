import React from "react";
import Image from "next/image";
import Card from "./components/card/Card";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { Metadata } from "next";
import { getCoursesData } from "./services/Api/getCoursesData";
import styles from "./Home.module.css";

export const metadata: Metadata = {
  title: "Фитнес-курсы",
  description: "5 видов курсов для людей всех возрастов",
};

export default async function Home() {
  const courses = await getCoursesData();

  if (courses == null || courses.length === 0) {
    return (
      <Image
        src="/loading-animation.gif"
        width={100}
        height={100}
        alt="Загрузка"
        className="mx-auto m-10"
      />
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto ">
      <div className="flex flex-row justify-between gap-x-5">
        <div className="text-5xl font-bold max-w-[860px] mb-[50px]">
          Начните заниматься спортом и улучшите качество своей жизни
        </div>
        <div className="relative ">
          <div className="hidden lg:block bg-custom-lime px-5 py-4 text-3xl w-[288px]">
            Измени свое тело за полгода!
          </div>
          <Image
            src="/triangle.png"
            width={30}
            height={35}
            alt="Треугольник"
            className="hidden lg:block absolute right-[142px] top-[90px]"
          />
        </div>
      </div>

      <div>
        <div
          className={`flex flex-wrap gap-x-4 gap-y-10 justify-between mx-auto ${styles.cards}`}
        >
          {courses &&
            courses.map(
              (cardData: any) =>
                cardData && <Card key={cardData._id} cardData={cardData} />
            )}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
