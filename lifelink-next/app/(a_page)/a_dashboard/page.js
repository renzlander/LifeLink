'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Spinner, Card, Typography } from "@material-tailwind/react";
import { BloodListCard, CountDonorCard } from './components/cards';
import { LineCard, BarCard } from './components/charts';
import { useEffect, useState } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { ClockIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const router = useRouter();
  const [bloodTypes, setBloodTypes] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [legend, setLegend] = useState([]);
  const [count, setCount] = useState([]);
  const [percentage, setPercentage] = useState([]);
  const [donorCount, setDonorCount] = useState(0);
  const [deferralsCount, setDeferralsCount] = useState(0);
  const [dispensedCount, setDispensedCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/dashboard-get-stocks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoading(false);

        if (response.data && Array.isArray(response.data.blood_bags)) {
          const bloodTypes = response.data.blood_bags.map((bag) => bag.blood_type);
          const availability = response.data.blood_bags.map((bag) => bag.status);
          const legend = response.data.blood_bags.map((bag) => bag.legend);
          const count = response.data.blood_bags.map((bag) => bag.count);
          const percentage = response.data.blood_bags.map((bag) => bag.percentage);

          setBloodTypes(bloodTypes);
          setAvailability(availability);
          setLegend(legend);
          setCount(count);
          setPercentage(percentage);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMBDSummary = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const mbdSummary = await axios.get(`${laravelBaseUrl}/api/dashboard-mbd-quick-view`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoading(false);

        if (mbdSummary.data.status === "success") {
          setDonorCount(mbdSummary.data.data[0].total_donors);
          setDeferralsCount(mbdSummary.data.data[0].total_deferrals);
          setDispensedCount(mbdSummary.data.data[0].total_dispensed);
          setExpiredCount(mbdSummary.data.data[0].total_expired);
          setLoading(false);
        } else {
            console.error("Error fetching data:", mbdSummary.data.message);
            setLoading(false);
        }
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchMBDSummary();
    fetchData();
  }, []);

  const bloodListCards = bloodTypes.map((bloodType, index) => {
    const status = availability[index];
    const legends = legend[index];
    const counts = count[index];
    const percentages = percentage[index];
    return (
      <div>
        <BloodListCard key={index} bloodType={bloodType} availability={status} legend={legends} count={counts} percentage={percentages}/>
      </div>
    );
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
        <div className='grid grid-cols-4 gap-3'>
          <Card className='p-4 col-start-1 col-end-4 place-items-center w-full gap-y-3 bg-gray-100'>
            <div className='flex 3xl:gap-16 gap-3 shrink'>
              {bloodListCards.slice(0, 4)}
            </div>
            <div className='flex 3xl:gap-16 gap-3 shrink mb-6'>
              {bloodListCards.slice(4, 8)}
            </div>
            <div className='flex items-center gap-4 absolute bottom-1 right-4'>
              <div className='flex items-center gap-1'>
                <ClockIcon className='w-5 h-5 text-gray-700' />
                <Typography className='text-sm text-gray-700 font-normal'>Updated:</Typography>
              </div>
              <Typography className='text-gray-700 text-md font-normal'>08:34 PM 10/21/2023</Typography>
            </div>
          </Card>
          <div className='col-start-4 col-end-5 w-full'>
            <CountDonorCard donorCount={donorCount} deferralsCount={deferralsCount} dispensedCount={dispensedCount} expiredCount={expiredCount} />
          </div>
        </div>
        <div className='mt-2 flex gap-3'>
          <LineCard />
          <BarCard />
        </div>
    </div>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
