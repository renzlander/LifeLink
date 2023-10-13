import { PencilIcon } from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon, MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Typography, Button, CardBody, Chip, CardFooter, Avatar, IconButton, Tooltip, Input, Spinner, Select, Option } from "@material-tailwind/react";
import { RemoveBlood, EditPopUp, MoveToStock, MultipleMoveToStock } from "./popup";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { useRouter } from "next/navigation";

const TABLE_HEAD = [
    { label: "Donor Number", key: "donor_no" },
    { label: "Serial Number", key: "serial_no" },
    { label: "Name", key: "name" },
    { label: "Blood Type", key: "blood_type" },
    { label: "Date Donated", key: "date_donated" },
    { label: "Expiration Date", key: "expiration_date" },
    { label: "Venue", key: "venue" },
    { label: "Bled By", key: "bled_by" },
    { label: "" },
    { label: "" },
    { label: "" },
    { label: "" },
];

const classes = "p-4";

function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
}

export function BagsTable() {
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
    const [bledBy, setBledBy] = useState("All");
    const [venue, setVenue] = useState("All");
    const [selectedRows, setSelectedRows] = useState([]);

    const router = useRouter();
    const bledBys = ["All", "Ryan Jay", "Renz", "Ray", "James"];
    const bloodTypes = ["All", "AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];
    const venues = ["All", "Malinta Valenzuela", "Balubaran Valenzuela"];

    const handleBloodChange = (selectedBlood) => {
        setBlood(selectedBlood);
        fetchBloodTypeFilteredData(selectedBlood, startDate, endDate, bledBy, venue);
    };

    const handleBledByChange = (selectedBledBy) => {
        setBledBy(selectedBledBy);
        fetchBloodTypeFilteredData(blood_type, startDate, endDate, selectedBledBy, venue);
    };

    const handleVenueChange = (selectedVenue) => {
        setVenue(selectedVenue);
        fetchBloodTypeFilteredData(blood_type, startDate, endDate, bledBy, selectedVenue);
    };

    const fetchBloodTypeFilteredData = async (selectedBlood, startDate, endDate, bledBy, venue) => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const response = await axios.post(
                `${laravelBaseUrl}/api/filter-collected-bloodbags`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        blood_type: selectedBlood,
                        startDate: startDate,
                        endDate: endDate,
                        bledBy: bledBy,
                        venue: venue,
                    },
                }
            );

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

    const fetchData = async (page) => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }

            let response;

            if (searchQuery) {
                response = await axios.post(
                    `${laravelBaseUrl}/api/search-collected-bloodbag?page=${page}&sort=${sortColumn}&order=${sortOrder}`,
                    {
                        searchInput: searchQuery,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                response = await axios.get(`${laravelBaseUrl}/api/get-collected-bloodbags?page=${page}&sort=${sortColumn}&order=${sortOrder}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
        fetchBloodTypeFilteredData(blood_type, startDate, endDate, bledBy, venue);
        // fetchData(currentPage);
    }, [router, sortColumn, sortOrder, searchQuery]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) {
            return;
        }

        setCurrentPage(newPage);
        fetchData(newPage);
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
            const response = await axios.get(`${laravelBaseUrl}/api/export-pdf-collected-bloodbags`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
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
        const columnA = sortColumn === "name" ? `${a.first_name} ${a.last_name}` : a[sortColumn];
        const columnB = sortColumn === "name" ? `${b.first_name} ${b.last_name}` : b[sortColumn];

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

    const selectedRowClass = "bg-red-100";
    const handleRowSelection = (blood_bags_id) => {
        if (selectedRows.includes(blood_bags_id)) {
            setSelectedRows(selectedRows.filter((id) => id !== blood_bags_id));
        } else {
            setSelectedRows([...selectedRows, blood_bags_id]);
        }
    };

    console.log(selectedRows);

    return (
        <Card className="w-full">
            <CardHeader color="red" className="relative h-16 flex items-center">
                <Typography variant="h4" color="white" className="ml-4">
                    Collected Blood Bags
                </Typography>
            </CardHeader>
            <CardHeader floated={false} shadow={false} className="rounded-none mt-0 bg-transparent">
                <div className="flex items-end justify-between px-4 mb-4 my-10">
                    <div className="flex flex-row items-end gap-6">
                        <div>
                            <Select onChange={handleBloodChange} label="Blood Type" value={blood_type}>
                                {bloodTypes.map((blood) => (
                                    <Option key={blood} value={blood}>
                                        {blood}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <Select label="Venue" onChange={handleVenueChange} value={venue}>
                            {venues.map((ven) => (
                                <Option key={ven} value={ven}>
                                    {ven}
                                </Option>
                            ))}
                        </Select>
                        <Select label="Bled By" onChange={handleBledByChange} value={bledBy}>
                            {bledBys.map((bledby) => (
                                <Option key={bledby} value={bledby}>
                                    {bledby}
                                </Option>
                            ))}
                        </Select>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <Typography variant="h6" className="font-bold text-red-800">
                                Date Donated Filter
                            </Typography>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="date"
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(e) => {
                                        const newStartDate = e.target.value;
                                        setStartDate(newStartDate);
                                        fetchBloodTypeFilteredData(blood_type, newStartDate, endDate, bledBy, venue);
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
                                        fetchBloodTypeFilteredData(blood_type, startDate, newEndDate, bledBy, venue);
                                    }}
                                    className=""
                                />
                            </div>
                        </div>
                    </div>
                    <div className=" ml-4 mr-4 flex justify-end items-center">
                        <div className="flex w-full shrink-0 gap-2 md:w-max">
                            <div className="w-full md:w-72">
                                <Input
                                    label="Search"
                                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                    value={searchQuery}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        setSearchQuery(inputValue);
                                        fetchData(inputValue);
                                    }}
                                />
                            </div>
                            <Button className="flex items-center gap-3" size="sm" onClick={exportBloodBagsAsPDF}>
                                Export as PDF
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="">
                <div className="flex items-center px-4 mt-8 mb-4">
                    <Typography variant="subtitle1" className="font-bold text-sm">
                        Selected Rows: {selectedRows.length}
                    </Typography>
                    <MultipleMoveToStock variant="contained" color="red" size="sm" className="ml-4" selectedRows={selectedRows} refreshData={fetchData} />
                </div>
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={() => {
                                        if (selectedRows.length === userDetails.length) {
                                            setSelectedRows([]);
                                        } else {
                                            setSelectedRows(userDetails.map((user) => user.serial_no));
                                        }
                                    }}
                                    checked={userDetails.length > 0 && selectedRows.length === userDetails.length}
                                    className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                                />
                            </th>
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
                            <tr key={user.serial_no} className={`${selectedRows.includes(user.serial_no) ? selectedRowClass : ""}`}>
                                <td>
                                    <input
                                        type="checkbox"
                                        onChange={() => {
                                            if (selectedRows.includes(user.serial_no)) {
                                                setSelectedRows(selectedRows.filter((id) => id !== user.serial_no));
                                            } else {
                                                setSelectedRows([...selectedRows, user.serial_no]);
                                            }
                                        }}
                                        checked={selectedRows.includes(user.blood_bags_id)}
                                        className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                                    />
                                </td>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <Typography variant="small" color="blue-gray" className="font-bold">
                                            {user.donor_no}
                                        </Typography>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="text-red-600 font-bold">
                                        {user.serial_no}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {`${user.first_name} ${user.last_name}`}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {user.blood_type}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {formatDate(user.date_donated)}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {formatDate(user.expiration_date)}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {user.venue}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {user.bled_by}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {user.email}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <EditPopUp user={user} countdown={user.countdown} refreshData={fetchData} />
                                </td>
                                <td className={classes}>
                                    <RemoveBlood serial_no={user.serial_no} countdown={user.countdown} refreshData={fetchData} />
                                </td>
                                <td className={classes}>
                                    <MoveToStock serial_no={user.serial_no} refreshData={fetchData} />
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
