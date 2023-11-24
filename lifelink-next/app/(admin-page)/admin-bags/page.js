"use client";
import { useRouter } from "next/navigation";
import { BagsTable } from "./components/Table";

export default function Home() {
  const router = useRouter();
  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between p-12">
      <BagsTable />
    </div>
  );
}
