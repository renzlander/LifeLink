import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { PencilIcon, UserPlusIcon, MagnifyingGlassIcon, DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Input, Typography, Button, CardBody, CardFooter, Select, Option, Spinner, IconButton } from "@material-tailwind/react";
import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import { parseISO, differenceInYears } from "date-fns";
import { ViewPopUp } from "./popupView";

const TABLE_HEAD = [
    { label: "Dispensed Date", key: "dispensed_date" },
    { label: "Full Name", key: "full_name" },
    { label: "Blood Type", key: "blood_type" },
    { label: "Age", key: "dob" },
    { label: "Sex", key: "sex" },
    { label: "Diagnosis", key: "diagnosis" },
    { label: "Hospital", key: "hospital" },
    { label: "Payment", key: "payment" },
    { label: "" },
];

const classes = "p-4";

function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
}

export function DispenseTable() {
    const [userDetails, setUserDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const [blood_type, setBlood] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [bloodQty, setBloodQty] = useState();
    const [selectedRows, setSelectedRows] = useState([]);
    const [hospitalOptions, setHospitalOptions] = useState([]);
    const [hospital, setHospital] = useState("All");
    const [payment, setPayment] = useState("All");
    const router = useRouter();

    const bloodTypes = ["All", "AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];
    const paymentTypes = ["All", "Free", "Discounted"];

    const calculateAge = (dateOfBirth) => {
        const dobDate = parseISO(dateOfBirth);
        const currentDate = new Date();
        return differenceInYears(currentDate, dobDate);
    };

    const dynamicHospitalOptions = [
        {
            label: "All",
            value: "All",
        },
        ...hospitalOptions.map((item) => ({
            label: item.hospital_desc,
            value: item.hospital_desc,
        })),
    ];

    const getHospitalList = async () => {
        try {
            const response = await axios.get(`${laravelBaseUrl}/api/get-hospitals`, {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                },
            });
            if (response.data.status === "success") {
                setHospitalOptions(response.data.hospitals);
            }
        } catch (error) {
            console.error("Unknown error occurred:", error);
        }
    };

    const handleBloodChange = (selectedBlood) => {
        setBlood(selectedBlood);
        fetchBloodTypeFilteredData(selectedBlood, hospital, payment, startDate, endDate);
    };
    const handlePaymentChange = (selectedPayment) => {
        setPayment(selectedPayment);
        fetchBloodTypeFilteredData(blood_type, hospital, selectedPayment, startDate, endDate);
    };
    const handleHospital = (selectedHospital) => {
        setHospital(selectedHospital);
        fetchBloodTypeFilteredData(blood_type, selectedHospital, payment, startDate, endDate); // Pass the selected remarks here
    };

    const fetchBloodTypeFilteredData = async (blood_type, hospital, payment, startDate, endDate) => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const response = await axios.post(
                `${laravelBaseUrl}/api/dispList`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        blood_type: blood_type,
                        hospital: hospital,
                        payment: payment, // Use the selected payment
                        startDate: startDate,
                        endDate: endDate,
                    },
                }
            );

            console.log(response);
            if (response.data.status === "success") {
                setUserDetails(response.data.data.data);
                setBloodQty(response.data.total_count);
                setTotalPages(response.data.data.last_page);
                setCurrentPage(response.data.total_count);
                setLoading(false);
            } else {
                console.error("Error fetching data:", response.data.message);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const fetchData = async (page = "") => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }

            let response;
  
            const params = {
                page: page,
                sort: sortColumn,
                order: sortOrder,
            };

            if (searchQuery) {
                response = await axios.post(
                    `${laravelBaseUrl}/api/search-patient`,
                    {
                        searchInput: searchQuery,
                        ...params,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                response = await axios.get(`${laravelBaseUrl}/api/get-dispensed-list`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: params,
                });
            }

            if (response.data.status === "success") {
                setUserDetails(response.data.data.data);
                setTotalPages(response.data.data.last_page);
                setCurrentPage(response.data.data.current_page);
                setBloodQty(response.data.total_count);
                setLoading(false);
            } else {
                console.error("Error fetching data:", response.data.message);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getHospitalList(); // Fetch hospital options

        // Initial data fetch with default values
        fetchBloodTypeFilteredData("All", "All", "All", "", "");
    }, [router, sortColumn, sortOrder, searchQuery]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) {
            return;
        }

        setCurrentPage(newPage);
        fetchBloodTypeFilteredData(blood_type, hospital, payment, startDate, endDate, newPage);
    };

    const handleSort = (columnKey) => {
        // If the same column is clicked, toggle the sort order
        if (sortColumn === columnKey) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnKey);
            setSortOrder("asc");
        }
    };

    const exportBloodBagsAsPDF = async () => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }

            // Send a request to the PDF export endpoint
            const response = await axios.get(`${laravelBaseUrl}/api/export-patient-list`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
              responseType: "blob",
              params: {
                  blood_type: blood_type,
                  payment: payment,
                  hospital: hospital,
                  startDate: startDate,
                  endDate: endDate,
              },
          });

            const pdfBlob = new Blob([response.data], { type: "application/pdf" });
            const pdfUrl = window.URL.createObjectURL(pdfBlob);
            window.open(pdfUrl);
            window.URL.revokeObjectURL(pdfUrl);
        } catch (error) {
            console.error("Error exporting PDF:", error);
        }
    };

    const sortedBloodBagDetails = userDetails.sort((a, b) => {
        const columnA = sortColumn === "full_name" ? `${a.first_name} ${a.last_name}` : a[sortColumn];
        const columnB = sortColumn === "full_name" ? `${b.first_name} ${b.last_name}` : b[sortColumn];

        if (sortOrder === "asc") {
            if (columnA < columnB) return -1;
            if (columnA > columnB) return 1;
        } else {
            if (columnA < columnB) return 1;
            if (columnA > columnB) return -1;
        }

        return 0;
    });

    if (loading) {
        return (
            <div className="flex min-h-screen max-w-full flex-col py-2 justify-center items-center">
                <Spinner color="red" className="h-16 w-16" />
                <p className="mb-[180px] text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <Card className="w-full">
            <CardBody>
                <div className="flex items-center justify-between px-4 mb-4">
                    <div className="">
                        <Typography variant="subtitle1" className="mb-2 flex justify-center font-bold text-red-800">
                            No. of Patients:{bloodQty}
                        </Typography>
                        <div className="flex items-center gap-4">
                            <Select onChange={handleBloodChange} label="Blood Type" value={blood_type}>
                                {bloodTypes.map((blood) => (
                                    <Option key={blood} value={blood}>
                                        {blood}
                                    </Option>
                                ))}
                            </Select>
                            <Select onChange={handlePaymentChange} label="Payment" value={payment}>
                                {paymentTypes.map((payment) => (
                                    <Option key={payment} value={payment}>
                                        {payment}
                                    </Option>
                                ))}
                            </Select>
                            <InputSelect label="Hospital" containerProps={{ className: "w-[50%]" }} value={hospital} onSelect={handleHospital} options={dynamicHospitalOptions} isSearchable required placeholder="Hospital" />
                        </div>
                    </div>
                    <div>
                        <Typography variant="subtitle1" className="mb-2 flex justify-center font-bold text-red-800">
                            Dispensed Date Filter
                        </Typography>
                        <div className="flex items-center gap-4">
                            <Input
                                type="date"
                                label="Start Date"
                                value={startDate}
                                onChange={(e) => {
                                    const newStartDate = e.target.value;
                                    setStartDate(newStartDate);
                                    console.log("newStartDate", newStartDate);
                                    fetchBloodTypeFilteredData(blood_type, hospital, payment, newStartDate, endDate);
                                }}
                                className=""
                            />
                            <Typography> to </Typography>
                            <Input
                                type="date"
                                label="End Date"
                                value={endDate}
                                onChange={(e) => {
                                    const newEndDate = e.target.value;
                                    setEndDate(newEndDate);
                                    fetchBloodTypeFilteredData(blood_type, hospital, payment, startDate, newEndDate);
                                }}
                                className=""
                            />
                        </div>
                    </div>
                    <div>
                        <Typography variant="subtitle1" className="mb-2 flex justify-center font-bold text-red-800" >
                            {/* Other Tools  */}
                        </Typography>
                        <div className="flex items-center gap-3 pt-6">
                            <div className="flex items-center gap-3 w-full md:w-72">
                                <Input label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} value={searchQuery}  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    setSearchQuery(inputValue);
                                    fetchData(inputValue);
                                }}/>
                            </div>
                            <Button className="flex items-center gap-3"  onClick={exportBloodBagsAsPDF}>
                                <DocumentArrowDownIcon className="h-4 w-4" /> Export to PDF
                            </Button>
                        </div>
                    </div>
                </div>

                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th key={head.key} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer" onClick={() => handleSort(head.key)}>
                                    <div className="flex items-center">
                                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                            {head.label}
                                        </Typography>
                                        {sortColumn === head.key && <span className="ml-2">{sortOrder === "asc" ? "▲" : "▼"}</span>}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {userDetails.map((user, index) => (
                            <tr key={user.blood_bags_id} className={`${selectedRows.includes(user.blood_bags_id) ? selectedRowClass : ""}`}>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {formatDate(user.created_at)}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {user.first_name} {user.middle_name} {user.last_name}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {user.blood_type}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {calculateAge(user.dob)} {/* Calculate age based on date of birth */}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {user.sex}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {user.diagnosis}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {user.hospital}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {user.payment}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <ViewPopUp user={user} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Button variant="outlined" size="sm" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                    Previous
                </Button>
                <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <IconButton key={index} variant={currentPage === index + 1 ? "outlined" : "text"} size="sm" onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </IconButton>
                    ))}
                </div>
                <Button variant="outlined" size="sm" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                    Next
                </Button>
            </CardFooter>
        </Card>
    );
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
}
