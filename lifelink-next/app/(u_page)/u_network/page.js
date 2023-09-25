'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, Select, Option } from "@material-tailwind/react";
import { PostCard } from './components/post';
import { CreatePost } from './components/popup';

export default function Home() {
  const router = useRouter();
  const bloodTypes = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

  return (
    <div className="flex min-h-screen flex-col py-2">
        <div className='p-6 bg-gray-100 rounded-xl shadow-xl'>
            <div className='w-20 mb-6'>
                <Select label="Blood Types">
                {bloodTypes.map((blood) => (
                    <Option key={blood} value={blood}>
                        {blood}
                    </Option>
                ))}
                </Select>
            </div>
            <PostCard />
        </div>
        <CreatePost />
    </div>
  )
}
