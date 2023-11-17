'use client'
import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Spinner, Card, CardHeader, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { BloodListCard, CountDonorCard, BloodQuota } from './components/cards';
import { LineCard, BarCard } from './components/charts';
import { useEffect, useState } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { ClockIcon } from '@heroicons/react/24/outline';
import Skeleton from '@mui/material/Skeleton';


function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
  return formattedDate;
}

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
  const [reactiveCount, setReactiveCount] = useState(0);
  const [spoiledCount, setSpoiledCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString()); 
  const [updatedAt, setUpdatedAt] = useState("");
  const [updatedAtTime, setUpdatedAtTime] = useState("");
  const [quota, setQuota] = useState([]);
  const handleMonthChange = (selectedMonth) => {
    setSelectedMonth(selectedMonth);
  };

  const handleYearChange = (selectedYear) => {
    setSelectedYear(selectedYear);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/dashboard-get-stocks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoading(false);
        if (response.data && Array.isArray(response.data.blood_bags)) {
          const bloodBags = response.data.blood_bags;
          const bloodTypeData = bloodBags.map((bag) => ({
            bloodType: bag.blood_type,
            availability: bag.status,
            legend: bag.legend,
            count: bag.count,
            percentage: bag.percentage,
          }));

          const bloodTypeArray = bloodBags.map((bag) => bag.blood_type);
          const availabilityArray = bloodBags.map((bag) => bag.status);
          const legendArray = bloodBags.map((bag) => bag.legend);
          const countArray = bloodBags.map((bag) => bag.count);
          const percentageArray = bloodBags.map((bag) => bag.percentage);

          setBloodTypes(bloodTypeArray);
          setAvailability(availabilityArray);
          setLegend(legendArray);
          setCount(countArray);
          setPercentage(percentageArray);
          setUpdatedAt(response.data.latest_created_at);
          
          // Extract and set the time portion of the timestamp
          const fullTimestamp = response.data.latest_created_at;
          const date = new Date(fullTimestamp);
          const options = { hour: '2-digit', minute: '2-digit', hour12: true };
          const time = date.toLocaleTimeString(undefined, options);
          setUpdatedAtTime(time);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchMBDSummary = async () => {
      try {
        const token = getCookie('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const mbdSummary = await axios.get(`${laravelBaseUrl}/api/dashboard-mbd-quick-view`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            month: selectedMonth,
            year: selectedYear,
          },
        });
        setLoading(false);
        console.log(selectedMonth);
        console.log(selectedYear);

        if (mbdSummary.data.status === 'success') {
          setDonorCount(mbdSummary.data.data[0].total_donors);
          setDeferralsCount(mbdSummary.data.data[0].total_deferrals);
          setDispensedCount(mbdSummary.data.data[0].total_dispensed);
          setExpiredCount(mbdSummary.data.data[0].total_expired);
          setReactiveCount(mbdSummary.data.data[0].total_reactive);
          setSpoiledCount(mbdSummary.data.data[0].total_spoiled);
          setLoading(false);
        } else {
          console.error('Error fetching data:', mbdSummary.data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchQuota = async () => {
      try {
        const token = getCookie('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/dashboard-get-quota`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setLoading(false);
        if (response.data.status === 'success') {
          setQuota(response.data)
          setLoading(false);
        } else {
          console.error('Error fetching data:', mbdSummary.data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMBDSummary();
    fetchData();
    fetchQuota();
  }, [selectedMonth, selectedYear]);

  const bloodListCards = bloodTypes.map((bloodType, index) => (
    <BloodListCard
      key={index}
      bloodType={bloodType}
      availability={availability[index]}
      legend={legend[index]}
      count={count[index]}
      percentage={percentage[index]}
    />
  ));

  if (loading) {
    return (
      <div className="flex min-h-screen max-w-full flex-col py-2 justify-center items-center">
          <Skeleton variant="rounded" width="80%" height={500} animation="wave" />
      </div>
    );
  }

  return (
    <div className="bg-gray-300 min-h-screen flex flex-col justify-between gap-y-3 p-4">
      <div className="flex items-start justify-between gap-4 w-full">
        <Card className="mt-6 w-full bg-gray-100">
          <CardHeader color='gray' variant='gradient' className="h-16 flex items-center mb-4">
            <Typography variant="h4" color="white" className="ml-4">
              Blood Stock
            </Typography>
          </CardHeader>
          <CardBody className='w-full flex flex-col items-center gap-10'>
            <div className="flex 3xl:gap-16 gap-3 shrink">
              {bloodListCards.slice(0, 4)}
            </div>
            <div className="flex 3xl:gap-16 gap-3 shrink">
              {bloodListCards.slice(4, 8)}
            </div>
          </CardBody>
          <CardFooter className="flex justify-end items-center gap-4 pt-0 pb-2 pr-6">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-5 h-5 text-gray-700" />
              <Typography className="text-sm text-gray-700 font-normal">Last Updated:</Typography>
            </div>
            <Typography className="text-gray-700 text-md font-normal">{formatDate(updatedAt)} {updatedAtTime}</Typography>
          </CardFooter>
        </Card>
        <div className="col-start-4 col-end-5 w-full">
          <div className='flex flex-col items-center gap-4'>
            <CountDonorCard
              donorCount={donorCount}
              deferralsCount={deferralsCount}
              dispensedCount={dispensedCount}
              expiredCount={expiredCount}
              reactiveCount={reactiveCount}
              spoiledCount={spoiledCount}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
            />
            <BloodQuota quota={quota}/>
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-4">
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
