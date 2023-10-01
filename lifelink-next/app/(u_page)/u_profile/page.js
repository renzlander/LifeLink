'use client'
import CardProfile, { CardInfo, CardDisplays } from "./components/cards";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { useRouter } from "next/navigation";
import React, { useState, useEffect} from "react";


export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); 
  const [userDetails, setUserDetails] = useState({});

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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col py-2 gap-y-3">
      <CardProfile userDetails={userDetails}/>
      <div className="flex gap-3">
        <CardInfo userDetails={userDetails}/>
        <CardDisplays />
      </div>
    </div>
  )
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}