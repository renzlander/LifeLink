'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@material-tailwind/react";
import { BloodListCard, TableCard } from './components/cards';

export default function Home() {
  const router = useRouter();
  const title = 'Dashboard';
  const bloodCards = Array.from({ length: 8 }, (_, i) => <BloodListCard key={i} />);
  return (
    <div className="bg-gray-300 flex min-h-screen flex-col justify-between p-4">
      <div className='flex flex-col gap-y-3'>
        <div className='flex shrink gap-3'>
          {bloodCards.slice(0, 4)}
        </div>
        <div className='flex gap-3'>
          {bloodCards.slice(4, 8)}
        </div>
        <div>
          <TableCard />
        </div>
      </div>
    </div>
  );
}
