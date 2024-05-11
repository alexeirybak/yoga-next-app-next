import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Header } from "./components/header/Header";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"] 
});

export const metadata: Metadata = {
  title: "Фитнес",
  description: "Как заняться спортом и улучшить качество своей жизни",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
