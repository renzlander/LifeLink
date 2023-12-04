import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { RecentRequest, MakeRequest } from "./NetworkSidebar";

export default function History() {
  const router = useRouter();
  const [bloodRequestHistory, seBlooRequestHistory] = useState([]);
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

        const response = await axios.get(`${laravelBaseUrl}/api/get-requested-blood`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        seBlooRequestHistory(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInfo();
    fetchLatestBloodRequest();
  }, []);

  return (
    <div className="w-full p-4 flex flex-col items-start justify-center gap-4">
      <Typography variant="h4" color="blue-gray" className="ml-2 mb-3">
        All created requests
      </Typography>
      <RecentRequest bloodRequestHistory={bloodRequestHistory} />
    </div>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}