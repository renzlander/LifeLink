import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Tooltip, IconButton, Select, Option } from "@material-tailwind/react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { Typography } from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
// import Select from 'react-select';

export function AddBloodBagPopup({ user_id, handleOpen, bledByOptions, venueOptions }) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [bledBy, setBledBy] = useState(""); 
    const [venue, setVenue] = useState("");

    const [dateDonated, setDateDonated] = useState("");
    const [errorMessage, setErrorMessage] = useState({ serial_no: [], date_donated: [], bled_by: [], venue: [] });
    const [generalErrorMessage, setGeneralErrorMessage] = useState("");
    const [part1, setPart1] = useState("");
    const [part2, setPart2] = useState("");
    const [part3, setPart3] = useState("");
    const srNumber = `${part1}${part2}${part3}`;

    const handleBledByChange = (selectedBledBy) => {
        setBledBy(selectedBledBy);
    };
    
    const handleVenueChange = (selectedVenue) => {
        setVenue(selectedVenue);
    };
   
    const dynamicBledByOptions = bledByOptions.map((item) => ({
        label: item.full_name,
        value: item.full_name, 
    }));

    const dynamicVenueOptions = venueOptions.map((item) => ({
        label: item.venues_desc,
        value: item.venues_desc,
    }));

    const handleAddBloodBag = async () => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }

            // Prepare data for the POST request
            const data = {
                user_id,
                serial_no: srNumber,
                bled_by: bledBy.value,
                venue: venue.value,
                date_donated: dateDonated,
            };
            console.log("Before Axios POST request");

            // Send POST request to add-bloodbag API
            const response = await axios
                .post(`${laravelBaseUrl}/api/add-bloodbag`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .catch((error) => {
                    console.error("Unknown error occurred:", error);
                    if (error.response && error.response.data && error.response.data.errors) {
                        const { errors } = error.response.data;
                        const serialNumberError = errors.serial_no || [];
                        const dateError = errors.date_donated || [];
                        const bledByError = errors.bled_by || [];
                        const venueError = errors.venue || [];
                        setErrorMessage({ serial_no: serialNumberError, date_donated: dateError, bled_by: bledByError, venue: venueError });
                    } else {
                        setGeneralErrorMessage(error.response.data.message);
                        toast.error("Opps! Something went wrong.");
                        setErrorMessage({ serial_no: [], date_donated: [], bled_by: [], venue: [] });
                    }
                });

            if (response.data.status === "success") {
                toast.success("Blood bag added successfully");
                console.log("Blood bag added successfully");
            } else if (response.data.status === "error") {
                if (response.data.message) {
                    setGeneralErrorMessage(response.data.message);
                    toast.error("Opps! Something went wrong.");
                } else {
                    console.error("Unknown error occurred:", response.data);
                }
            }
            // Close the dialog
            setOpen(false);
        } catch (error) {
            toast.error(error);
            console.error("Unknown error occurred:", error);
        }
    };
    
    return (
        <>
            <Button size="sm" onClick={() => setOpen(true)} variant="gradient" color="red">
                + Add Blood Bag
            </Button>
            <Dialog open={open} handler={() => setOpen(false)}>
                <DialogHeader>Add Blood Bag</DialogHeader>
                {generalErrorMessage && (
                    <div className="mt-4 text-center bg-red-100 p-2 rounded-lg">
                        <Typography color="red" className="text-sm font-semibold">
                            {generalErrorMessage}
                        </Typography>
                    </div>
                )}
                <DialogBody divider className="flex flex-col gap-6">
                    <div>
                        <div className={`relative flex gap-3 items-center`}>
                            <Input
                                label="XXXX"
                                maxLength={4}
                                value={part1}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (!/^[0-9]*$/.test(newValue)) {
                                        return;
                                    }
                                    setPart1(newValue);
                                }}
                                containerProps={{ className: "min-w-[75px]" }}
                            />
                            <Typography>-</Typography>
                            <Input
                                label="XXXXXX"
                                maxLength={6}
                                value={part2}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (!/^[0-9]*$/.test(newValue)) {
                                        return;
                                    }
                                    setPart2(newValue);
                                }}
                                containerProps={{ className: "min-w-[100px]" }}
                            />
                            <Typography>-</Typography>
                            <Input
                                label="X"
                                maxLength={1}
                                value={part3}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (!/^[0-9]*$/.test(newValue)) {
                                        return;
                                    }
                                    setPart3(newValue);
                                }}
                                containerProps={{ className: "min-w-[25px]" }}
                            />
                        </div>
                        {errorMessage.serial_no.length > 0 && <div className="error-message text-red-600 text-sm mt-1">{errorMessage.serial_no[0]}</div>}
                    </div>

                    <div className={`relative ${errorMessage.bled_by.length > 0 ? "mb-1" : ""}`}>
                    <Select
											label="Bled by"
											value={bledBy}
											onChange={handleBledByChange}
											options={dynamicBledByOptions}
											isSearchable
											required
											placeholder="Bled By" 
                    />
                    {errorMessage.bled_by.length > 0 && (
                        <div className="error-message text-red-600 text-sm">
                        {errorMessage.bled_by[0]}
                        </div>
                    )}
                    </div>

                    <div className={`relative ${errorMessage.venue.length > 0 ? "mb-1" : ""}`}>
                    <Select
											label="Venue"
											value={venue} 
											onChange={handleVenueChange}
											options={dynamicVenueOptions} 
											isSearchable
											required
											placeholder="Venue" 
                    />
                    {errorMessage.venue.length > 0 && (
                        <div className="error-message text-red-600 text-sm">
                        {errorMessage.venue[0]}
                        </div>
                    )}
                    </div>
                    <div className={`relative ${errorMessage.date_donated.length > 0 ? "mb-1" : ""}`}>
                        <Input type="date" label="Date" value={dateDonated} onChange={(e) => setDateDonated(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                        {errorMessage.date_donated.length > 0 && <div className="error-message text-red-600 text-sm">{errorMessage.date_donated[0]}</div>}
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setOpen(false)} className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="red" onClick={handleAddBloodBag}>
                        <span>Add</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
}
