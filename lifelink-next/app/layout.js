"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathName = usePathname();
  const segments = pathName.split("/");
  const pageTitle =
    segments[segments.length - 1]?.replace(/^\w/, (c) => c.toUpperCase()) || "";

  useEffect(() => {
    document.title =
      pageTitle === "" ? "Home" : pageTitle;
  }, [pageTitle]);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
