"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathName = usePathname();
  const pageTitle = (pathName.split("/").pop() || "").replace(/^\w/, (c) =>
    c.toUpperCase()
  );

  const bgPath = () => {
    if (pathName.startsWith("/")) {
      return "bg_lifelink";
    } else if (
      ["admin", "user", "login", "register", "forgot"].some((keyword) =>
        pathName.includes(keyword)
      )
    ) {
      return "";
    }
  };

  useEffect(() => {
    document.title = pageTitle || "Home";
  }, [pageTitle]);

  return (
    <html lang="en">
      <body className={bgPath()}>{children}</body>
    </html>
  );
}
