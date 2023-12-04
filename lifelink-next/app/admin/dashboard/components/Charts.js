import { laravelBaseUrl } from "@/app/variables";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { PresentationChartLineIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

export function LineCard() {
  const [loading, setLoading] = useState(true);
  const [monthCounts, setMonthCounts] = useState({});
  const [lastUpdate, setLastUpdate] = useState("");
  const [time, setTime] = useState("");
  const [timeAgoo, setTimeAgo] = useState("");
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
          const options = { hour: "2-digit", minute: "2-digit", hour12: true };
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
    const hoursAgo = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutesAgo = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (daysAgo > 0) {
      return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
    } else if (hoursAgo > 0) {
      return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
    } else {
      return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
    }
  }

  return (
    <Card className="mt-6 w-1/2">
      <div className="flex">
        <CardHeader
          color="gray"
          variant="gradient"
          className="flex items-center justify-center relative p-4 h-16 w-16"
        >
          <PresentationChartLineIcon className="w-8 h-8 text-white" />
        </CardHeader>
        <div className="mt-1 flex flex-col">
          <Typography variant="h6" className="text-blue-gray-700">
            Line Chart
          </Typography>
          <Typography variant="small" className="text-blue-gray-400">
            Blood bag data insights
          </Typography>
        </div>
      </div>
      <CardBody className="h-96">
          <LineChart data={monthCounts} />
      </CardBody>
      <CardFooter className="border-t flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Typography variant="h5" color="blue-gray" className="w-full">
            Blood Stocks
          </Typography>
          <Select
            onChange={handleBloodChange}
            label="Blood Type"
            value={filterBloodType}
            containerProps={{ className: "min-w-[50px]" }}
          >
            {bloodTypes.map((blood) => (
              <Option key={blood} value={blood}>
                {blood}
              </Option>
            ))}
          </Select>
        </div>
        <Typography>
          Blood bags that have undergone thorough testing and are securely
          stored in the inventory.
        </Typography>
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
  const [lastUpdate, setLastUpdate] = useState("");
  const [time, setTime] = useState("");
  const [timeAgoo, setTimeAgo] = useState("");
  const [filterQuarter, setFilterQuarter] = useState("All");
  const [allBarangays, setAllBarangays] = useState([]);
  const [barangayLabels, setBarangayLabels] = useState({});
  const router = useRouter();

  const quarters = [
    { label: "All", value: "All" },
    { label: "January - March", value: "Q1" },
    { label: "April - June", value: "Q2" },
    { label: "July - September", value: "Q3" },
    { label: "October - December", value: "Q4" },
  ];

  const handleQuarterChange = (selectedQuarter) => {
    setFilterQuarter(selectedQuarter);
  };

  useEffect(() => {

    const getValenzuelaBarangays = async () => {
      try {
        const response = await axios.get(`${laravelBaseUrl}/api/get-valenzuela-barangay`);
        if (response.data.status === "success") {
          return response.data.barangays;
        }
      } catch (error) {
        console.error("Error fetching barangays:", error);
        return [];
      }
    };

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
          const options = { hour: "2-digit", minute: "2-digit", hour12: true };
          const time = date.toLocaleTimeString(undefined, options);
          setTime(time);
          // Create an object with all barangays and default to zero donors
          const allBarangays = [
            "137504001", 
            "137504002",
            "137504003",
            "137504004",
            "137504005",
            "137504006",
            "137504007",
            "137504008",
            "137504009",
            "137504010",
            "137504011",
            "137504012",
            "137504013",
            "137504014",
            "137504015",
            "137504016",
            "137504017",
            "137504018",
            "137504019",
            "137504020",
            "137504021",
            "137504022",
            "137504023",
            "137504024",
            "137504025",
            "137504026",
            "137504027",
            "137504028",
            "137504029",
            "137504030",
            "137504031",
            "137504032",
            "137504033",
          ];
          
          const barangayLabels = {
            "137504001": "Arkong Bato",
            "137504002": "Bagbaguin",
            "137504003": "Balangkas",
            "137504004": "Parada",
            "137504005": "Bignay",
            "137504006": "Bisig",
            "137504007": "Canumay West (Canumay)",
            "137504008": "Karuhatan",
            "137504009": "Coloong",
            "137504010": "Dalandanan",
            "137504011": "Hen. T. De Leon",
            "137504012": "Isla",
            "137504013": "Lawang Bato",
            "137504014": "Lingunan",
            "137504015": "Mabolo",
            "137504016": "Malanday",
            "137504017": "Malinta",
            "137504018": "Mapulang Lupa",
            "137504019": "Marulas",
            "137504020": "Maysan",
            "137504021": "Palasan",
            "137504022": "Pariancillo Villa",
            "137504023": "Paso De Blas",
            "137504024": "Pasolo",
            "137504025": "Poblacion",
            "137504026": "Pulo",
            "137504027": "Punturin",
            "137504028": "Rincon",
            "137504029": "Tagalag",
            "137504030": "Ugong",
            "137504031": "Viente Reales",
            "137504032": "Wawang Pulo",
            "137504033": "Canumay East (Canumay)",

          };
          
          const updatedDonorCount = allBarangays.map((barangay) => {
            const found = donorCounts.find((item) => item.barangay === barangay);
            const label = barangayLabels[barangay] || barangay;
            return found ? { ...found, label } : { barangay, donor_count: 0, label };
          });
          

          setBarangayDonorCount(updatedDonorCount);
          setLastUpdate(lastUpdate);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);}
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
    const hoursAgo = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutesAgo = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (daysAgo > 0) {
      return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
    } else if (hoursAgo > 0) {
      return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
    } else {
      return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
    }
  }

  return (
    <Card className="mt-6 w-1/2">
      <div className="flex">
        <CardHeader
          color="gray"
          variant="gradient"
          className="flex items-center justify-center relative p-4 h-16 w-16"
        >
          <ChartBarIcon className="w-8 h-8 text-white" />
        </CardHeader>
        <div className="mt-1 flex flex-col">
          <Typography variant="h6" className="text-blue-gray-700">
            Bar Chart
          </Typography>
          <Typography variant="small" className="text-blue-gray-400">
            Donors by Barangay insights
          </Typography>
        </div>
      </div>
      <CardBody className="flex flex-col gap-4">
        <BarChart data={barangayDonorCount} />
      </CardBody>
      <CardFooter className="border-t flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Typography variant="h5" color="blue-gray" className="w-full">
            Donors per Barangay
          </Typography>
          <Select
            onChange={handleQuarterChange}
            label="Filter by Quarter"
            value={filterQuarter}
            containerProps={{ className: "min-w-[25px]" }}
          >
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
