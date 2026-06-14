import type { Metadata } from "next";
import "./globals.css";
import ProgressSync from '@/components/ProgressSync';

export const metadata: Metadata = {
  title: "Linguify - Learn Languages Playfully",
  description: "Learn English, Hebrew, Portuguese, Chinese, French, German, Spanish, and Greek with AI-powered lessons",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-gray-bg min-h-full antialiased overflow-hidden">
        <ProgressSync />
        {children}
      </body>
    </html>
  );
}
