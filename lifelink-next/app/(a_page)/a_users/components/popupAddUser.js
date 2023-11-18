import React, { useRef, useEffect, useState } from "react";
import { Button, Tooltip, IconButton, Select, Option, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Checkbox, Spinner } from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import InputSelect from "@/app/components/InputSelect";

export function AddUsers({ refreshData }) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [middle_name, setMiddleName] = useState("");
    const [sex, setSex] = useState("");
    const [blood_type, setBlood] = useState("");
    const [street, setStreet] = useState("");
    const [postalcode, setPostalCode] = useState("");
    const [occupation, setOccupation] = useState("");
    const [dob, setDob] = useState("");
    const [errorMessage, setErrorMessage] = useState({ dob: [], email: [], mobile: [] });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const bloodTypes = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

    const [regionList, setRegionList] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState({
        regionName: "Region",
    });

    const [provinceList, setProvinceList] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState({
        provinceName: "Province",
    });

    const [municipalityList, setMunicipalityList] = useState([]);
    const [selectedMunicipality, setSelectedMunicipality] = useState({
        municipalityName: "Municipality",
    });

    const [barangayList, setBarangayList] = useState([]);
    const [selectedBarangay, setSelectedBarangay] = useState({
        barangayName: "Barangay",
    });

    useEffect(() => {
        axios.get(`${laravelBaseUrl}/api/address/get-regions`).then((data) => {
            console.log(data.data);
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

    const handleSexChange = (selectedSex) => {
        setSex(selectedSex);
    };

    const handleBloodChange = (selectedBlood) => {
        setBlood(selectedBlood);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("sex", sex);
        try {
            setIsSubmitting(true);

            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }
          
            
            const response = await axios.post(
                `${laravelBaseUrl}/api/add-user`,
                {
                    email,
                    mobile: `0${mobile}`,
                    first_name,
                    middle_name,
                    last_name,
                    sex,
                    dob,
                    occupation,
                    blood_type,
                    street,
                    region: selectedRegion?.regionName,
                    province: selectedProvince?.provinceName,
                    municipality: selectedMunicipality?.municipalityName,
                    barangay: selectedBarangay?.barangayName,
                    postalcode,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);
            if (response.data.status === "success") {
                toast.success(response.data.message);
                setOpen(false);
                refreshData();
            }
            console.log(response);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const { errors } = error.response.data;
                const emailErrors = errors.email || [];
                const mobileErrors = errors.mobile || [];
                const dobErrors = errors.dob || [];
                setErrorMessage({ dob: dobErrors, email: emailErrors, mobile: mobileErrors });
            } else {
                setErrorMessage({ dob: [error.message], email: [error.message], mobile: [error.message] });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        first_name !== "" &&
        middle_name !== "" &&
        last_name !== "" &&
        occupation !== "" &&
        street !== "" &&
        postalcode !== "" &&
        sex !== "" &&
        blood_type !== "" &&
        selectedRegion.regionName !== "Region" &&
        selectedProvince.provinceName !== "Province" &&
        selectedMunicipality.municipalityName !== "Municipality" &&
        selectedBarangay.barangayName !== "Barangay" &&
        dob !== "";

        const handleMobileNumberChange = (e) => {
            let inputValue = e.target.value;
          
            // Remove non-numeric characters
            inputValue = inputValue.replace(/[^0-9]/g, "");
          
            // Ensure the first digit is 9 and limit the length to 10 digits
            const sanitizedValue = inputValue.startsWith("9") ? inputValue.slice(0, 10) : inputValue.slice(0, 9);
          
            // If the first digit is not 9, reset the input to an empty string
            if (inputValue.length > 0 && inputValue[0] !== "9") {
              setMobile("");
            } else {
              setMobile(sanitizedValue);
            }
          };
          

    return (
        <>
            <Tooltip content="Add Users">
                <Button size="sm" onClick={() => setOpen(true)} variant="gradient" color="red" className="flex items-center gap-2">
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Users</span>
                </Button>
            </Tooltip>
            <Dialog open={open} handler={() => setOpen(false)}>
                <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] rounded-t-md text-white font-semibold">Register User</DialogHeader>
                <DialogBody divider className="flex flex-col gap-6 overscroll-y-auto">
                    <form onSubmit={handleSubmit} className="mt-8 mb-2 max-w-screen-lg sm:w-full">
                        <input type="hidden" value={dob} name="dob" />
                        <div className="mb-4 flex grow gap-6">
                            <div className={`relative w-full ${errorMessage.email.length > 0 ? "mb-1" : ""}`}>
                                <Input
                                    size="lg"
                                    label="Email"
                                    value={email}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        setEmail(inputValue);

                                        // Email validation regex pattern
                                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                                        // Validate email format
                                        if (!emailPattern.test(inputValue)) {
                                            setErrorMessage((prevErrors) => ({
                                                ...prevErrors,
                                                email: ["Invalid email format"],
                                            }));
                                        } else {
                                            setErrorMessage((prevErrors) => ({
                                                ...prevErrors,
                                                email: [],
                                            }));
                                        }
                                    }}
                                    required
                                />
                                {errorMessage.email.length > 0 && <div className="error-message text-red-600 text-sm">{errorMessage.email[0]}</div>}
                            </div>
                            <div className={`relative ${errorMessage.mobile.length > 0 ? "mb-1" : ""}`}>
                                <div className="flex items-center">
                                    <span className="mr-2">+63</span>
                                    <Input type="tel" placeholder="Mobile Number" value={mobile} onChange={handleMobileNumberChange} className="w-full" />
                                </div>
                                {errorMessage.mobile.length > 0 && <div className="error-message text-red-600 text-sm">{errorMessage.mobile[0]}</div>}
                            </div>
                        </div>
                        <div className="mb-4 flex gap-6 lg:flex-row sm:flex-col">
                            <Input
                                size="lg"
                                label="First Name"
                                required
                                value={first_name}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (!/^[A-Za-z\s]*$/.test(newValue)) {
                                        return;
                                    }
                                    setFirstName(newValue);
                                }}
                            />
                            <Input
                                size="lg"
                                label="Middle Name"
                                required
                                value={middle_name}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (!/^[A-Za-z\s]*$/.test(newValue)) {
                                        return;
                                    }
                                    setMiddleName(newValue);
                                }}
                            />
                            <Input
                                size="lg"
                                label="Last Name"
                                required
                                value={last_name}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (!/^[A-Za-z\s]*$/.test(newValue)) {
                                        return;
                                    }
                                    setLastName(newValue);
                                }}
                            />
                        </div>
                        <div className="mb-4 flex grow gap-6">
                            <Input
                                size="lg"
                                label="Occupation"
                                required
                                value={occupation}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (!/^[A-Za-z0-9\s,.]*$/.test(newValue)) {
                                        return;
                                    }
                                    setOccupation(newValue);
                                }}
                            />
                            <div className={`relative ${errorMessage.dob.length > 0 ? "mb-1" : ""}`}>
                                <Input type="date" size="lg" label="Birthdate" required value={dob} onChange={(e) => setDob(e.target.value)} className={`w-full ${errorMessage.dob.length > 0 ? "border-red-500" : ""}`} />
                                {errorMessage.dob.length > 0 && <div className="error-message text-red-600 text-sm">{errorMessage.dob[0]}</div>}
                            </div>
                        </div>
                        <div className="mb-4 flex grow gap-6">
                            <Select onChange={handleSexChange} label="Sex" value={sex} required>
                                <Option value="Male">Male</Option>
                                <Option value="Female">Female</Option>
                            </Select>

                            <Select onChange={handleBloodChange} label="Blood Type" value={blood_type} required>
                                {bloodTypes.map((blood) => (
                                    <Option key={blood} value={blood}>
                                        {blood}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className="mb-4 flex grow gap-6">
                            <Select label="Region" required name={selectedRegion?.regionName}>
                                {regionList?.map((region) => (
                                    <Option
                                        key={region.id} // Add a unique key prop here
                                        onClick={() => {
                                            setSelectedRegion({
                                                regionName: region?.regDesc,
                                                regCode: region?.regCode,
                                            });
                                        }}
                                    >
                                        {region?.regDesc}
                                    </Option>
                                ))}
                            </Select>
                            <Select label="Province" required noListMessage="Please select a region first" name={selectedProvince?.provinceName} data={provinceList}>
                                {provinceList?.map((province) => (
                                    <Option
                                        key={province.id} // Add a unique key prop here
                                        onClick={() => {
                                            setSelectedProvince({
                                                provinceName: province?.provDesc,
                                                provCode: province?.provCode,
                                                id: province?.id,
                                            });
                                        }}
                                    >
                                        {province?.provDesc}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className="mb-4 flex grow gap-6">
                            <Select label="Municipality" required name={selectedMunicipality?.municipalityName} data={municipalityList}>
                                {municipalityList?.map((municipality) => (
                                    <Option
                                        key={`city${municipality?.citymunCode}`} // Add a unique key prop here
                                        onClick={() => {
                                            setSelectedMunicipality({
                                                municipalityName: municipality?.citymunDesc,
                                                citymunCode: municipality?.citymunCode,
                                            });
                                        }}
                                    >
                                        {municipality?.citymunDesc}
                                    </Option>
                                ))}
                            </Select>
                            <Select label="Barangay" required name={selectedBarangay?.barangayName} data={barangayList}>
                                {barangayList
                                    ?.sort((a, b) => a.brgyDesc.localeCompare(b.brgyDesc))
                                    .map((barangay) => (
                                        <Option
                                            key={`brngy${barangay.id}`} // Add a unique key prop here
                                            onClick={() => {
                                                setSelectedBarangay({
                                                    barangayName: barangay?.brgyDesc,
                                                });
                                            }}
                                        >
                                            {barangay?.brgyDesc}
                                        </Option>
                                    ))}
                            </Select>
                        </div>
                        <div className="mb-4 flex grow gap-6">
                            <Input
                                size="lg"
                                label="Street"
                                required
                                value={street}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (!/^[A-Za-z0-9\s,.]*$/.test(newValue)) {
                                        return;
                                    }
                                    setStreet(newValue);
                                }}
                            />
                            <Input
                                size="lg"
                                label="Zip Code"
                                required
                                value={postalcode}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (!/^[0-9]*$/.test(newValue)) {
                                        return;
                                    }
                                    setPostalCode(newValue);
                                }}
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button type="submit" variant="contained" className="w-full flex items-center justify-center gap-5" disabled={!isFormValid || isSubmitting}>
                                {isSubmitting ? <Spinner size="sm" /> : ""}
                                Register
                            </Button>
                        </div>
                    </form>
                </DialogBody>
                <DialogFooter>
                    <Button variant="gradient" onClick={() => setOpen(false)} className="mr-1">
                        <span>Cancel</span>
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
