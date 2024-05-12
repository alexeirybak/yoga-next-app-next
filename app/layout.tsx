"use client"

import { Roboto } from "next/font/google";
import { Header } from "./components/header/Header";
import { Provider } from "react-redux";
import { store } from "./store";
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
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Provider store={store}>
          <Header />
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
