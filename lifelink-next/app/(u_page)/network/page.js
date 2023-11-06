"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardHeader, Typography, Button, CardBody, Chip, CardFooter, Avatar, IconButton, Tooltip, Input, Spinner } from "@material-tailwind/react";
import { PostCard, FilterCheckBox } from "./components/post";
import { SideBar, MakeRequest } from "./components/networkSidebar";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

export default function Home() {
    const router = useRouter();
    const bloodTypes = ["All", "Approved", "Pending", "Disapproved"];
    const [userDetails, setUserDetails] = useState(null);
    const [latestBloodRequest, setLatestBloodRequest] = useState([]);

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
  
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      };
  
      fetchUserInfo();
      fetchLatestBloodRequest();
    }, [latestBloodRequest]);
  
    return (
        <Card className="w-full mt-8">
            <CardHeader color="red" className="relative h-16 flex items-center">
                <Typography variant="h4" color="white" className="ml-4">
                    Blood Network
                </Typography>
            </CardHeader>
            <CardBody className="overflow-x-auto px-4">
                <div className="flex flex-col min-h-screen">
                    <div className="flex flex-row flex-1 bg-gray-100 rounded-xl shadow-xl">
                        <div className="w-1/4 h-full">
                            <SideBar latestBloodRequest={latestBloodRequest}/>
                            <MakeRequest userDetails={userDetails} latestBloodRequest={latestBloodRequest}/>

                            <Button variant="gradient" className="w-full my-4">
                                  <span>View Request History</span>
                          </Button>
                        </div>
                        <div className="w-3/4 pl-4 h-full">
                            <PostCard />
                        </div>
                    </div>
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
