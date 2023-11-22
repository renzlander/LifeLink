import { ClockIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
  Spinner,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { useRouter } from "next/navigation";
import PDFIcon from "@/public/pdf_icon";

const TABLE_HEAD = [
  { label: "Serial Number", key: "serial_no" },
  { label: "Date", key: "date_donated" },
  { label: "Bled By", key: "bled_by" },
  { label: "Venue", key: "venue" },
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
 
export function HistoryTable() {
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [lastDonation, setLastDonation] = useState([]); 

  const router = useRouter();

  const fetchData = async (page) => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-history?page=${page}&sort=${sortColumn}&order=${sortOrder}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      if (response.data.status === "success") {
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
  }, [router, sortColumn, sortOrder]);

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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("./login");
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/get-day-since-last-donation`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLastDonation(response.data);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen max-w-full flex-col py-2 justify-center items-center">
        <Spinner color="red" className="h-16 w-16" />
        <p className="mb-[180px] text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <Card className="w-full mt-6">
        <CardHeader color="red" className="relative h-16 flex items-center">
          <Typography variant="h4" color="white" className="ml-4">
           Donation History
          </Typography>
        </CardHeader>
        <CardBody className="px-0">
        <div className="px-4 pb-4 flex 2xl:flex-row flex-col justify-between items-center gap-3 w-full">
          <div className="flex 2xl:flex-row flex-col items-center gap-3">
            <div className="flex place-items-center justify-between gap-2">
              <ClockIcon className="h-5 w-5" />
              <Typography className="font-medium text-blue-gray-500">
                {lastDonation.days_since_last_donation}
              </Typography>
            </div>
            <div className="flex place-items-center justify-between gap-2">
              <ArrowRightIcon className="ml-6 h-5 w-5" />
              <Typography className="font-medium text-blue-gray-500">
                Next donation is {formatDate(lastDonation.nextDonationDate)}
              </Typography>
            </div>
          </div>
          <Tooltip 
            placement="left"
            content={
              <div className="flex flex-col items-center">
                <Typography variant="small">
                  Last Exports:
                </Typography>
                <Typography variant="small">
                - October 20, 2023
                </Typography>
                <Typography variant="small">
                - October 18, 2023
                </Typography>
              </div>
              }
          >
            <Button
              className="flex items-center justify-between gap-3"
              size="sm"
              onClick={exportBloodBagsAsPDF}
            >
              Export as PDF
            </Button>
          </Tooltip>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto text-left">
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
                <tr key={user.donor_no} className="border-b">
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {user.serial_number}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {formatDate(user.date)}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {user.bled_by}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {user.venue}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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