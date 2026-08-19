import type { Metadata } from "next";
import "./globals.css";

/** Required App Router root layout for every route outside [locale]. */
export const metadata: Metadata = {
  title: "DailySamachar",
  description: "Verified, independent news from India and around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-paper font-sans antialiased text-ink">
        {children}
      </body>
    </html>
  );
}
