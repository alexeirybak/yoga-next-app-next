"use client";

import { Roboto } from "next/font/google";
import { Header } from "./components/header/Header";
import { Provider } from "react-redux";
import { store } from "./store";
import { WorkoutContext } from "./context/workoutContext";
import { useState } from "react";
import "./firebase";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [courseByWorkout, setCourseByWorkout] = useState("");
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Provider store={store}>
          <Header />
          <WorkoutContext.Provider value={{ courseByWorkout, setCourseByWorkout }}>
            <main>{children}</main>
          </WorkoutContext.Provider>
        </Provider>
      </body>
    </html>
  );
}
