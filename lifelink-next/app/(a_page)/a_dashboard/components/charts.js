import React from "react";
import { Card, CardHeader, Checkbox, Input, Typography, Button, CardBody, Chip, CardFooter, Tabs, TabsHeader, Tab, Avatar, IconButton, Tooltip, Spinner, Select, Option } from "@material-tailwind/react";
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

export function LineCard() {
  const [loading, setLoading] = useState(true);
  const [monthCounts, setMonthCounts] = useState({});
  const [lastUpdate, setLastUpdate] = useState("");
  const [time, setTime] = useState('');
  const [timeAgoo, setTimeAgo] = useState('');
  const [filterBloodType, setFilterBloodType] = useState("All");
  const bloodTypes = ["All", "AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];
  const router = useRouter();

  const handleBloodChange = (selectedBlood) => {
      setFilterBloodType(selectedBlood);
  };

  useEffect(() => {
    const fetchBloodBagData = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("/login");
          return;
        }
  
        const response = await axios.post(
          `${laravelBaseUrl}/api/dashboard-count-bloodbag-per-month`,
          null, // Set the request body to null
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              blood_type: filterBloodType,
            },
          }
        );
  
  
        if (response.data.status === "success") {
          const monthData = response.data.month_counts[0]; // Get the data for the first (and only) element
          const lastUpdate = response.data.latest_date;
          const date = new Date(lastUpdate);
          const options = { hour: '2-digit', minute: '2-digit', hour12: true };
          const time = date.toLocaleTimeString(undefined, options);
          setTime(time);
          setMonthCounts(monthData);
          setLastUpdate(lastUpdate);
  
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchBloodBagData();
  }, [filterBloodType]);

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
      <CardHeader color="white" variant="gradient" className="flex items-center justify-center relative p-4 h-full">
        <LineChart data={monthCounts} />
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Typography variant="h5" color="blue-gray" className="w-full">
            Blood Stocks
          </Typography>
          <Select onChange={handleBloodChange} label="Blood Type" value={filterBloodType} containerProps={{ className: "min-w-[50px]" }}>
            {bloodTypes.map((blood) => (
              <Option key={blood} value={blood}>
                  {blood}
              </Option>
            ))}
          </Select>
        </div>
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
  const [filterQuarter, setFilterQuarter] = useState("All");
  const router = useRouter();

  const quarters = [
    { label: "All", value: "All" },
    { label: "January - March", value: "Q1" },
    { label: "April - June", value: "Q2" },
    { label: "July - September", value: "Q3" },
    { label: "October - December", value: "Q4" }
  ];

  const handleQuarterChange = (selectedQuarter) => {
      setFilterQuarter(selectedQuarter);
  };

  useEffect(() => {
    const fetchDonorCountPerBarangay = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.post(
          `${laravelBaseUrl}/api/dashboard-count-donor-per-barangay`,
          {}, // Pass an empty object as the request body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              quarter: filterQuarter,
            },
          }
        );
        
        if (response.data.status === "success") {
          const donorCounts = response.data.donors_per_barangay;
          const lastUpdate = response.data.latest_date;

          const date = new Date(lastUpdate);
          const options = { hour: '2-digit', minute: '2-digit', hour12: true };
          const time = date.toLocaleTimeString(undefined, options);
          setTime(time);
          // Create an object with all barangays and default to zero donors
          const allBarangays = [
            'Arkong Bato','Bagbaguin', 'Balangkas', 'Bignay', 'Bisig', 'Canumay East (Canumay)', 'Canumay West (Canumay)', 'Coloong',
            'Dalandanan', 'Hen. T. de Leon', 'Isla', 'Karuhatan', 'Lawang Bato', 'Lingunan',
            'Mabolo', 'Malanday', 'Malinta', 'Mapulang Lupa', 'Marulas', 'Maysan',
            'Palasan', 'Parada', 'Pariancillo Villa','Paso de Blas', 'Pasolo', 'Poblacion', 'Pulo',
            'Punturin', 'Rincon', 'Tagalag', 'Ugong', 'Veinte Reales', 'Wawang Pulo'
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
  }, [filterQuarter]);

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
      <CardHeader color="white" variant="gradient" className="flex items-center justify-center relative p-4 h-full">
        <BarChart data={barangayDonorCount} />
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Typography variant="h5" color="blue-gray" className="w-full">
            Donors per Barangay
          </Typography>
          <Select onChange={handleQuarterChange} label="Filter by Quarter" value={filterQuarter} containerProps={{ className: "min-w-[25px]" }}>
            {quarters.map((quarter) => (
              <Option key={quarter.value} value={quarter.value}>
                {quarter.label}
              </Option>
            ))}
          </Select>
        </div>
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

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}