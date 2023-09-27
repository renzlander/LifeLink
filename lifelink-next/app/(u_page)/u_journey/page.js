'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Typography } from "@material-tailwind/react";
import { JourneyStepper } from './components/stepper';
import { BloodBagTable } from './components/table';
export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col py-2">
      <JourneyStepper />
      <BloodBagTable />
    </div>
  )
}
