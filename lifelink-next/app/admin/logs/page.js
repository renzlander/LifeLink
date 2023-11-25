"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogsTable } from "./components/Table";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between p-12">
      <LogsTable />
    </div>
  );
}
