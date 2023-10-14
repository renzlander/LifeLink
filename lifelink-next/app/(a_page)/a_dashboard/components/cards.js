import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";
import LineChart from "./lineChart";
import BarChart from "./barChart";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { laravelBaseUrl } from "@/app/variables";
import axios from "axios";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
  return formattedDate;
}

export function BloodListCard({ bloodType, availability, legend, count, percentage }) {
  
  let colorClass = ""; 

  if (legend === "Empty") {
      colorClass = "text-red-600"; 
  } else if (legend === "Low") {
      colorClass = "text-yellow-600"; 
  } else if (legend === "Critically low") {
      colorClass = "text-orange-600"; 
  }

  return (
    <Card className="mt-6 w-1/4 h-full">
      <div className="flex mb-5">
        <CardHeader color="red" className="relative flex justify-center items-center h-20 w-20">
          <Typography variant="h2" color="white" className="mb-2">
            {bloodType}
          </Typography>
        </CardHeader>
        <CardBody>
          <Typography variant="h5" className="mb-2">
            {availability}
          </Typography>
        </CardBody>
      </div>
      <CardFooter className="border-t flex justify-center items-center">
        <div className="flex flex-col">
          <Typography variant="h6" className={`${colorClass}`}>
            Quantity: {count}
          </Typography>
          <Typography variant="h6" className={`${colorClass}`}>
            percentage: {percentage}%
          </Typography>
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
          Bloods Stocks
        </Typography>
        <Typography>
          Collected blood bags over the past few months
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


export function CountDonorCard({donorCount}) {
  return (
    <Card className="mt-6 w-full">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2 text-center">
          NO. OF DONORS
        </Typography>
        <div className="flex justify-center">
          <Typography variant="h1" color="red" className="w-1/2 my-10 py-4 rounded-lg bg-red-600 text-gray-100 shadow-md shadow-gray-600 text-center">
          {donorCount}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
