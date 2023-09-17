'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@material-tailwind/react";
import { BloodListCard } from './components/cards';
import { useEffect, useState } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

export default function Home() {
  const router = useRouter();
  const [bloodTypes, setBloodTypes] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [legend, setLegend] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie("token");
        const response = await axios.get(`${laravelBaseUrl}/api/get-available-blood`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
       
        // console.log(response.data);
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
    return <BloodListCard key={index} bloodType={bloodType} availability={status} legend={legends}/>;
  });


  return (
    <div className="flex min-h-screen flex-col py-2 ml-72">
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-3'>
          {bloodListCards.slice(0, 4)}
        </div>
        <div className='flex gap-3'>
          {bloodListCards.slice(4, 8)}
        </div>
      </div>
    </div>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}