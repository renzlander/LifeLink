"use client";
import { useRouter } from "next/navigation";
import { InventoryTable } from "./components/Table";

export default function TabRBB() {
  const router = useRouter();
  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between p-12">
      <InventoryTable />
    </div>
  );
}
