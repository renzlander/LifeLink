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

            console.log(response);
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

            console.log('My Interest', response);

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

            console.log('My schedule', response);

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

            {adminPosts.map((post) => (
                <Card key={post.blood_request_id} shadow={false} className="p-4 w-full shadow-md">
                    <CardHeader color="transparent" floated={false} shadow={false} className="w-full m-0 flex 2xl:flex-row flex-col items-center justify-between">
                        <div className="flex gap-4">
                            <Avatar size="md" variant="circular" src="/prc_logo.png" />
                            <div className="flex flex-col items-start">
                                <Typography variant="h5" color="blue-gray">
                                    Valenzuela City Philippine Red Cross
                                </Typography>
                                <Typography color="blue-gray" variant="small">{formatDate(post.created_at)}</Typography>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="mt-6 p-0">
                        <div className="w-full flex flex-col 2xl:flex-row items-start justify-between">
                            <Typography variant="h6" color="blue-gray">Blood Type Need : <span>{post.blood_needs}</span></Typography>
                            <div className="flex flex-col items-start">
                                <Typography color="blue-gray" variant="h6" className="text-base">
                                    Donation Date: 
                                    <span className="font-medium"> {formatDate(post.donation_date)}</span>
                                </Typography>
                                <Typography color="blue-gray" variant="h6" className="text-base">Venue : <span className="font-medium"> {post.venue}</span></Typography>
                            </div>
                        </div>
                        <Typography color="blue-gray" className="mt-2">
                            {post.body}
                        </Typography>
                        {isInterested(post.blood_request_id) ? (
                            <Button disabled color="green" variant="gradient" className="w-1/8 mt-4">
                                <span className="flex items-center">
                                    Already Interested
                                    <CheckIcon className="h-5 w-5 ml-2" />
                                </span>
                            </Button>
                        ) : (
                            <Interested
                                requestId={post.blood_request_id}
                                onInterestedClick={() => handleInterestedClick(post.blood_request_id)}
                                updateInterestedBloodRequests={updateInterestedBloodRequests}
                                fetchMySchedule={fetchMySchedule}
                            />
                        )}
                    </CardBody>
                </Card>
            ))}
        </>
    );
    
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
}