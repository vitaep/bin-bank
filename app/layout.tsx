import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIN Bank",
  description: "Created by the Mettadata team",
  icons: {
    icon: "/logo-1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
