import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs"; // Import ClerkProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FlashCard Saas",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
        ></link>
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
