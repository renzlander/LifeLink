import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Card, CardBody, Chip, Tooltip, Select, Option, Radio } from "@material-tailwind/react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { Typography } from "@mui/material";
import { DocumentIcon } from "@heroicons/react/24/outline";
import PointRightBlood from "@/public/PointRightBlood";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { AccordionDispense, AccordionMultipleDispense } from "./accordion";
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

export function Dispense({ user, refreshData, blood_bags_id, registeredUser }) {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [patientBloodType, setPatientBloodType] = useState("A+");
    const [sex, setSex] = useState("Male");
    const [diagnosis, setDiagnosis] = useState("");
    const [hospital, setHospital] = useState("ValGen");
    const [paymentType, setPaymentType] = useState("");

    const bloodType = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const handleOpen = () => setOpen(!open);

    const handleSelect = (value) => {
        if (value === selectedValue) {
            setSelectedValue(null);
            setSelectedUserDetails(null);
        } else {
            const selectedUser = registeredUser.find((user) => user.user_id === value);
            setSelectedValue(value);
            setSelectedUserDetails(selectedUser);
            if (selectedUser) {
                setFirstName(selectedUser.first_name);
                setMiddleName(selectedUser.middle_name);
                setLastName(selectedUser.last_name);
                setDob(selectedUser.dob);
                setPatientBloodType(selectedUser.blood_type);
                setSex(selectedUser.sex);
            }
        }
    };

    const handleClear = () => {
        setSelectedValue(null);
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setDob("");
        setPatientBloodType("");
        setSex("");
    };

    const handleBloodType = (selectedBloodType) => {
        setPatientBloodType(selectedBloodType);
    };

    const handleSex = (selectedSex) => {
        setSex(selectedSex);
    };

    const handleHospital = (selectedHospital) => {
        setHospital(selectedHospital);
    };

    const handleDispensedBlood = async () => {
        const token = getCookie("token");
        if (!token) {
            router.push("/login");
            return;
        }
        if (!Array.isArray(blood_bags_id)) {
            blood_bags_id = [blood_bags_id];
        }

        const data = {
            user_id: selectedValue,
            blood_bags_id: blood_bags_id,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            dob: dob,
            blood_type: patientBloodType,
            sex: sex,
            diagnosis: diagnosis,
            hospital: hospital,
            payment: paymentType,
        };

        try {
            const response = await axios.post(`${laravelBaseUrl}/api/dispensed-blood`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log(response);

            if (response.data.status === "success") {
                toast.success("Blood dispensed successfully");
                refreshData();
            } else if (response.data.status === "error") {
                if (response.data.message) {
                    setGeneralErrorMessage(response.data.message);
                    toast.error("Oops! Something went wrong.");
                } else {
                    console.error("Unknown error occurred:", response.data);
                }
            }
            // Close the dialog
            setOpen(false);
        } catch (error) {
            toast.error("An error occurred while making the request.");
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
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex flex-col items-center gap-3">
                                        {/* InputSelect component */}
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
                                    </div>
                                    <div>
                                        {/* Clear button */}
                                        <button onClick={handleClear}>Clear</button>
                                    </div>
                                </div>

                                <Chip value="Manual" size="sm" className="w-full mt-4 pl-4" />
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex flex-col items-center gap-3">
                                        <Input label="First Name" value={selectedValue !== null ? selectedUserDetails?.first_name : firstName} disabled={selectedValue !== null} onChange={(e) => setFirstName(e.target.value)} />
                                        <Input label="Middle Name" value={selectedValue !== null ? selectedUserDetails?.middle_name : middleName} disabled={selectedValue !== null} onChange={(e) => setMiddleName(e.target.value)} />
                                        <Input label="Last Name" value={selectedValue !== null ? selectedUserDetails?.last_name : lastName} disabled={selectedValue !== null} onChange={(e) => setLastName(e.target.value)} />
                                    </div>
                                    <div className="flex flex-col items-center gap-3">
                                        <Input type="date" label="Date of Birth" value={selectedValue !== null ? selectedUserDetails?.dob : dob} disabled={selectedValue !== null} onChange={(e) => setDob(e.target.value)} />
                                        <Select label="Blood Type" value={selectedValue !== null ? selectedUserDetails?.blood_type : patientBloodType} disabled={selectedValue !== null} onSelect={handleBloodType}>
                                            {bloodType.map((bloodTypes) => (
                                                <Option key={bloodTypes} value={bloodTypes}>
                                                    {bloodTypes}
                                                </Option>
                                            ))}
                                        </Select>

                                        <Select label="Sex" value={selectedValue !== null ? selectedUserDetails?.sex : sex} disabled={selectedValue !== null} onSelect={handleSex}>
                                            <Option value="Male">Male</Option>
                                            <Option value="Female">Female</Option>
                                        </Select>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div>
                        <Card shadow={false}>
                            <CardBody className="flex flex-col items-center justify-center gap-4">
                                <Input label="Diagnosis for transfusion" containerProps={{ className: "w-[50%]" }} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                                <Select label="Hospital" containerProps={{ className: "w-[50%]" }} value={hospital} onSelect={handleHospital}>
                                    <Option>ValGen</Option>
                                    <Option>Dalandanan Hospital</Option>
                                </Select>
                                <div className="flex gap-10">
                                    <Radio name="type" label="free" color="red" checked={paymentType === "free"} onChange={() => setPaymentType("free")} />
                                    <Radio name="type" label="Discounted" color="red" checked={paymentType === "discounted"} onChange={() => setPaymentType("discounted")} />
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </DialogBody>

                <DialogFooter className="border-t-2">
                    <Button variant="text" color="red" onClick={() => setOpen(false)} className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="red" onClick={handleDispensedBlood}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export function MultipleDispensed({ selectedRows, user, refreshData, registeredUser }) {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [patientBloodType, setPatientBloodType] = useState("A+");
    const [sex, setSex] = useState("Male");
    const [diagnosis, setDiagnosis] = useState("");
    const [hospital, setHospital] = useState("ValGen");
    const [paymentType, setPaymentType] = useState("");
    const bloodType = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const handleOpen = () => setOpen(!open);

    const blood_bags_ids = [];

    user.forEach((userData) => {
        blood_bags_ids.push(userData.blood_bags_id);
    });

    const handleSelect = (value) => {
        if (value === selectedValue) {
            setSelectedValue(null);
            setSelectedUserDetails(null);
        } else {
            const selectedUser = registeredUser.find((user) => user.user_id === value);
            setSelectedValue(value);
            setSelectedUserDetails(selectedUser);
            if (selectedUser) {
                setFirstName(selectedUser.first_name);
                setMiddleName(selectedUser.middle_name);
                setLastName(selectedUser.last_name);
                setDob(selectedUser.dob);
                setPatientBloodType(selectedUser.blood_type);
                setSex(selectedUser.sex);
            }
        }
    };

    const handleClear = () => {
        setSelectedValue(null);
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setDob("");
        setPatientBloodType("");
        setSex("");
    };

    const handleBloodType = (selectedBloodType) => {
        setPatientBloodType(selectedBloodType);
    };

    const handleSex = (selectedSex) => {
        setSex(selectedSex);
    };

    const handleHospital = (selectedHospital) => {
        setHospital(selectedHospital);
    };

    const handleDispensedBlood = async () => {
        const token = getCookie("token");
        if (!token) {
            router.push("/login");
            return;
        }
        // if (!Array.isArray(blood_bags_ids)) {
        //     blood_bags_id = [blood_bags_ids];
        // }

        const data = {
            user_id: selectedValue,
            blood_bags_id: blood_bags_ids,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            dob: dob,
            blood_type: patientBloodType,
            sex: sex,
            diagnosis: diagnosis,
            hospital: hospital,
            payment: paymentType,
        };

        try {
            const response = await axios.post(`${laravelBaseUrl}/api/dispensed-blood`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log(response);

            if (response.data.status === "success") {
                toast.success("Blood dispensed successfully");
                refreshData();
            } else if (response.data.status === "error") {
                if (response.data.message) {
                    setGeneralErrorMessage(response.data.message);
                    toast.error("Oops! Something went wrong.");
                } else {
                    console.error("Unknown error occurred:", response.data);
                }
            }
            // Close the dialog
            setOpen(false);
        } catch (error) {
            toast.error("An error occurred while making the request.");
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
                                {/* <AccordionMultipleDispense user={user} /> */}
                                {user.map((userData, index) => (
                                    <AccordionMultipleDispense key={index} user={userData} />
                                ))}
                            </CardBody>
                        </Card>
                        <PointRightBlood height={150} width={150} />
                        <Card className="border-2 w-1/2">
                            <CardBody className="flex flex-col items-center justify-center gap-3">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex flex-col items-center gap-3">
                                        {/* InputSelect component */}
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
                                    </div>
                                    <div>
                                        {/* Clear button */}
                                        <button onClick={handleClear}>Clear</button>
                                    </div>
                                </div>

                                <Chip value="Manual" size="sm" className="w-full mt-4 pl-4" />
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex flex-col items-center gap-3">
                                        <Input label="First Name" value={selectedValue !== null ? selectedUserDetails?.first_name : firstName} disabled={selectedValue !== null} onChange={(e) => setFirstName(e.target.value)} />
                                        <Input label="Middle Name" value={selectedValue !== null ? selectedUserDetails?.middle_name : middleName} disabled={selectedValue !== null} onChange={(e) => setMiddleName(e.target.value)} />
                                        <Input label="Last Name" value={selectedValue !== null ? selectedUserDetails?.last_name : lastName} disabled={selectedValue !== null} onChange={(e) => setLastName(e.target.value)} />
                                    </div>
                                    <div className="flex flex-col items-center gap-3">
                                        <Input type="date" label="Date of Birth" value={selectedValue !== null ? selectedUserDetails?.dob : dob} disabled={selectedValue !== null} onChange={(e) => setDob(e.target.value)} />
                                        <Select label="Blood Type" value={selectedValue !== null ? selectedUserDetails?.blood_type : patientBloodType} disabled={selectedValue !== null} onSelect={handleBloodType}>
                                            {bloodType.map((bloodTypes) => (
                                                <Option key={bloodTypes} value={bloodTypes}>
                                                    {bloodTypes}
                                                </Option>
                                            ))}
                                        </Select>

                                        <Select label="Sex" value={selectedValue !== null ? selectedUserDetails?.sex : sex} disabled={selectedValue !== null} onSelect={handleSex}>
                                            <Option value="Male">Male</Option>
                                            <Option value="Female">Female</Option>
                                        </Select>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div>
                        <Card shadow={false}>
                            <CardBody className="flex flex-col items-center justify-center gap-4">
                                <Input label="Diagnosis for transfusion" containerProps={{ className: "w-[50%]" }} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                                <Select label="Hospital" containerProps={{ className: "w-[50%]" }} value={hospital} onSelect={handleHospital}>
                                    <Option>ValGen</Option>
                                    <Option>Dalandanan Hospital</Option>
                                </Select>
                                <div className="flex gap-10">
                                    <Radio name="type" label="free" color="red" checked={paymentType === "free"} onChange={() => setPaymentType("free")} />
                                    <Radio name="type" label="Discounted" color="red" checked={paymentType === "discounted"} onChange={() => setPaymentType("discounted")} />
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </DialogBody>

                <DialogFooter className="border-t-2">
                    <Button variant="text" color="red" onClick={() => setOpen(false)} className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="red" onClick={handleDispensedBlood}>
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
