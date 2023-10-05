'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from "@material-tailwind/react";
import { PRCMap } from './components/map';

export default function Home() {
  const router = useRouter();
  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between py-2">
      <PRCMap />
    </div>
  );
}
