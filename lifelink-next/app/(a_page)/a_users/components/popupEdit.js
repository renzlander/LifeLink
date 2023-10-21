import React, { useEffect, useState } from "react";
import { 
    Typography,
    Button, 
    Dialog, 
    DialogHeader, 
    DialogBody, 
    DialogFooter, 
    Input, 
    Tooltip, 
    IconButton, 
    Select, 
    Option 
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import InputSelect from "@/app/components/InputSelect";

const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    // ... other options
];

export function EditPopUp({ user, onUpdate, refreshData }) {
    const [open, setOpen] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    const bloodTypes = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];
    const [errorMessage, setErrorMessage] = useState({ email: [], mobile: [], first_name: [], last_name: [], sex: [], blood_type: [], dob: [] });

    const [regionList, setRegionList] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [provinceList, setProvinceList] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [municipalityList, setMunicipalityList] = useState([]);
    const [selectedMunicipality, setSelectedMunicipality] = useState("");
    const [barangayList, setBarangayList] = useState([]);
    const [selectedBarangay, setSelectedBarangay] = useState("");

    const router = useRouter();

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
                // User data updated successfully
                refreshData();
                toast.success("User data updated successfully");
                // Notify the parent component about the update
                onUpdate({ ...editedUser, ...data }); // Merge the edited data with the response data

                // Close the dialog
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

    const handleSelect = (value) => {
        console.log('Selected option:', value);
        // Do something with the selected option value, e.g., set it in state
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
                <DialogBody divider className="flex flex-col gap-6 overscroll-y-auto">
                    <div className="flex items-center gap-2">
                        <Input 
                            type="text" 
                            label="First Name" 
                            value={editedUser.first_name} 
                            onChange={(e) => setEditedUser({ ...editedUser, first_name: e.target.value })} 
                            containerProps={{ className: "min-w-[50px]" }} 
                        />
                        {errorMessage.first_name.length > 0 && <div className="error-message text-red-600 text-sm">{errorMessage.first_name[0]}</div>}

                        <Input 
                            type="text" 
                            label="Middle Name" 
                            value={editedUser.middle_name} 
                            onChange={(e) => setEditedUser({ ...editedUser, middle_name: e.target.value })} 
                            containerProps={{ className: "min-w-[50px]" }} 
                        />
                        <Input 
                            type="text" 
                            label="Last Name" 
                            value={editedUser.last_name} 
                            onChange={(e) => setEditedUser({ ...editedUser, last_name: e.target.value })} 
                            containerProps={{ className: "min-w-[50px]" }}
                            error={errorMessage.last_name.length > 0}
                            required
                        />
                            {/* {errorMessage.last_name.length > 0 && <Typography variant="small" color="gray" className="mt-2 flex items-center gap-1 font-normal">{errorMessage.last_name[0]}</Typography>} */}
                    </div>
                    <div className="flex items-center gap-2">
                        <Input 
                            type="text" 
                            label="Email" 
                            value={editedUser.email} 
                            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })} 
                        />
                        {errorMessage.email.length > 0 && <div className="error-message text-red-600 text-sm">{errorMessage.email[0]}</div>}
                        <Input 
													type="text" 
													label="Mobile" 
													value={editedUser.mobile} 
													onChange={(e) => setEditedUser({ ...editedUser, mobile: e.target.value })} 
												/>
                        {errorMessage.mobile.length > 0 && <div className="error-message text-red-600 text-sm">{errorMessage.mobile[0]}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                        <Select label="Sex" value={editedUser.sex} onChange={(value) => setEditedUser({ ...editedUser, sex: value })} containerProps={{ className: "min-w-[50px]" }}>
                            <Option value="Male">Male</Option>
                            <Option value="Female">Female</Option>
                        </Select>
                        {errorMessage.sex.length > 0 && <div className="error-message text-red-600 text-sm">{errorMessage.sex[0]}</div>}
                        <Input 
													type="date" 
													label="Date of Birth" 
													value={editedUser.dob} 
													onChange={(e) => setEditedUser({ ...editedUser, dob: e.target.value })} containerProps={{ className: "min-w-[50px]" }} 
												/>
                        {errorMessage.dob.length > 0 && <div className="error-message text-red-600 text-sm">{errorMessage.dob[0]}</div>}

                        <Select label="Blood Type" value={editedUser.blood_type} onChange={(value) => setEditedUser({ ...editedUser, blood_type: value })} containerProps={{ className: "min-w-[50px]" }}>
                            {bloodTypes.map((type) => (
                                <Option key={type} value={type}>
                                    {type}
                                </Option>
                            ))}
                        </Select>
                        {errorMessage.blood_type.length > 0 && <div className="error-message text-red-600 text-sm">{errorMessage.blood_type[0]}</div>}

                    </div>
                    <Input 
											type="text"
											label="Street" 
											value={editedUser.street} 
											onChange={(e) => setEditedUser({ ...editedUser, street: e.target.value })} 
										/>
                    <div className="flex items-center gap-2">
                        <InputSelect 
													label="Region" 
													options={options} 
													onSelect={handleSelect} 
												/>
                        <Select label="Province" value={selectedProvince} onChange={(value) => setSelectedProvince(value)}>
                            {provinceList.map((province) => (
                                <Option key={province.provCode} value={province.provCode}>
                                    {province.provDesc}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select label="Municipality" value={selectedMunicipality} onChange={(value) => setSelectedMunicipality(value)}>
                            {municipalityList.map((municipality) => (
                                <Option key={municipality.citymunCode} value={municipality.citymunCode}>
                                    {municipality.citymunDesc}
                                </Option>
                            ))}
                        </Select>
                        <Select label="Barangay" value={selectedBarangay} onChange={(value) => setSelectedBarangay(value)}>
                            {barangayList.map((barangay) => (
                                <Option key={barangay.brgyCode} value={barangay.brgyCode}>
                                    {barangay.brgyDesc}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="gradient" onClick={() => setOpen(false)} className="mr-1">
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

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
}