'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@material-tailwind/react";
// import { BloodListCard } from './components/cards';

export default function Home() {
  const router = useRouter();
  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between py-2">
        {/* <BloodListCard /> */}
    </div>
  )
}
