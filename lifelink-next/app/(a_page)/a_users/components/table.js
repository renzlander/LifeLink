import { MagnifyingGlassIcon, BarsArrowUpIcon, BarsArrowDownIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Typography, Button, CardBody, CardFooter, IconButton, Input, Spinner, Chip } from "@material-tailwind/react";
import { AddBloodBagPopup } from "./popupAdd";
import { ViewPopUp } from "./popupView";
import { EditPopUp } from "./popupEdit";
import { AddUsers } from "./popupAddUser";
import { MoveToDeferral } from "./popupMoveToDeferral";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { useRouter } from "next/navigation";

const TABLE_HEAD = [
    { label: "Donor Number", key: "donor_no" },
    { label: "Full Name", key: "fullname" },
    { label: "Blood Type", key: "blood_type" },
    { label: "Email Address", key: "email" },
    { label: "Mobile", key: "mobile" },
    { label: "Birthday", key: "dob" },
    { label: "Last Date Donated", key: "datedonated" },
    { label: "", key: "tools" },
    { label: "", key: "actions" },
];
const classes = "p-4";
const DEFAULT_SORT_COLUMN = null; // Set your default sort column key here
const DEFAULT_SORT_ORDER = null; // Set default sort order to null

function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
}

export function UsersTable() {
    const [userDetails, setUserDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortColumn, setSortColumn] = useState(DEFAULT_SORT_COLUMN); // Set default sort column
    const [sortOrder, setSortOrder] = useState(DEFAULT_SORT_ORDER);
    const [searchQuery, setSearchQuery] = useState("");
    const [bledByOptions, setBledByOptions] = useState([]);
    const [venueOptions, setVenueOptions] = useState([]);
    const [temporaryDeferralCategories, setTemporaryDeferralCategories] = useState([]);
    const [temporaryDeferralRemarks, setTemporaryDeferralRemarks] = useState([]);
    const [permanentDeferralCategories, setPermanentDeferralCategories] = useState([]);
    const pagesToShow = 8;
    const router = useRouter();

    useEffect(() => {
        const fetchDeferralCategories = async () => {
            try {
                const token = getCookie("token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const response = await axios.get(`${laravelBaseUrl}/api/get-defferal-categories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.status === "success") {
                    const tempCategories = response.data.tempCategories;
                    const permaCategories = response.data.permaCategories;

                    setTemporaryDeferralCategories(tempCategories);
                    setPermanentDeferralCategories(permaCategories);
                } else {
                    console.error("Failed to fetch deferral categories.");
                }
            } catch (error) {
                console.error("An error occurred while fetching deferral categories:", error);
            }
        };

        fetchDeferralCategories();
    }, []);

    const fetchBledByAndVenueLists = async () => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const response = await axios.get(`${laravelBaseUrl}/api/get-bledby-and-venue`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response);

            if (response.data.status === "success") {
                // Update the state variables with the data from the API response
                setBledByOptions(response.data.bledBy);
                setVenueOptions(response.data.venue);
            } else {
                // Handle the case when the API request fails
                console.error("Oops! Something went wrong.");
            }
        } catch (error) {
            console.error("Error fetching bled_by and venues lists:", error);
            // You can handle the error here, e.g., by displaying a message to the user
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
                    `${laravelBaseUrl}/api/search-user?page=${page}&sort=${sortColumn}&order=${sortOrder}`,
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
                response = await axios.get(`${laravelBaseUrl}/api/get-user-details?page=${page}&sort=${sortColumn}&order=${sortOrder}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            console.log("Response:", response);

            if (response && response.data && response.data.status === "success") {
                setUserDetails(response.data.data.data);
                setTotalPages(response.data.data.last_page);
                setCurrentPage(response.data.data.current_page);
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
        fetchData(currentPage);
        fetchBledByAndVenueLists();
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

    const exportUserDetailsAsPDF = async () => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }

            // Send a request to the PDF export endpoint
            const response = await axios.get(`${laravelBaseUrl}/api/export-pdf-user-details`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob", // Set the response type to blob for binary data
            });

            // Create a Blob object from the response data
            const pdfBlob = new Blob([response.data], { type: "application/pdf" });

            // Create a URL for the Blob object
            const pdfUrl = window.URL.createObjectURL(pdfBlob);

            // Open the PDF in a new window or tab
            window.open(pdfUrl);

            // Clean up by revoking the URL when it's no longer needed
            window.URL.revokeObjectURL(pdfUrl);
        } catch (error) {
            console.error("Error exporting PDF:", error);
        }
    };

    const sortedUserDetails = userDetails.sort((a, b) => {
        // Replace 'name' with the correct column name for sorting
        const columnA = sortColumn === "fullname" ? a.first_name : sortColumn === "middlename" ? a.middle_name : sortColumn === "lastname" ? a.last_name : a[sortColumn];
        const columnB = sortColumn === "fullname" ? b.first_name : sortColumn === "middlename" ? b.middle_name : sortColumn === "lastname" ? b.last_name : b[sortColumn];
    
        if (sortOrder === "asc") {
            if (columnA < columnB) return -1;
            if (columnA > columnB) return 1;
        } else {
            if (columnA < columnB) return 1;
            if (columnA > columnB) return -1;
        }
    
        return 0;
    });
    
    const getPageNumbers = () => {
        const halfPagesToShow = Math.floor(pagesToShow / 2);
        let startPage = Math.max(1, currentPage - halfPagesToShow);
        let endPage = startPage + pagesToShow - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - pagesToShow + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const handleUpdateUser = (updatedUserData) => {
        console.log("Updated user data:", updatedUserData);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen max-w-full flex-col py-2 justify-center items-center">
                <Spinner color="red" className="h-16 w-16" />
                <p className="mb-[180px] text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <Card className="h-full w-full mt-4">
            <CardHeader color="red" className="relative h-16 flex items-center">
                <Typography variant="h4" color="white" className="ml-4">
                    Users List
                </Typography>
            </CardHeader>
            <CardBody className="overflow-x-auto px-0">
                <div className="mb-4 ml-4 mr-4 flex justify-between items-center">
                    <div>
                        <AddUsers refreshData={fetchData}/>
                    </div>
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
                        <Button className="flex items-center gap-3" size="sm" onClick={exportUserDetailsAsPDF}>
                            Export as PDF
                        </Button>
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
                                        {sortColumn === head.key && <span className="ml-2">{sortOrder === "asc" ? <BarsArrowUpIcon className="h-5 w-5" /> : <BarsArrowDownIcon className="h-5 w-5" />}</span>}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {userDetails.map((user, index) => (
                            <tr key={user.donor_no} className="border-b border-blue-gray-100">
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-bold">
                                        {user.donor_no}
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
                                        {user.email}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {user.mobile}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal capitalize">
                                        {formatDate(user.dob)}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                <Typography variant="small" color="blue-gray" className="font-normal capitalize">
                                    {user.latest_date_donated ? formatDate(user.latest_date_donated) : "Not yet donated"}
                                </Typography>
                                </td>
                                <td className={classes}>
                                    <ViewPopUp user={user} />
                                    <EditPopUp user={user} onUpdate={handleUpdateUser} refreshData={fetchData} />
                                </td>
                                <td className={`${classes} mt-1 flex items-center justify-center gap-2`}>
                                    {user.remarks !== 0 ? (
                                        <Chip size="lg" value="DEFERRED" color="blue-gray">
                                            DEFERRED
                                        </Chip>
                                    ) : (
                                        <div className="space-x-2">
                                            <AddBloodBagPopup user_id={user.user_id} bledByOptions={bledByOptions} venueOptions={venueOptions} />
                                            <MoveToDeferral user_id={user.user_id} refreshData={fetchData} temporaryDeferralCategories={temporaryDeferralCategories} permanentDeferralCategories={permanentDeferralCategories} venueOptions={venueOptions}/>
                                        </div>
                                    )}
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
        {getPageNumbers().map((page) => (
            <IconButton key={page} variant={currentPage === page ? "outlined" : "text"} size="sm" onClick={() => handlePageChange(page)}>
                {page}
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
