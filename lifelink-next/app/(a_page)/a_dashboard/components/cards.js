import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Chip,
  } from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/outline";
import LineChart from "./lineChart";
import BarChart from "./barChart";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { laravelBaseUrl } from "@/app/variables";
import axios from "axios";
import BloodDropletIcon from "@/public/BloodDroplet";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
  return formattedDate;
}

export function BloodListCard({ bloodType, availability, legend, count, percentage }) {
  let colorClass = "";
  let offsetTop = 0;
  let offsetBot = 0;

  if (legend === "Empty") {
      colorClass = "gray";
      offsetTop = 100; 
      offsetBot = 0; 
  } else if (legend === "Critically low") {
      colorClass = "red"; 
      offsetTop = 80; 
      offsetBot = 20; 
  } else if (legend === "Low") {
      colorClass = "orange"; 
      offsetTop = 60; 
      offsetBot = 40; 
  }

  let status = "";
  if (availability === "Available") {
    status = "green";
  } else {
    status = "blue-gray";
  }
  
  return (
    <Card className="mt-6 3xl:w-72 w-56 h-full">
      <div className="flex justify-between">
        <CardHeader
          color="red"
          variant="gradient"
          className='relative flex flex-col justify-center items-center h-16 w-16 p-2'
        >
          <BloodDropletIcon width={200} height={200} topOffset={offsetTop} botOffset={offsetBot} />
          <Typography
            variant="h6"
            color="white"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[40%]"
          >
            {bloodType}
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col items-end justify-end py-3 px-4 w-1/2">
          <Typography variant="paragraph" color="gray" className="text-gray-500">
            Quantity
          </Typography>
          <Typography variant="h5" color="blue-gray" className="text-2xl font-bold">
            {count}
          </Typography>
          <div className="flex gap-2">
            <Chip size="sm" variant="gradient" color={status} value={availability} className="flex justify-center 3xl:w-full w-16 3xl:text-xs text-[8px]" />
            <Chip size="sm" variant="gradient" color={colorClass} value={legend} className="flex justify-center 3xl:w-full w-16 3xl:text-xs text-[6px]" />
          </div>
        </CardBody>
      </div>
      <hr className="fading_divider_gray" />
      <CardFooter className="flex justify-start items-center p-3">
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5" />
            <Typography variant="paragraph" className='text-gray-600 text-sm font-medium'>
              Updated:
            </Typography>
          </div>
          <div>
          <Typography variant="paragraph" className='text-gray-600 3xl:textsm text-xs font-medium'>
            10-21-23 4:04 PM
          </Typography>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function LineCard() {
  const [loading, setLoading] = useState(true);
  const [monthCounts, setMonthCounts] = useState({});
  const [lastUpdate, setLastUpdate] = useState("");
  const [time, setTime] = useState('');
  const [timeAgoo, setTimeAgo] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBloodBagData = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/dashboard-count-bloodbag-per-month`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "success") {
          const monthData = response.data.month_counts[0]; // Get the data for the first (and only) element
          const lastUpdate = response.data.latest_date;
          const dateObject = new Date(lastUpdate);

          // Extract the time components (hours and minutes)
          const hours = dateObject.getHours();
          const minutes = dateObject.getMinutes();

          // Determine if it's AM or PM
          const amPm = hours >= 12 ? "PM" : "AM";

          // Convert hours to 12-hour format
          const hours12 = hours % 12 || 12;

          // Create a string representation of the time in 12-hour format
          const timeString = `${hours12}:${minutes} ${amPm}`;
          setTime(timeString);
          setMonthCounts(monthData); // Update with your API data
          setLastUpdate(lastUpdate);

          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBloodBagData();
  }, []);

  useEffect(() => {
    if (lastUpdate) {
      const timeAgoString = timeAgo(lastUpdate);
      setTimeAgo(timeAgoString);
    }
  }, [lastUpdate]);

  function timeAgo(timestamp) {
    const now = new Date();
    const pastDate = new Date(timestamp);
  
    // Calculate the time difference in milliseconds
    const timeDifference = now - pastDate;
  
    // Calculate the time components
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursAgo = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesAgo = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  
    if (daysAgo > 0) {
      return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    } else if (hoursAgo > 0) {
      return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else {
      return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    }
  }

  return (
    <Card className="mt-6 w-1/2">
      <CardHeader color="red" variant="gradient" className="flex items-center justify-center relative p-6 h-full">
        <LineChart data={monthCounts} /> {/* Pass your data to the LineChart component */}
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          Blood Stocks
        </Typography>
        <Typography>
        Blood bags that have undergone thorough testing and are securely stored in the inventory.
        </Typography>
      </CardBody>
      <CardFooter className="border-t">
        <Typography>
          Updated {formatDate(lastUpdate)} {time} ({timeAgoo})
        </Typography>
      </CardFooter>
    </Card>
  );
}

export function BarCard() {
  const [barangayDonorCount, setBarangayDonorCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [time, setTime] = useState('');
  const [timeAgoo, setTimeAgo] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDonorCountPerBarangay = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/dashboard-count-donor-per-barangay`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "success") {
          const donorCounts = response.data.donors_per_barangay;
          const lastUpdate = response.data.latest_date;

          const dateObject = new Date(lastUpdate);

          // Extract the time components (hours and minutes)
          const hours = dateObject.getHours();
          const minutes = dateObject.getMinutes();

          // Determine if it's AM or PM
          const amPm = hours >= 12 ? "PM" : "AM";

          // Convert hours to 12-hour format
          const hours12 = hours % 12 || 12;

          // Create a string representation of the time in 12-hour format
          const timeString = `${hours12}:${minutes} ${amPm}`;
          setTime(timeString);
          // Create an object with all barangays and default to zero donors
          const allBarangays = [
            'Bagbaguin', 'Bignay', 'Bisig', 'Canumay', 'Coloong',
            'Dalandanan', 'Gen. T. de Leon', 'Karuhatan', 'Lawang Bato', 'Lingunan',
            'Mabolo', 'Malanday', 'Malinta', 'Mapulang Lupa', 'Marulas', 'Maysan',
            'Palasan', 'Parada', 'Paso de Blas', 'Pasolo', 'Poblacion', 'Polo',
            'Punturin', 'Rincon', 'Tagalag', 'Ugong', 'Veinte Reales'
          ];

          const updatedDonorCount = allBarangays.map((barangay) => {
            const found = donorCounts.find(item => item.barangay === barangay);
            return found ? found : { barangay, donor_count: 0 };
          });

          setBarangayDonorCount(updatedDonorCount);
          setLastUpdate(lastUpdate);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDonorCountPerBarangay();
  }, []);

  useEffect(() => {
    if (lastUpdate) {
      const timeAgoString = timeAgo(lastUpdate);
      setTimeAgo(timeAgoString);
    }
  }, [lastUpdate]);

  function timeAgo(timestamp) {
    const now = new Date();
    const pastDate = new Date(timestamp);
  
    // Calculate the time difference in milliseconds
    const timeDifference = now - pastDate;
  
    // Calculate the time components
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursAgo = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesAgo = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  
    if (daysAgo > 0) {
      return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    } else if (hoursAgo > 0) {
      return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else {
      return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    }
  }

  return (
    <Card className="mt-6 w-1/2">
      <CardHeader color="red" variant="gradient" className="flex items-center justify-center relative p-4 h-full">
        <BarChart data={barangayDonorCount} />
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          Donors per Barangay
        </Typography>
        <Typography>
          The number of donors within different barangays in Valenzuela City.
        </Typography>
      </CardBody>
      <CardFooter className="border-t">
        <Typography>
          Last updated: {formatDate(lastUpdate)} {time} ({timeAgoo})
        </Typography>
      </CardFooter>
    </Card>
  );
}

export function CountDonorCard({donorCount, deferralsCount, dispensedCount, expiredCount}) {
  const TABLE_ROWS = [
    {
      label: "Donors",
      count: donorCount,
    },
    {
      label: "Deffered",
      count: deferralsCount,
    },
    {
      label: "Dispensed Blood",
      count: dispensedCount,
    },
    {
      label: "Expired Blood",
      count: expiredCount,
    },
    {
      label: "Spoiled Blood Bag",
      count: "0",
    },
    {
      label: "Reactive Blood Bag",
      count: "0",
    },
  ];

  return (
    <Card className="mt-6 w-full">
      <CardHeader color="gray" className="relative h-16 flex items-center">
        <Typography variant="h4" color="white" className="ml-4">
          MBD Summary
        </Typography>
      </CardHeader>
      <CardBody className="p-0">
      <table className="w-full min-w-max table-auto text-left">
        <tbody>
          {TABLE_ROWS.map(({ label, count }, index) => {
            const isLast = index === TABLE_ROWS.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
 
            return (
              <tr key={name}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    className="font-normal text-blue-gray-500"
                  >
                    {label}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    className="font-normal text-blue-gray-500"
                  >
                    {count}
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </CardBody>
    </Card>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
