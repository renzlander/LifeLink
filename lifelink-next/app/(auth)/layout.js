"use client";
import "../globals.css";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";

export default function LoginLayout({ children }) {
  const pathName = usePathname();
  const pageTitle =
    pathName.split("/")[1]?.replace(/^\w/, (c) => c.toUpperCase()) || "";
  const router = useRouter();

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <main className="bg-[#d9d9d9] gen_bg">
      <Button
        variant="gradient"
        color="gray"
        size="sm"
        className="absolute top-5 left-5 flex items-center justify-between gap-3"
        onClick={() => router.push("/")}
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="hidden 2xl:block">BACK</span>
      </Button>
      {children}
    </main>
  );
}
