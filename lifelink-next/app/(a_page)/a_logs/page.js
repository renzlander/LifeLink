'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@material-tailwind/react";
import { LogsTable } from './components/table';
import axios from "axios"; 
import { laravelBaseUrl } from "@/app/variables";
import { useEffect, useState } from "react"; 

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); 



  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between p-12">
      <LogsTable/>
    </div>
  )
  
}

