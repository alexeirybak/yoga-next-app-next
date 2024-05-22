"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "./components/card/Card";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { getCoursesData } from "./Api/getCourses";
import "./globals.css";

interface Course {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  name: string;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCoursesData();
        setCourses(coursesData);
      } catch (error) {
        console.error('Ошибка при получении данных о курсах:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto">
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
        <div className="flex flex-wrap gap-y-10 justify-between mx-auto cards">
          {courses.map((cardData) => (
            <Card
              key={cardData._id}
              cardData={cardData}
              isSubscribed={false}
              onCourseDeleted={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          ))}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}