'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@material-tailwind/react";
import { BloodListCard } from './components/cards';

export default function Home() {
  const router = useRouter();

  const bloodListCards = Array.from({ length: 4 }, (_, index) => (
    <BloodListCard key={index} />
  ));

  return (
    <div className="flex min-h-screen flex-col py-2 ml-72">
        <div className='flex flex-col gap-y-3'>
            <div className='flex gap-3'>
                {bloodListCards}
            </div>
            <div className='flex gap-3'>
                {bloodListCards}
            </div>
        </div>
    </div>
  )
}
