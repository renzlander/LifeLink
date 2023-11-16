"use client";
import React, { useEffect, useState } from "react";
import { PostCard } from "./components/post";
import { Card, CardHeader, CardBody, Typography, } from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { laravelBaseUrl } from "@/app/variables";
import { FilterCheckBox } from "./components/Filters";

export default function Home() {
    const [bloodRequests, setLatestBloodRequests] = useState([]);
    const router = useRouter();

    const fetchBloodRequest = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("./login");
          return;
        }
  
        const response = await axios.get(`${laravelBaseUrl}/api/get-blood-request`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setLatestBloodRequests(response.data.data);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
  
    useEffect(() => {
      fetchBloodRequest();
    }, []);
    return (
        <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between p-12">
            <Card className="h-full w-full mt-4 bg-gray-100">
                <CardHeader color="red" className="relative h-16 flex items-center">
                    <Typography variant="h4" color="white" className="ml-4">
                        Blood Network
                    </Typography>
                </CardHeader>
                <CardHeader floated={false} shadow={false} color="transparent" className="mb-4">
                    <FilterCheckBox />
                </CardHeader>
                <CardBody className="overflow-y-auto px-0 grid gap-4 max-h-[90vh]">
                    <PostCard bloodRequests={bloodRequests} fetchBloodRequest={fetchBloodRequest} />
                </CardBody>
            </Card>
        </div>
    );
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
}