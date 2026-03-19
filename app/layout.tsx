import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "AnyMall 獣医師監修 愛犬・愛猫のためのウェルネスランチイベント申し込み受付中！",
  description:
    "愛犬との暮らしがもっと豊かになる、体験型イベント。食事・健康・ライフスタイルを、専門家と一緒に楽しく学びませんか。",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${notoSansJP.variable} ${notoSerifJP.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
