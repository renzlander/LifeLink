import { laravelBaseUrl } from "@/app/variables";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Input,
  Option,
  Select,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TABLE_HEAD = [
  { label: "Name", key: "Name" },
  { label: "Module", key: "module" },
  { label: "Action", key: "action" },
  { label: "Status", key: "status" },
  { label: "IP Address", key: "ip_address" },
  { label: "Region", key: "region" },
  { label: "City", key: "city" },
  { label: "Postal", key: "postal" },
  { label: "Date and Time", key: "created_at" },
];

const classes = "p-4";
const currentDate = new Date();

// Get the current date in 'yyyy-mm-dd' format
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
const day = String(currentDate.getDate()).padStart(2, "0");
const formattedCurrentDate = `${year}-${month}-${day}`;

function formatDateTime(dateTimeString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formattedDateTime = new Date(dateTimeString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDateTime;
}

export function LogsTable() {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [module, setModule] = useState("All");
  const [startDate, setStartDate] = useState(formattedCurrentDate);
  const [endDate, setEndDate] = useState(formattedCurrentDate);
  const modules = [
    "All",
    "Collected Blood Bags",
    "Inventory",
    "User List",
    "Donor List",
    "Deferral List",
    "Disposed Blood Bags",
    "Dispensed Blood",
    "MBD Report",
    "Settings",
    "Authentication",
    "Network",
  ];

  const router = useRouter();
  const pagesToShow = 8; // Number of pagination numbers to display
  const fetchData = async (page) => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      let response;
      response = await axios.get(
        `${laravelBaseUrl}/api/get-audit-trail?page=${page}&sort=${sortColumn}&order=${sortOrder}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            module: module,
            startDate: startDate, // Use the updated startDate
            endDate: endDate, // Use the updated endDate
          },
        }
      );

      if (response.data && response.data.status === "success") {
        // Update current page and total pages based on response data
        setCurrentPage(response.data.data.current_page);
        setTotalPages(response.data.data.last_page);

        if (Array.isArray(response.data.data.data)) {
          setActivityLogs(response.data.data.data);
        } else {
          console.error("Fetched data is not an array:", response.data.data);
        }

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

  const handleSelectModule = (selectedModule) => {
    setModule(selectedModule);
    fetchData(currentPage, selectedModule, startDate, endDate); // Pass the new module value
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [router, sortColumn, sortOrder, searchQuery, module, startDate, endDate]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setCurrentPage(newPage);
    fetchData(newPage);
  };
  const getPageNumbers = () => {
    const halfPagesToShow = Math.floor(pagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfPagesToShow);
    let endPage = startPage + pagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const handleSort = (columnKey) => {
    // If the same column is clicked, toggle the sort order
    if (sortColumn === columnKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortOrder("asc");
    }

    // Call the fetchData function to fetch data based on the new sorting criteria
    fetchData(currentPage);
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
          Activity Logs
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-auto px-0">
        <div className="mb-4 ml-4 mr-4 flex justify-end items-center">
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <Select
              onChange={handleSelectModule}
              label="Modules"
              value={module}
            >
              {modules.map((module) => (
                <Option key={module} value={module}>
                  {module}
                </Option>
              ))}
            </Select>
            <div className="flex items-center gap-4">
              <Input
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  setStartDate(newStartDate);
                  // Call the fetchData function with the updated start date
                  fetchData(currentPage, module, newStartDate, endDate);
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
                  // Call the fetchData function with the updated end date
                  fetchData(currentPage, module, startDate, newEndDate);
                }}
                className=""
              />
            </div>
          </div>
        </div>
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
            {activityLogs.map((log, index) => (
              <tr key={log.audit_trails_id} className="border-b">
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {log.first_name} {log.last_name}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {log.module}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {log.action}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {log.status}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {log.ip_address}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {log.region}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {log.city}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {log.postal}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {formatDateTime(log.created_at)}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-blue-gray-50 px4">
        <Button
          variant="outlined"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {getPageNumbers().map((page) => (
            <IconButton
              key={page}
              variant={currentPage === page ? "outlined" : "text"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
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
