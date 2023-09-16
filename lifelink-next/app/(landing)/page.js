'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@material-tailwind/react";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-2">
      <div className='w-full'>
        <div className='flex flex-col w-1/2 2xl:ml-10 mx-auto mt-8 font-bold'>
          <h1 className='text-9xl text-[#424242]'>DONATE</h1>
          <h1 className='text-9xl text-[#d1071b]'>Blood</h1>
          <h1 className='text-9xl text-[#424242]'>Save 
            <span className='text-[#d1071b]'>
              Lives.
            </span>
          </h1>
          
          <div className='flex flex-wrap justify-evenly ml-10 my-8 font-light text-xl'>
            <Button 
              onClick={() => {
                router.push("/login");
              }}
              className="bg-[#d1071b] w-1/4 border rounded-full hover:bg-white hover:text-[#d1071b]"
            >
              Get Started
            </Button>
            <Button className="bg-transparent w-1/4 text-[#d1071b] border border-[#d1071b] rounded-full hover:bg-[#d1071b] hover:text-white">Read More</Button>
          </div>
        </div>
      </div>

    </main>
  )
}
