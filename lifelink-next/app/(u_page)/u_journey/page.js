'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Typography } from "@material-tailwind/react";
import { JourneyStepper } from './components/stepper';
import { BloodBagTable } from './components/table';
import axios from "axios"; // Import Axios
import { laravelBaseUrl } from "@/app/variables";
import { useEffect, useState } from "react"; // Import useEffect and useState

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [bloodJourney, setBloodJourney] = useState([]); // Initialize with an empty array

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

  return (
    <div className="flex min-h-screen flex-col py-2">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* <JourneyStepper bloodJourney={bloodJourney} /> */}
          <BloodBagTable bloodJourney={bloodJourney}/>
        </>
      )}
    </div>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
