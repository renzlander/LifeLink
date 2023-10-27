'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Typography } from "@material-tailwind/react";
import { PostCard, FilterCheckBox } from './components/post';


export default function Home() {
  const router = useRouter();
  const bloodTypes = ["All", "Approved", "Pending", "Disapproved"];
  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between py-4 px-6">
      <div className='flex flex-col items-center justify-center gap-2'>
          <div className='w-full mb-6'>
              <FilterCheckBox />
          </div>
          <PostCard />
      </div>
    </div>
  );
}
