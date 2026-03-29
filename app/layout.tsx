import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "./components/TopBar"
import BottomNav from "./components/BottomNav"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FieldWork Pro",
  description: "Gestió de feines",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ca">
     <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

  <TopBar />

  <div style={{ paddingBottom: "80px" }}>
  {children}
</div>

  <BottomNav />

</body>
    </html>
  );
}