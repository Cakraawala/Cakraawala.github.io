import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Portfolio Cakraawala",
  description: "Cakraawala's personal portfolio developer & designer",
  keywords: ["portfolio", "developer", "frontend", "fullstack"],
  openGraph: {
    title: "Cakraawala Portfolio",
    description: "Developer & Designer portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
