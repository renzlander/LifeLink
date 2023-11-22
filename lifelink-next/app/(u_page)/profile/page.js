'use client'
import React, { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
  Avatar,
  Chip,
  IconButton,
  Tabs,
  TabsHeader,
  Tab,
  Spinner
} from "@material-tailwind/react";
 import { 
    UserIcon,
    TrophyIcon,
    Cog6ToothIcon,
  } from "@heroicons/react/24/solid";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { TabInfo } from "./components/TabInfo";
import { TabAchieve } from "./components/TabAchieve";
import { TabSettings } from "./components/TabSettings";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); 
  const [userDetails, setUserDetails] = useState({});
  const [donationSummary, setDonationSummary] = useState([]);
  const [lastDonation, setLastDonation] = useState([]); 
  const [achievement, setachievement] = useState([]);

  const fetchAchievements = async (page) => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-achievements`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      if (response.data.status === "success") {
        setachievement(response.data); // Set the fetched data in state
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

  const fetchData = async (page) => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      if (response.data.status === "success") {
        setUserDetails(response.data.data); // Set the fetched data in state
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

  const fetchDonorSummary = async () => {
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

  const fetchUserInfo = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("./login");
        return;
      }

      const response = await axios.get(`${laravelBaseUrl}/api/get-day-since-last-donation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLastDonation(response.data);
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDonorSummary();
    fetchUserInfo();
    fetchAchievements();
  }, []);
  
  const TABS = [
    {
      label: "Profile",
      value: "pofile",
      icon: UserIcon,
      content: <TabInfo userDetails={userDetails} donationSummary={donationSummary} lastDonation={lastDonation} />,
    },
    {
      label: "Achievements",
      value: "achieve",
      icon: TrophyIcon,
      content: <TabAchieve userDetails={userDetails} donationSummary={donationSummary} achievement={achievement}/>,
    },
    {
      label: "Profile Settings",
      value: "settings",
      icon: Cog6ToothIcon,
      content: <TabSettings userDetails={userDetails} donationSummary={donationSummary} />,
    },
  ];
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const handleTabChange = (tabValue) => {
      setActiveTab(tabValue);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen max-w-full flex-col py-2 justify-center items-center">
        <Spinner color="red" className="h-16 w-16" />
        <p className="mb-[180px] text-gray-600">Loading...</p>
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen flex flex-col py-4 ">
      <div>
        <div className="w-full h-72 bg-gray-900 rounded-xl shadow-md shadow-gray-500 relative">
          <Image
            src="/lifelink_bg.png"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div className="px-6">
          <Card className="w-full -mt-16">
            <CardBody className="flex md:flex-row flex-col items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-6">
                <Avatar 
                    src="patient_icon.png" 
                    alt="Profile Picture"
                    className="h-20 w-20"
                />
                <div className="flex flex-col items-start">
                  <Typography variant="h5" className="text-blue-gray-800">
                    {userDetails.first_name} {userDetails.last_name}
                  </Typography>
                  <Typography variant="small" className="text-base text-blue-gray-600">
                    {userDetails.email}
                  </Typography>
                </div>
              </div>
              <div className="w-full 2xl:w-4/6">
                <Tabs value="pofile">
                  <TabsHeader>
                    {TABS.map(({ label, value, icon }) => (
                      <Tab key={value} value={value} onClick={() => handleTabChange(value)}>
                        <div className="flex items-center gap-2">
                          {React.createElement(icon, { className: "w-5 h-5" })}
                          <span className="hidden 2xl:block">
                            {label}
                          </span>
                        </div>
                      </Tab>
                    ))}
                  </TabsHeader>
                </Tabs>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="p-6">
        {TABS.find((tab) => tab.value === activeTab)?.content}
      </div>
    </div>
  )
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}