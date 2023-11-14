import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardHeader, Typography, Button, CardBody, Tabs, Tab, TabsHeader, Tooltip, Input, Spinner } from "@material-tailwind/react";
import { PostCard } from "./post";
import { SideBar, MakeRequest } from "./networkSidebar";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

export default function Request() {
  const router = useRouter();
  const status = ["All", "Approved", "Pending", "Disapproved"];
  const [userDetails, setUserDetails] = useState(null);
  const [latestBloodRequest, setLatestBloodRequest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("./login");
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserDetails(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    const fetchLatestBloodRequest = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("./login");
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/get-latest-blood-request`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLatestBloodRequest(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInfo();
    fetchLatestBloodRequest();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen max-w-full flex-col py-2 justify-center items-center">
        <Spinner color="red" className="h-16 w-16" />
        <p className="mb-[180px] text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row flex-1">
        <div className="w-1/4">
          <SideBar latestBloodRequest={latestBloodRequest} />
          <MakeRequest userDetails={userDetails} latestBloodRequest={latestBloodRequest} />
        </div>
        <div className="w-3/4 pl-4 h-full">
          <PostCard />
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
