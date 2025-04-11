import { setupAuthListener } from '@/app/Firebase/auth';
import StoreProvider from "./StoreProvider"; //Import the store provider
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthInitializer from './dashboard/components/AuthInitializer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "YCTCodePlay",
  description: "YctCodePlay Your E-learning Platform",
  icons: { icon: "/YCT CODEPLAY-logo 1.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          {children}
          <AuthInitializer />
        </StoreProvider>
      </body>
    </html>
  );
}
