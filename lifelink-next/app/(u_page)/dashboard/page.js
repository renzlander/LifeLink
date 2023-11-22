'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Typography, Spinner } from "@material-tailwind/react";
import { ClockIcon } from '@heroicons/react/24/outline';
import { BloodListCard } from './components/cards';
import { useEffect, useState } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { DonationCard } from './components/donation';
import { PostsCard } from './components/posts';

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
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState("");
  const [updatedAtTime, setUpdatedAtTime] = useState("");
  const [donationSummary, setDonationSummary] = useState([]);
  const [recentPost, setRecentPost] = useState([]);

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

        console.log(response);
        if (response.data && Array.isArray(response.data.blood_bags)) {
          const bloodTypes = response.data.blood_bags.map((bag) => bag.blood_type);
          const availability = response.data.blood_bags.map((bag) => bag.status);
          const legend = response.data.blood_bags.map((bag) => bag.legend);

          setBloodTypes(bloodTypes);
          setAvailability(availability);
          setLegend(legend);
          setUpdatedAt(response.data.latest_created_at)
          // Extract and set the time portion of the timestamp
          const fullTimestamp = response.data.latest_created_at;
          const date = new Date(fullTimestamp);
          const options = { hour: '2-digit', minute: '2-digit', hour12: true };
          const time = date.toLocaleTimeString(undefined, options);
          setUpdatedAtTime(time);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRecentPost = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/get-recent-post`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
       
        if (response.data.status == "success") {
          setRecentPost(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMbdSummary = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/get-donation-summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoading(false);
       
        if (response.data.status == "success") {
          setDonationSummary(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    fetchMbdSummary();
    fetchRecentPost();
  }, []);

  const bloodListCards = bloodTypes.map((bloodType, index) => {
    const status = availability[index];
    const legends = legend[index];
    return <BloodListCard key={index} bloodType={bloodType} availability={status} legend={legends} />;
  });

  if (loading) {
    return (
      <>
        <Spinner color="red" className="h-16 w-16" />
        <p className="mb-[180px] text-gray-600">Loading...</p>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-y-3 py-4">
      <div className='flex 3xl:flex-row flex-col justify-between gap-4 w-full'>
        <Card className="mt-6 w-full bg-gray-100">
          <CardHeader color='gray' variant='gradient' className="h-16 flex items-center mb-4">
            <Typography variant="h4" color="white" className="ml-4">
              Blood Stock
            </Typography>
          </CardHeader>
          <CardBody className='w-full flex xl:flex-col flex-row items-center justify-center gap-10'>
            <div className="flex xl:flex-row flex-col 3xl:gap-16 xl:gap-3 gap-10">
              {bloodListCards.slice(0, 4)}
            </div>
            <div className="flex xl:flex-row flex-col 3xl:gap-16 xl:gap-3 gap-10">
              {bloodListCards.slice(4, 8)}
            </div>
          </CardBody>
          <CardFooter className="flex justify-end items-center gap-4 pt-0 pb-2 pr-6">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-5 h-5 text-gray-700" />
              <Typography className="text-sm text-gray-700 font-normal">Last Updated:</Typography>
            </div>
            <Typography className="text-gray-700 text-xl font-normal">{formatDate(updatedAt)} {updatedAtTime}</Typography>
          </CardFooter>
        </Card>
        <DonationCard donationSummary={donationSummary}/>
      </div>
      <div>
        <PostsCard recentPost={recentPost}/>
      </div>
    </div>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
