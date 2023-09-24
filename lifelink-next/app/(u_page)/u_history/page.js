'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@material-tailwind/react";
import { HistoryTable } from './components/table';

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col py-2">
        <HistoryTable />
    </div>
  )
}
