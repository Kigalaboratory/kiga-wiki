import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
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
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/assets/css/main.css" />
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
