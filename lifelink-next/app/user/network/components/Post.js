import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Checkbox, Typography, List, ListItem, ListItemPrefix, Avatar, Chip, Button  } from "@material-tailwind/react";
import { CheckIcon  } from "@heroicons/react/24/solid";
import { Interested } from "./Popup";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

const formatDate = (donationDate) => {
    const formattedDate = new Date(donationDate).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return formattedDate;
};

export function PostCard() {
    const [adminPosts, setAdminPosts] = useState([]);
    const [interestedBloodRequests, setInterestedBloodRequests] = useState([]);
    const [mySchedule, setMySchedule] = useState([]);
    const fetchAllRequestIds = async () => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("./login");
                return;
            }

            const response = await axios.get(`${laravelBaseUrl}/api/get-admin-post`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAdminPosts(response.data.data);
        } catch (error) {
            console.error("Error fetching user information:", error);
        }
    };

    const fetchAllMyInterest = async () => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("./login");
                return;
            }

            const response = await axios.get(`${laravelBaseUrl}/api/get-my-interest`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === 'success') {
                setInterestedBloodRequests(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching user information:", error);
        }
    };

    const fetchMySchedule = async () => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("./login");
                return;
            }

            const response = await axios.get(`${laravelBaseUrl}/api/get-my-schedule-donation`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === 'success') {
                setMySchedule(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching user information:", error);
        }
    };

    useEffect(() => {
        fetchAllRequestIds();
        fetchAllMyInterest();
        fetchMySchedule();
    }, []);

    const handleInterestedClick = (bloodRequestId) => {
        setRequestId(bloodRequestId);
    };

    const isInterested = (bloodRequestId) => {
        return interestedBloodRequests.includes(bloodRequestId);
    };

    const updateInterestedBloodRequests = (bloodRequestId) => {
        setInterestedBloodRequests([...interestedBloodRequests, bloodRequestId]);
    };

    return (
        <>
            <div className="w-full mb-4 p-4 bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] text-white rounded-lg">
                {mySchedule ? (
                    <>
                        <Typography variant="h6" color="white">
                            Donation Schedule Reminder
                        </Typography>
                        <div className="flex flex-col mt-2">
                            <Typography color="white">You have a scheduled donation on</Typography>
                            <Typography variant="h6" color="white">{formatDate(mySchedule.donation_date)}, on {mySchedule.venue}</Typography>
                            <Typography color="white">Thank you for your commitment to this life-saving cause.</Typography>
                        </div>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" color="white">
                            Donation Schedule Reminder
                        </Typography>
                        <div className="flex flex-col mt-2">
                            <Typography color="white">
                                You currently don't have any upcoming scheduled donations. 
                                Thank you for considering to contribute to this life-saving cause.
                            </Typography>
                        </div>
                    </>
                )}
            </div>
        </>
    );
    
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
}