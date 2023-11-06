'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Typography } from "@material-tailwind/react";
import { PostCard, FilterCheckBox } from './components/post';
import { CreatePost } from './components/popup';

export default function Home() {
  const router = useRouter();
  const bloodTypes = ["All", "Approved", "Pending", "Disapproved"];

  return (
    <div className="flex min-h-screen flex-col py-2">
        <div className='p-6 bg-gray-100 rounded-xl shadow-xl'>
            <div className='w-full mb-6'>
                <FilterCheckBox />
            </div>
            <PostCard />
        </div>
    </div>
  )
}
