'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button,Spinner } from "@material-tailwind/react";
import { BagsTable } from './components/table';


export default function Home() {
  const router = useRouter();
  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between p-12">
      <BagsTable />
      
    </div>
  )
}

