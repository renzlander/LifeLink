import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Disposed} from "./popup";
import axios from "axios";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Spinner,
} from "@material-tailwind/react";
import { laravelBaseUrl } from "@/app/variables";

const TABLE_HEAD = [
    { label: "Donor Number", key: "donor_no" },
    { label: "Serial Number", key: "serial_no" },
    { label: "Name", key: "name" },
    { label: "Blood Type", key: "blood_type" },
    { label: "Date Donated", key: "date_donated" },
    { label: "Expiration Date", key: "expiration_date" },
    { label: ""}, 
  ]; 
 
  const classes = "p-4";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}


 
export function TabExp() {
    const [userDetails, setUserDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");

    const router = useRouter();

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
            response = await axios.get(
              `${laravelBaseUrl}/api/get-expired-blood?page=${page}&sort=${sortColumn}&order=${sortOrder}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }
      
         
          if (response.data.status === "success") {
             console.log(response);
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
          const response = await axios.get(
            `${laravelBaseUrl}/api/export-pdf-collected-bloodbags`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: "blob", 
            }
          );
      
          const pdfBlob = new Blob([response.data], { type: "application/pdf" });
          const pdfUrl = window.URL.createObjectURL(pdfBlob);
          window.open(pdfUrl);
          window.URL.revokeObjectURL(pdfUrl);
        } catch (error) {
          console.error("Error exporting PDF:", error);
        }
      };

      const sortedBloodBagDetails = userDetails.sort((a, b) => {
        const columnA = sortColumn === 'name' ? `${a.first_name} ${a.last_name}` : a[sortColumn];
        const columnB = sortColumn === 'name' ? `${b.first_name} ${b.last_name}` : b[sortColumn];
        
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
            <Card className="h-full w-full">
              <CardBody className="overflow-x-auto px-0">
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head) => (
                        <th
                          key={head.key}
                          className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer"
                          onClick={() => handleSort(head.key)} 
                        >
                          <div className="flex items-center">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal leading-none opacity-70"
                            >
                              {head.label}
                            </Typography>
                            {sortColumn === head.key && (
                              <span className="ml-2">
                                {sortOrder === "asc" ? "▲" : "▼"}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {userDetails.map((user, index) => (
                      <tr className="border-b">
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {user.donor_no}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="text-red-600 font-bold"
                          >
                            {user.serial_no}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {`${user.first_name} ${user.last_name}`}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {user.blood_type}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {formatDate(user.date_donated)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {formatDate(user.expiration_date)}
                          </Typography>
                        </td>
                        <td className={classes}>
                            <Disposed 
                                serial_no={user.serial_no} 
                                countdown={user.countdown} 
                                refreshData={fetchData}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
              <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Button
                  variant="outlined"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <IconButton
                      key={index}
                      variant={currentPage === index + 1 ? "outlined" : "text"}
                      size="sm"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </IconButton>
                  ))}
                </div>
                <Button
                  variant="outlined"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
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