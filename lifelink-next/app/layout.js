"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathName = usePathname();
  const pageTitle =
    pathName.split("/")[1]?.replace(/^\w/, (c) => c.toUpperCase()) || "";

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
