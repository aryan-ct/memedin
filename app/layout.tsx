import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { Rubik_Bubbles } from "next/font/google";

const rubik = Rubik_Bubbles({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memedin - Fun Meme Creator",
  description: "Create fun memes with your team!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="{rubik.className}">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
