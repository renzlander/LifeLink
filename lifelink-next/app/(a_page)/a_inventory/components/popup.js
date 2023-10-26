import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Card, CardBody, Chip, Tooltip, Select, Option } from "@material-tailwind/react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { Typography } from "@mui/material";
import { DocumentIcon } from "@heroicons/react/24/outline";
import PointRightBlood from "@/public/PointRightBlood";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { AccordionDispense } from "./accordion";
import InputSelect from "@/app/components/InputSelect";

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
            <Button size="sm" onClick={() => setOpen(true)} color="red" variant="gradient">
                Undo
            </Button>
            <Dialog open={open} handler={() => setOpen(false)}>
                <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] text-white font-semibold">Remove Blood Bag</DialogHeader>
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

export function Dispense({ user, blood_bags_id, refreshData, registeredUser }) {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);

    const handleSelect = (selectedOption) => {
        console.log("handleSelect called");
        setSelectedValue(selectedOption);

        const selectedUser = registeredUser.find((user) => user.user_id === selectedOption.value);

        console.log("selectedUser", selectedUser);

        if (selectedUser) {
            setSelectedUserDetails(selectedUser);
        }
    };
    console.log("registeredUser", registeredUser);

    useEffect(() => {
        console.log("selectedUserDetails", selectedUserDetails);
    }, [selectedUserDetails]);

    console.log("selectedUserDetails", selectedUserDetails);

    const bloodType = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const handleOpen = () => setOpen(!open);
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
            <Button onClick={handleOpen} size="sm" color="red" variant="gradient">
                Dispense
            </Button>
            <Dialog open={open} handler={handleOpen} size="lg">
                <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] text-white font-semibold">Dispense Blood</DialogHeader>
              
                <DialogBody className="flex flex-col gap-5 overscroll-y-auto">
                    <div className="flex items-start justify-between">
                        <Card className="border-2 w-1/3">
                            <CardBody>
                                <AccordionDispense user={user} />
                            </CardBody>
                        </Card>
                        <PointRightBlood height={150} width={150} />
                        <Card className="border-2 w-1/2">
                            <CardBody className="flex flex-col items-center justify-center gap-3">
                                <InputSelect
                                    label="search"
                                    value={selectedValue}
                                    onSelect={handleSelect}
                                    options={registeredUser.map((user) => ({
                                        label: `${user.first_name} ${user.middle_name} ${user.last_name}`,
                                        value: user.user_id,
                                    }))}
                                    isSearchable
                                    required
                                    placeholder="Select a user"
                                />

                                <Chip value="Manual" size="sm" className="w-full mt-4 pl-4" />
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex flex-col items-center gap-3">
                                        <Input label="First Name" value={selectedUserDetails ? selectedUserDetails.first_name : ""} />
                                        <Input label="Middle Name" value={selectedUserDetails ? selectedUserDetails.middle_name : ""} />
                                        <Input label="Last Name" value={selectedUserDetails ? selectedUserDetails.last_name : ""} />
                                    </div>
                                    <div className="flex flex-col items-center gap-3">
                                        <Input type="date" label="Date of Birth" value={selectedUserDetails ? selectedUserDetails.dob : ""} />
                                        <Select label="Blood Type">
                                            {bloodType.map((bloodTypes) => (
                                                <Option key={bloodTypes}>{bloodTypes}</Option>
                                            ))}
                                        </Select>
                                        <Select label="Sex">
                                            <Option>Male</Option>
                                            <Option>Female</Option>
                                        </Select>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div>
                        <Card shadow={false}>
                            <CardBody className="flex flex-col items-center justify-center gap-4">
                                <Input label="Diagnosis for transfusion" containerProps={{ className: "w-[50%]" }} />
                                <Select label="Hospital" containerProps={{ className: "w-[50%]" }}>
                                    <Option>ValGen</Option>
                                    <Option>Dalandanan Hospital</Option>
                                </Select>
                            </CardBody>
                        </Card>
                    </div>
                </DialogBody>




                <DialogFooter className="border-t-2">
                    <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="red" onClick={handleOpen}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export function MultipleDispensed({ selectedData, refreshData }) {
    console.log(selectedData);
    const [open, setOpen] = useState(false);
    const bloodType = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const handleOpen = () => setOpen(!open);
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
            <Button onClick={handleOpen} size="sm" color="red" variant="gradient">
                Dispense
            </Button>
            <Dialog open={open} handler={handleOpen} size="lg">
                <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] text-white font-semibold">Dispense Blood</DialogHeader>
                <DialogBody className="flex flex-col gap-5 overscroll-y-auto">
                    <div className="flex items-start justify-between">
                        <Card className="border-2 w-1/3">
                            <CardBody>
                                <AccordionDispense />
                            </CardBody>
                        </Card>
                        <PointRightBlood height={150} width={150} />
                        <Card className="border-2 w-1/2">
                            <CardBody className="flex flex-col items-center justify-center gap-3">
                                <Select label="search">
                                    <Option>Ray Reyes</Option>
                                    <Option>James Robles</Option>
                                </Select>
                                <Chip value="Manual" size="sm" className="w-full mt-4 pl-4" />
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex flex-col items-center gap-3">
                                        <Input label="First Name" />
                                        <Input label="Middle Name" />
                                        <Input label="Last Name" />
                                    </div>
                                    <div className="flex flex-col items-center gap-3">
                                        <Input type="date" label="Date of Birth" />
                                        <Select label="Blood Type">
                                            {bloodType.map((bloodTypes) => (
                                                <Option key={bloodTypes}>{bloodTypes}</Option>
                                            ))}
                                        </Select>
                                        <Select label="Sex">
                                            <Option>Male</Option>
                                            <Option>Female</Option>
                                        </Select>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div>
                        <Card shadow={false}>
                            <CardBody className="flex flex-col items-center justify-center gap-4">
                                <Input label="Diagnosis for transfusion" containerProps={{ className: "w-[50%]" }} />
                                <Select label="Hospital" containerProps={{ className: "w-[50%]" }}>
                                    <Option>ValGen</Option>
                                    <Option>Dalandanan Hospital</Option>
                                </Select>
                            </CardBody>
                        </Card>
                    </div>
                </DialogBody>
                <DialogFooter className="border-t-2">
                    <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleOpen}>
                        <span>Confirm</span>
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
                <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] text-white font-semibold">Dispose Blood Bag</DialogHeader>
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
                <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] text-white font-semibold">Dispose Blood Bag</DialogHeader>
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
