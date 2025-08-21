import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/Component/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ExpenseProvider } from "./contexts/ExpenseContext";
import Footer from "@/Component/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExpenseTracker AI",
  description: "ExpenseTracker AI",
  icons: {
    icon: "/expense.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        style={{ background: 'var(--background)', color: 'var(--foreground)' }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ExpenseProvider>
            <Navbar/>
            {children}
            <Footer/>
          </ExpenseProvider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
