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
  const [activityLogs, setActivityLogs] = useState([]); 

  const fetchData = async (page) => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-audit-trail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('parent',response.data.data);
      if (response.data.status === "success") {
        setActivityLogs(response.data.data); 
        setLoading(false);
      } else {
        console.error("Error fetching data:", response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between p-12">
      <LogsTable activityLogs={activityLogs} />
    </div>
  )
  
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}