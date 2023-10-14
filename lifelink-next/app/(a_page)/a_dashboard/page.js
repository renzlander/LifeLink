'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@material-tailwind/react";
import { BloodListCard, LineCard, BarCard, CountDonorCard } from './components/cards';

export default function Home() {
  const router = useRouter();

  const bloodCards = Array.from({ length: 8 }, (_, i) => <BloodListCard key={i} />);

  return (
    <div className="bg-gray-300 min-h-screen flex flex-col justify-between gap-y-3 p-4">
        <div className='flex gap-3'>
          <div className='flex flex-col gap-y-10 w-2/3'>
            <div className='flex gap-3'>
              {bloodCards.slice(0, 4)}
            </div>
            <div className='flex gap-3'>
              {bloodCards.slice(4, 8)}
            </div>
          </div>
          <div className='w-1/3'>
            <CountDonorCard />
          </div>
        </div>
        <div className='mt-10 flex gap-3'>
          <LineCard />
          <BarCard />
        </div>
    </div>
  );
}
