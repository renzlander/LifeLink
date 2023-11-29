"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

export default function LoginLayout({ children }) {
  const router = useRouter();
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
