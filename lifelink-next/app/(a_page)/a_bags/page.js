'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button,Spinner } from "@material-tailwind/react";
import { BagsTable } from './components/table';
import { ToastContainer, toast } from "react-toastify";



export default function Home() {
  const router = useRouter();
  // toast.warn('You only have 3 days to edit and remove blood bags', {
  //   position: "top-center",
  //   autoClose: false,
  //   hideProgressBar: false,
  //   closeOnClick: true,
  //   pauseOnHover: true,
  //   draggable: true,
  //   progress: undefined,
  //   theme: "dark",
  //   });
  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between p-12">
      <BagsTable />
      
    </div>
  )
}

