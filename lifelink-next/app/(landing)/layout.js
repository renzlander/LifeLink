"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import "../globals.css";
import NavbarIndex from "./components/NavBars";

export default function RootLayout({ children }) {
  const pathName = usePathname();
  const pageTitle =
    pathName.split("/")[1]?.replace(/^\w/, (c) => c.toUpperCase()) || "";

  useEffect(() => {
    document.title = pageTitle === "" ? "Home" : pageTitle;
  }, [pageTitle]);

  return (
    <body className="bg_lifelink">
      <nav className="px-2">
        <NavbarIndex />
      </nav>
      {children}
    </body>
  );
}
