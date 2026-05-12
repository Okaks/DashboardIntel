import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DashboardIntel",
  description: "Turn your dashboard into executive-ready narrative",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}