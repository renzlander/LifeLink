import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Checkbox, Typography, List, ListItem, ListItemPrefix, Avatar, Chip, Button  } from "@material-tailwind/react";
import { CheckIcon  } from "@heroicons/react/24/solid";
import { Interested } from "./popup";
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
            <div className="ml-4 mb-4 p-4 bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] text-white rounded-lg">
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
                <Card key={post.blood_request_id} shadow={false} className="p-4 m-4 w-full shadow-md">
                    <CardHeader color="transparent" floated={false} shadow={false} className="mx-0 flex items-center gap-4 pt-0 pb-8">
                        <Avatar size="lg" variant="circular" src="/next.svg" />
                        <div className="flex w-full justify-between gap-0.5">
                            <div className="flex flex-col">
                                <Typography variant="h5" color="blue-gray">
                                    Valenzuela City Philippine Red Cross
                                </Typography>
                                <Typography color="blue-gray">Posted on: {formatDate(post.created_at)}</Typography>
                            </div>
                            <div className="flex flex-col">
                                <Typography color="blue-gray">Donation Date: {formatDate(post.donation_date)}</Typography>
                                <Typography color="blue-gray">Venue : {post.venue}</Typography>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="mb-2 p-0">
                        <Typography color="blue-gray">Blood Type Need : <span>{post.blood_needs}</span></Typography>
                        <Typography className="mt-2">
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


export function FilterCheckBox() {
    const filters = ["Approved", "Pending", "Disapproved"];
    const [checkedStatus, setCheckedStatus] = useState(filters.map(() => true));

    return (
        <Card className="w-full max-w-md">
            <Typography variant="h5" color="blue-gray" className="ml-4 mt-4">
                Filters
            </Typography>
            <List className="flex-row">
                {filters.map((filters, index) => (
                    <ListItem className="p-0" key={filters}>
                        <label htmlFor={`horizontal-list-${filters.toLowerCase()}`} className="flex w-full cursor-pointer items-center px-3 py-2">
                            <ListItemPrefix className="mr-3">
                                <Checkbox
                                    id={`horizontal-list-${filters.toLowerCase()}`}
                                    ripple={false}
                                    className="hover:before:opacity-0"
                                    containerProps={{
                                        className: "p-0",
                                    }}
                                    checked={checkedStatus[index]}
                                    onChange={(event) => {
                                        const updatedCheckedStatus = [...checkedStatus];
                                        updatedCheckedStatus[index] = event.target.checked;
                                        setCheckedStatus(updatedCheckedStatus);
                                    }}
                                />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="font-medium">
                                {filters}
                            </Typography>
                        </label>
                    </ListItem>
                ))}
            </List>
        </Card>
    );
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
}