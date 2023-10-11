'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, Spinner } from "@material-tailwind/react";
import { BloodListCard } from './components/cards';
import { useEffect, useState } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import BarChart from './components/barChart';
import LineChart from './components/tableChart';

export default function Home() {
  const router = useRouter();
  const [bloodTypes, setBloodTypes] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [legend, setLegend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/get-available-blood`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoading(false);

        if (response.data && Array.isArray(response.data.blood_bags)) {
          const bloodTypes = response.data.blood_bags.map((bag) => bag.blood_type);
          const availability = response.data.blood_bags.map((bag) => bag.status);
          const legend = response.data.blood_bags.map((bag) => bag.legend);

          setBloodTypes(bloodTypes);
          setAvailability(availability);
          setLegend(legend);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const bloodListCards = bloodTypes.map((bloodType, index) => {
    const status = availability[index];
    const legends = legend[index];
    return <BloodListCard key={index} bloodType={bloodType} availability={status} legend={legends} />;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen max-w-full flex-col py-2 justify-center items-center">
        <Spinner color="red" className="h-16 w-16" />
        <p className="mb-[180px] text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-300 min-h-screen flex flex-col justify-between gap-y-3 p-4">
      <div className='flex gap-3'>
        {bloodListCards.slice(0, 4)}
      </div>
      <div className='flex gap-3'>
        {bloodListCards.slice(4, 8)}
      </div>
      
      <div className='mt-10 flex gap-3'>
        <LineChart />
        <BarChart />
      </div>
    </div>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
