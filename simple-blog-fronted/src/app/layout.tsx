import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "我的 Next.js 博客",
  description: "由 Next.js 和 NestJS 构建",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <AuthProvider>
          <div className="bg-gray-50 min-h-screen">
            <Header />
            <main>{children}</main>
            <footer className="bg-white mt-12 py-6">
              <div className="container mx-auto text-center text-gray-500">
                &copy; {new Date().getFullYear()} 我的博客. 版权所有.
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
