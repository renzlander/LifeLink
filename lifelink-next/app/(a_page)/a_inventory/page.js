'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@material-tailwind/react";
import { InventoryTable } from './components/table';

export default function TabRBB() {
  const router = useRouter();
  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between p-12">
      <InventoryTable />
    </div>
  )
}
