import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Tooltip, IconButton, Select, Option } from "@material-tailwind/react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { Typography } from "@mui/material";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ArrowRightIcon from "@/public/ArrowRight"
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { AccordionDispense } from "./accordion";

function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
}

export function Revert({ serial_no, refreshData }) {
    const [open, setOpen] = useState(false);
    const [generalErrorMessage, setGeneralErrorMessage] = useState("");
    const router = useRouter();

    const handleRemoveBloodBag = async () => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }

            // Construct the URL with serial_no as a query parameter
            const apiUrl = `${laravelBaseUrl}/api/move-back-to-collected?serial_no=${serial_no}`;

            // Send a POST request to the constructed URL
            const response = await axios.post(
                apiUrl,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status === "success") {
                refreshData();
                toast.success("Return blood bag to collected successfully");
                setOpen(false);
            } else {
                // Handle error case when the API returns an error status
                setGeneralErrorMessage(response.data.message);
            }
        } catch (error) {
            // Handle any other errors, such as network issues or exceptions
            console.error("Error removing blood bag:", error);
            setGeneralErrorMessage("An error occurred while removing the blood bag.");
        }
    };

    return (
        <>
            <Button size="sm" onClick={() => setOpen(true)} className="bg-red-600 mr-4">
                Revert
            </Button>
            <Dialog open={open} handler={() => setOpen(false)}>
                <DialogHeader>Remove Blood Bag</DialogHeader>
                <DialogBody divider className="flex flex-col gap-4 items-center">
                    <Typography className="font-bold text-xl text-red-600 text-center">Are you sure you want to return it to collected?</Typography>
                </DialogBody>
                {generalErrorMessage && (
                    <div className="mt-4 text-center bg-red-100 p-2 rounded-lg">
                        <Typography color="red" className="text-sm font-semibold">
                            {generalErrorMessage}
                        </Typography>
                    </div>
                )}
                <DialogFooter className="flex justify-center mt-4">
                    <Button variant="red-cross" onClick={() => setOpen(false)} className="mr-2">
                        No
                    </Button>
                    <Button variant="red-cross" color="red" onClick={handleRemoveBloodBag}>
                        Yes
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export function Dispense({ serial_no, handleOpen, refreshData }) {
    const [open, setOpen] = useState(false);
    const [generalErrorMessage, setGeneralErrorMessage] = useState("");

    const handleMovetoStock = async () => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const response = await axios
                .post(
                    `${laravelBaseUrl}/api/add-to-inventory`,
                    {
                        serial_no,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .catch((error) => {
                    console.error("Unknown error occurred:", error);
                });

            if (response.data.status === "success") {
                refreshData();
                console.log("Blood bag added successfully");
                toast.success("Blood bag added to inventory successfully");
            } else if (response.data.status === "error") {
                if (response.data.message) {
                    setGeneralErrorMessage(response.data.message);
                } else {
                    console.error("Unknown error occurred:", response.data);
                }
            }
            // Close the dialog
            setOpen(false);
        } catch (error) {
            console.error("Unknown error occurred:", error);
        }
    };

    return (
        <>
            <Button size="sm" onClick={() => setOpen(true)} className="bg-red-600">
                Dispense
            </Button>
            <Dialog open={open} handler={() => setOpen(false)} size="xl">
                <DialogHeader>Move Blood Bag to Inventory</DialogHeader>
                <DialogBody divider className="flex flex-col gap-4 items-center">
									<div className="w-full h-full flex items-start justify-between">
										<AccordionDispense />
										<div className="w-1/3 flex justify-center items-center my-16">
										<ArrowRightIcon width={100} height={100} fill='#dc2626' />
										</div>
										<div className="w-1/3 flex flex-col">
											<div className="w-full flex flex-col items-end">
												<div className="mb-6 flex">
													<Input
														label="Search"
														icon={<MagnifyingGlassIcon className="h-5 w-5" />}
													/>
												</div>
												<div className="flex">
													<div className="flex flex-wrap items-center gap-4 mb-3 mr-3">
														<Typography variant="h6" className="text-red-800 font-semibold">NAME</Typography>
														<Input label="First Name" />
														<Input label="Middle Name" />
														<Input label="Last Name" />
													</div>
													<div className="flex flex-wrap items-center gap-4 mb-3 ml-3">
														<Typography variant="h6" className="text-red-800 font-semibold">INFO</Typography>
														<Input label="Date of Birth" type="date" />
														<Select label="Blood Type">
															<Option>A</Option>
															<Option>B</Option>
														</Select>
														<Select label="Sex">
															<Option>Male</Option>
															<Option>Female</Option>
														</Select>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="flex flex-col gap-y-6">
										<Input label="Diagnosis" />
										<Select label="Hospitals">
											<Option>ValGen</Option>
											<Option>Chinese General</Option>
										</Select>
									</div>
                </DialogBody>
                {generalErrorMessage && (
                    <div className="mt-4 text-center bg-red-100 p-2 rounded-lg">
                        <Typography color="red" className="text-sm font-semibold">
                            {generalErrorMessage}
                        </Typography>
                    </div>
                )}
                <DialogFooter className="flex justify-center mt-4">
                    <Button variant="red-cross" onClick={() => setOpen(false)} className="mr-2">
                        Cancel
                    </Button>
                    <Button variant="red-cross" color="red" onClick={handleMovetoStock}>
                        Confirm
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export function Disposed({ blood_bags_id, refreshData }) {
    const [open, setOpen] = useState(false);
    const [generalErrorMessage, setGeneralErrorMessage] = useState("");
    const router = useRouter();

    console.log("blood_bags_id:", blood_bags_id);

    const handleDisposeBloodBag = async () => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }
            console.log("Token:", token);

            if (!Array.isArray(blood_bags_id)) {
                blood_bags_id = [blood_bags_id]; // Convert to array
            }

            const response = await axios
                .post(
                    `${laravelBaseUrl}/api/dispose-blood`,
                    {
                        blood_bags_id: blood_bags_id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .catch((error) => {
                    console.error("Unknown error occurred:", error);
                });

            if (response.data.status === "success") {
                refreshData();
                toast.success("Removed blood bag successfully");
                console.log("Blood bag disposed successfully");
                setOpen(false);
            } else {
                console.error("Error removing blood bag:", response.data.message);
            }
        } catch (error) {
            console.error("Error removing blood bag:", error);
        }
    };

    return (
        <>
            <Button size="sm" onClick={() => setOpen(true)} className="bg-red-600 mr-4">
                Dispose
            </Button>
            <Dialog open={open} handler={() => setOpen(false)}>
                <DialogHeader>Remove Blood Bag</DialogHeader>
                <DialogBody divider className="flex flex-col gap-4 items-center">
                    <Typography className="font-bold text-xl text-red-600 text-center">Are you sure you want to disposed this blood bag?</Typography>
                </DialogBody>
                {generalErrorMessage && (
                    <div className="mt-4 text-center bg-red-100 p-2 rounded-lg">
                        <Typography color="red" className="text-sm font-semibold">
                            {generalErrorMessage}
                        </Typography>
                    </div>
                )}
                <DialogFooter className="flex justify-center mt-4">
                    <Button variant="red-cross" onClick={() => setOpen(false)} className="mr-2">
                        No
                    </Button>
                    <Button variant="red-cross" color="red" onClick={handleDisposeBloodBag}>
                        Yes
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export function MultipleDisposed({ selectedRows, refreshData }) {
    const [open, setOpen] = useState(false);
    const [generalErrorMessage, setGeneralErrorMessage] = useState("");
    const router = useRouter();
    console.log("blood_bags_id:", selectedRows);

    const handleDisposeBloodBag = async () => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }
            console.log("Token:", token);

            if (!Array.isArray(selectedRows)) {
                blood_bags_id = [selectedRows]; // Convert to array
            }

            const response = await axios
                .post(
                    `${laravelBaseUrl}/api/dispose-blood`,
                    {
                        blood_bags_id: selectedRows,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .catch((error) => {
                    console.error("Unknown error occurred:", error);
                });

            if (response.data.status === "success") {
                refreshData();
                toast.success("Removed blood bag successfully");
                console.log("Blood bag disposed successfully");
                setOpen(false);
            } else {
                console.error("Error removing blood bag:", response.data.message);
            }
        } catch (error) {
            console.error("Error removing blood bag:", error);
        }
    };

    return (
        <>
            <Button variant="contained" color="red" size="sm" className="ml-4" onClick={() => setOpen(true)}>
                Dispose
            </Button>
            <Dialog open={open} handler={() => setOpen(false)}>
                <DialogHeader>Remove Blood Bag</DialogHeader>
                <DialogBody divider className="flex flex-col gap-4 items-center">
                    <Typography className="font-bold text-xl text-red-600 text-center">Are you sure you want to disposed all of this blood bag?</Typography>
                </DialogBody>
                {generalErrorMessage && (
                    <div className="mt-4 text-center bg-red-100 p-2 rounded-lg">
                        <Typography color="red" className="text-sm font-semibold">
                            {generalErrorMessage}
                        </Typography>
                    </div>
                )}
                <DialogFooter className="flex justify-center mt-4">
                    <Button variant="red-cross" onClick={() => setOpen(false)} className="mr-2">
                        No
                    </Button>
                    <Button variant="red-cross" color="red" onClick={handleDisposeBloodBag}>
                        Yes
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
