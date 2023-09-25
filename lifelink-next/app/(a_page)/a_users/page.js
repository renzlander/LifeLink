'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@material-tailwind/react";
import { UsersTable } from './components/table';

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-12">
        <UsersTable />
    </div>
  )
}
