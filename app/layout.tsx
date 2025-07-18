import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// KaTeXのCSSは直接linkタグで読み込むため、ここでのimportは不要
// import "katex/dist/katex.min.css"; 
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kigalaboratory Wiki",
  description: "世界一すごいプロジェクトのWikiサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <Header />
        <div className="main-content">
          <Sidebar />
          <main className="content">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
