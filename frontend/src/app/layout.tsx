import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RayFlow - Contracts Management Dashboard",
  description: "Sleek and secure agreements workflow management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
