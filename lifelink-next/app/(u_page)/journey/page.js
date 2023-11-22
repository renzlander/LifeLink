'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Typography,   Spinner, } from "@material-tailwind/react";
import { BloodBagTable } from './components/table';
import axios from "axios"; 
import { laravelBaseUrl } from "@/app/variables";
import { useEffect, useState } from "react"; 

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); 
  const [bloodJourney, setBloodJourney] = useState([]); 

  const fetchData = async (page) => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-blood-journey`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      if (response.data.status === "success") {
        setBloodJourney(response.data.bloodJourney); // Set the fetched data in state
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

  if (loading) {
    return (
      <div className="flex min-h-screen max-w-full flex-col py-2 justify-center items-center">
        <Spinner color="red" className="h-16 w-16" />
        <p className="mb-[180px] text-gray-600">Loading...</p>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col py-2">
      <BloodBagTable bloodJourney={bloodJourney}/>
    </div>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
