import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Tooltip, IconButton } from "@material-tailwind/react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { Typography } from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Select from "react-select";

export function AddBloodBagPopup({ user_id, bledByOptions, venueOptions }) {
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
                        <Select label="Bled by" value={bledBy} onChange={handleBledByChange} options={dynamicBledByOptions} isSearchable required placeholder="Bled By" />
                        {errorMessage.bled_by.length > 0 && <div className="error-message text-red-600 text-sm">{errorMessage.bled_by[0]}</div>}
                    </div>

                    <div className={`relative ${errorMessage.venue.length > 0 ? "mb-1" : ""}`}>
                        <Select label="Venue" value={venue} onChange={handleVenueChange} options={dynamicVenueOptions} isSearchable required placeholder="Venue" />
                        {errorMessage.venue.length > 0 && <div className="error-message text-red-600 text-sm">{errorMessage.venue[0]}</div>}
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

export function EditPopUp({ user, onUpdate, refreshData }) {
    const [open, setOpen] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    const bloodTypes = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];
    const [errorMessage, setErrorMessage] = useState({ email: [], mobile: [], first_name: [], last_name: [], sex: [], blood_type: [], dob: [] });

    const [regionList, setRegionList] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(editedUser.region || ""); 
    const [provinceList, setProvinceList] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(editedUser.province || ""); 
    const [municipalityList, setMunicipalityList] = useState([]);
    const [selectedMunicipality, setSelectedMunicipality] = useState(editedUser.municipality || ""); 
    const [barangayList, setBarangayList] = useState([]);
    const [selectedBarangay, setSelectedBarangay] = useState(editedUser.barangay || ""); 

    const router = useRouter();

    const sexOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' }
    ];

    const bloodTypeOptions = bloodTypes.map(type => ({ value: type, label: type }));

    useEffect(() => {
        axios.get(`${laravelBaseUrl}/api/address/get-regions`).then((data) => {
            setRegionList(data.data);
        });
    }, []);

    useEffect(() => {
        if (selectedRegion?.regCode) {
            axios.post(`${laravelBaseUrl}/api/address/get-provinces?regCode=${selectedRegion?.regCode}`).then((data) => {
                console.log(data.data);
                setProvinceList(data.data);
            });
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedProvince?.provCode) {
            axios.post(`${laravelBaseUrl}/api/address/get-municipalities?provCode=${selectedProvince?.provCode}`).then((data) => {
                console.log(data.data);
                setMunicipalityList(data.data);
            });
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedMunicipality?.citymunCode) {
            axios.post(`${laravelBaseUrl}/api/address/get-barangays?citymunCode=${selectedMunicipality?.citymunCode}`).then((data) => {
                console.log(data.data);
                setBarangayList(data.data);
            });
        }
    }, [selectedMunicipality]);

    useEffect(() => {
        // Initialize the selected values with user data when the component mounts
        setSelectedRegion(editedUser.region);
        setSelectedProvince(editedUser.province);
        setSelectedMunicipality(editedUser.municipality);
        setSelectedBarangay(editedUser.barangay);
    }, [editedUser]);

    console.log('region:', editedUser.region);

    const handleEditUser = async () => {
        try {
            // Prepare data for the PUT request
            const data = {
                ...editedUser,
                user_id: user.user_id,
                region: selectedRegion,
                province: selectedProvince,
                municipality: selectedMunicipality,
                barangay: selectedBarangay,
            };

            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }
            // Send PUT request to update-user API
            const response = await axios.put(`${laravelBaseUrl}/api/edit-user-details`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === "success") {
                refreshData();
                toast.success("User data updated successfully");
                onUpdate({ ...editedUser, ...data });

                setOpen(false);
                router.refresh();
            } else {
                console.error("Error updating user data:", response.data.message);
                toast.error("Error updating user details");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const { errors } = error.response.data;
                const emailErrors = errors.email || [];
                const mobileErrors = errors.mobile || [];
                const first_nameErrors = errors.first_name || [];
                const last_nameErrors = errors.last_name || [];
                const sexErrors = errors.sex || [];
                const blood_typeErrors = errors.blood_type || [];
                const dobErrors = errors.dob || [];
                setErrorMessage({ email: emailErrors, mobile: mobileErrors, first_name: first_nameErrors, last_name: last_nameErrors, sex: sexErrors, blood_type: blood_typeErrors, dob: dobErrors });
            } else {
                setErrorMessage({ email: [error.message], mobile: [error.message] });
            }
            console.error("Error updating user data:", error);
            toast.error(error);
        }
    };

    return (
        <>
            <Tooltip content="Edit User">
                <IconButton variant="text" onClick={() => setOpen(true)}>
                    <PencilIcon className="h-4 w-4" />
                </IconButton>
            </Tooltip>
            <Dialog open={open} handler={() => setOpen(false)}>
                <DialogHeader>Edit User</DialogHeader>
                <DialogBody divider className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-1/2">
                            <label className="text-sm text-gray-600">First Name</label>
                            <Input
                                type="text"
                                value={editedUser.first_name}
                                onChange={(e) => setEditedUser({ ...editedUser, first_name: e.target.value })}
                            />
                            {errorMessage.first_name.length > 0 && (
                                <div className="error-message text-red-600 text-sm">{errorMessage.first_name[0]}</div>
                            )}
                        </div>
                        <div className="w-1/2">
                            <label className="text-sm text-gray-600">Middle Name</label>
                            <Input
                                type="text"
                                value={editedUser.middle_name}
                                onChange={(e) => setEditedUser({ ...editedUser, middle_name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-1/2">
                            <label className="text-sm text-gray-600">Last Name</label>
                            <Input
                                type="text"
                                value={editedUser.last_name}
                                onChange={(e) => setEditedUser({ ...editedUser, last_name: e.target.value })}
                                />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="text-sm text-gray-600">Email</label>
                                        <Input
                                            type="text"
                                            value={editedUser.email}
                                            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                                        />
                                        {errorMessage.email.length > 0 && (
                                            <div className="error-message text-red-600 text-sm">{errorMessage.email[0]}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="w-1/4">
                                        <label className="text-sm text-gray-600">Sex</label>
                                        <Select
                                            options={sexOptions}
                                            value={{ value: editedUser.sex, label: editedUser.sex }}
                                            onChange={value => setEditedUser({ ...editedUser, sex: value.value })}
                                            isSearchable={false}
                                            placeholder="Select Sex"
                                        />
                                        {errorMessage.sex.length > 0 && (
                                            <div className="error-message text-red-600 text-sm">{errorMessage.sex[0]}</div>
                                        )}
                                    </div>
                                    <div className="w-1/4">
                                        <label className="text-sm text-gray-600">Mobile</label>
                                        <Input
                                            type="text"
                                            value={editedUser.mobile}
                                            onChange={(e) => setEditedUser({ ...editedUser, mobile: e.target.value })}
                                        />
                                        {errorMessage.mobile.length > 0 && (
                                            <div className="error-message text-red-600 text-sm">{errorMessage.mobile[0]}</div>
                                        )}
                                    </div>
                                    <div className="w-1/4">
                                        <label className="text-sm text-gray-600">Date of Birth</label>
                                        <Input
                                            type="date"
                                            value={editedUser.dob}
                                            onChange={(e) => setEditedUser({ ...editedUser, dob: e.target.value })}
                                        />
                                        {errorMessage.dob.length > 0 && (
                                            <div className="error-message text-red-600 text-sm">{errorMessage.dob[0]}</div>
                                        )}
                                    </div>
                                    <div className="w-1/4">
                                        <label className="text-sm text-gray-600">Blood Type</label>
                                        <Select
                                            options={bloodTypeOptions}
                                            value={{ value: editedUser.blood_type, label: editedUser.blood_type }}
                                            onChange={value => setEditedUser({ ...editedUser, blood_type: value.value })}
                                            isSearchable={false}
                                            placeholder="Select Blood Type"
                                        />
                                        {errorMessage.blood_type.length > 0 && (
                                            <div className="error-message text-red-600 text-sm">{errorMessage.blood_type[0]}</div>
                                        )}
                                    </div>
                                </div>
            
                                <label className="text-sm text-gray-600">Street</label>
                                <Input
                                    type="text"
                                    value={editedUser.street}
                                    onChange={(e) => setEditedUser({ ...editedUser, street: e.target.value })}
                                />
                                <div className="flex items-center gap-4">
                                    <div className="w-1/2">
                                        <label className="text-sm text-gray-600">Region</label>
                                        <Select
                                        options={regionList.map((region) => ({ value: region.regCode, label: region.regDesc }))}
                                        value={selectedRegion} // Use selectedRegion as the value
                                        onChange={(value) => setSelectedRegion(value)}
                                        isSearchable={true}
                                        placeholder="Select Region"
                                    />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="text-sm text-gray-600">Province</label>
                                        <Select
                                            options={provinceList.map((province) => ({
                                                value: province.provCode,
                                                label: province.provDesc,
                                            }))}
                                            value={{ value: selectedProvince, label: selectedProvince }} 
                                            onChange={(value) => setSelectedProvince(value)}
                                            isSearchable={true}
                                            placeholder="Select Province"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-1/2">
                                        <label className="text-sm text-gray-600">Municipality</label>
                                        <Select
                                            options={municipalityList.map((municipality) => ({
                                                value: municipality.citymunCode,
                                                label: municipality.citymunDesc,
                                            }))}
                                            value={selectedMunicipality}
                                            onChange={(value) => setSelectedMunicipality(value)}
                                            isSearchable={true}
                                            placeholder="Select Municipality"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="text-sm text-gray-600">Barangay</label>
                                        <Select
                                            options={barangayList.map((barangay) => ({
                                                value: barangay.brgyCode,
                                                label: barangay.brgyDesc,
                                            }))}
                                            value={selectedBarangay}
                                            onChange={(value) => setSelectedBarangay(value)}
                                            isSearchable={true}
                                            placeholder="Select Barangay"
                                        />
                                    </div>
                                </div>
                            </DialogBody>
                            <DialogFooter>
                                <Button variant="gradient" onClick={() => setOpen(false)} className="mr-2">
                                    <span>Cancel</span>
                                </Button>
                                <Button variant="gradient" color="red" onClick={handleEditUser}>
                                    <span>Done</span>
                                </Button>
                            </DialogFooter>
                        </Dialog>
                    </>
                );
            }
            

export function ViewPopUp({ user }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Tooltip content="View User">
                <IconButton variant="text" onClick={() => setOpen(true)}>
                    <EyeIcon className="h-4 w-4" />
                </IconButton>
            </Tooltip>
            <Dialog open={open} handler={() => setOpen(false)}>
                <DialogHeader>View User</DialogHeader>
                <DialogBody divider className="flex flex-col gap-4">
                    <Typography className="font-bold text-xs -mb-3 bg-red-400 rounded-md text-white px-2 py-1">NAME</Typography>
                    <div className="flex gap-10 text-gray-900">
                        <Typography>
                            <strong>First Name:</strong>
                            <br />
                            {user.first_name}
                        </Typography>
                        <Typography>
                            <strong>Middle Name:</strong>
                            <br />
                            {user.middle_name ? user.middle_name : "N/A"}
                        </Typography>
                        <Typography>
                            <strong>Last Name:</strong>
                            <br />
                            {user.last_name}
                        </Typography>
                    </div>
                    <Typography className="font-bold text-xs -mb-3 bg-red-400 rounded-md text-white px-2 py-1">Donor Info</Typography>
                    <div className="flex gap-12 text-gray-900">
                        <Typography>
                            <strong>Number of Donation:</strong> {user.donate_qty}
                        </Typography>
                        <Typography>
                            <strong>Badge:</strong> {user.badge}
                        </Typography>
                    </div>
                    <Typography className="font-bold text-xs -mb-3 bg-red-400 rounded-md text-white px-2 py-1">CONTACT INFO</Typography>
                    <div className="flex gap-10 text-gray-900">
                        <Typography>
                            <strong>Email:</strong> {user.email}
                        </Typography>
                        <Typography>
                            <strong>Mobile:</strong> {user.mobile}
                        </Typography>
                    </div>
                    <Typography className="font-bold text-xs -mb-3 bg-red-400 rounded-md text-white px-2 py-1">PERSONAL INFO</Typography>
                    <div className="flex gap-10 text-gray-900">
                        <Typography>
                            <strong>Sex:</strong> {user.sex}
                        </Typography>
                        <Typography>
                            <strong>Date of Birth:</strong> {user.dob}
                        </Typography>
                        <Typography>
                            <strong>Blood Type:</strong> {user.blood_type}
                        </Typography>
                    </div>
                    <Typography className="font-bold text-xs -mb-3 bg-red-400 rounded-md text-white px-2 py-1">ADDRESS</Typography>
                    <Typography className="text-lg text-gray-900 font-medium">
                        {user.street}, {user.barangay}, {user.municipality}, {user.province}, {user.region}
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button variant="gradient" onClick={() => setOpen(false)}>
                        <span>Close</span>
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
