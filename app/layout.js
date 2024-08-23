import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs"; // Import ClerkProvider
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Study Stash",
  description: "Get AI generated Flashcards to study better",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Fredericka+the+Great&family=Great+Vibes&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={inter.className}>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
