import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Disposed, MultipleDisposed } from "./PopUp";
import axios from "axios";
import {
  Card,
  Input,
  Typography,
  Button,
  CardBody,
  Checkbox,
  CardFooter,
  IconButton,
  Tooltip,
  Spinner,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { laravelBaseUrl } from "@/app/variables";

const TABLE_HEAD = [
  { label: "Donor Number", key: "donor_no" },
  { label: "Serial Number", key: "serial_no" },
  { label: "Blood Type", key: "blood_type" },
  { label: "Date Donated", key: "date_donated" },
  { label: "Expiration Date", key: "expiration_date" },
  { label: "" },
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
  const [visibleRows, setVisibleRows] = useState(8); // Track visible rows
  const [searchQuery, setSearchQuery] = useState("");
  const [blood_type, setBlood] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bloodQty, setBloodQty] = useState();
  const [selectedRows, setSelectedRows] = useState([]);

  const bloodTypes = ["All", "AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];
  const router = useRouter();

  const handleBloodChange = (selectedBlood) => {
    setBlood(selectedBlood);
    fetchBloodTypeFilteredData(selectedBlood, startDate, endDate);
  };

  const fetchBloodTypeFilteredData = async (
    selectedBlood,
    startDate,
    endDate
  ) => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.post(
        `${laravelBaseUrl}/api/filter-expired`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            blood_type: selectedBlood,
            startDate: startDate,
            endDate: endDate,
          },
        }
      );

      if (response.data.status === "success") {
        setUserDetails(response.data.data.data);
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

  const fetchData = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      let response;

      if (searchQuery) {
        response = await axios.post(
          `${laravelBaseUrl}/api/search-expired-blood`,
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
        response = await axios.get(`${laravelBaseUrl}/api/get-expired-blood`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response.data.status === "success") {
        setUserDetails(response.data.data.data);
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
    fetchData();
  }, [router, searchQuery]);

  const exportBloodBagsAsPDF = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/export-expired-blood`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
          params: {
            blood_type: blood_type,
            startDate: startDate,
            endDate: endDate,
          },
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

  const selectedRowClass = "bg-gray-400";
  const handleRowSelection = (blood_bags_id) => {
    if (selectedRows.includes(blood_bags_id)) {
      setSelectedRows(selectedRows.filter((id) => id !== blood_bags_id));
    } else {
      setSelectedRows([...selectedRows, blood_bags_id]);
    }
  };

  const loadMoreRows = () => {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 4);
  };

  const filteredUserDetails = userDetails.filter((user) => {
    return user.serial_no.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Card className="w-full -mb-6">
      <CardBody className="px-0">
        <div className="flex items-center justify-between px-4 mb-4">
          <div>
            <Typography
              variant="subtitle1"
              className="mb-2 flex justify-center font-bold text-red-800"
            >
              QTY:{bloodQty}
            </Typography>
            <Select
              onChange={handleBloodChange}
              label="Blood Type"
              value={blood_type}
            >
              {bloodTypes.map((blood) => (
                <Option key={blood} value={blood}>
                  {blood}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <Typography
              variant="subtitle1"
              className="mb-2 flex justify-center font-bold text-red-800"
            >
              Expiration Date Filter
            </Typography>
            <div className="flex items-center gap-4">
              <Input
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  setStartDate(newStartDate);
                  fetchBloodTypeFilteredData(blood_type, newStartDate, endDate);
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
                  fetchBloodTypeFilteredData(blood_type, startDate, newEndDate);
                }}
                className=""
              />
            </div>
          </div>
          <div>
            <Typography
              variant="subtitle1"
              className="mb-2 flex justify-center font-bold text-red-800"
            >
              {/* Other Tools  */}
            </Typography>
            <div className="flex items-center gap-3 pt-6">
              <div className="flex items-center gap-3 w-full md:w-72">
                <Input
                  label="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={searchQuery}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setSearchQuery(inputValue);
                  }}
                />
              </div>
              <Button
                className="flex items-center gap-3"
                onClick={exportBloodBagsAsPDF}
              >
                <DocumentArrowDownIcon className="h-4 w-4" /> Export to PDF
              </Button>
            </div>
          </div>
        </div>
        {selectedRows.length > 0 && (
          <div className="flex items-center px-4 mt-8 mb-4">
            <Typography variant="h6" className="text-lg mr-4">
              Selected Rows: {selectedRows.length}
            </Typography>
            <MultipleDisposed variant="contained" color="red" size="sm" className="ml-4" selectedRows={selectedRows} refreshData={fetchData} />
          </div>
        )}
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer">
                <Checkbox
                  onChange={() => {
                    if (selectedRows.length === userDetails.length) {
                      setSelectedRows([]);
                    } else {
                      setSelectedRows(
                        userDetails.map((user) => user.blood_bags_id)
                      );
                    }
                  }}
                  checked={
                    userDetails.length > 0 &&
                    selectedRows.length === userDetails.length
                  }
                />
              </th>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head.key}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer"
                >
                  <div className="flex items-center">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal text-md leading-none opacity-70"
                    >
                      {head.label}
                    </Typography>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUserDetails.slice(0, visibleRows).map((user, index) => (
              <tr
                key={user.blood_bags_id}
                className={`${
                  selectedRows.includes(user.blood_bags_id)
                    ? selectedRowClass
                    : ""
                }`}
              >
                <td>
                  <Checkbox
                    onChange={() => {
                      if (selectedRows.includes(user.blood_bags_id)) {
                        setSelectedRows(
                          selectedRows.filter((id) => id !== user.blood_bags_id)
                        );
                      } else {
                        setSelectedRows([...selectedRows, user.blood_bags_id]);
                      }
                    }}
                    checked={selectedRows.includes(user.blood_bags_id)}
                  />
                </td>
                <td>
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
                <td>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text-red-600 font-bold"
                  >
                    {user.serial_no}
                  </Typography>
                </td>
                <td>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {user.blood_type}
                  </Typography>
                </td>
                <td>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {formatDate(user.date_donated)}
                  </Typography>
                </td>
                <td>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {formatDate(user.expiration_date)}
                  </Typography>
                </td>
                <td>
                  <Disposed
                    blood_bags_id={user.blood_bags_id}
                    refreshData={fetchData}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 p-4">
        {visibleRows < userDetails.length && (
          <div className="flex justify-center mt-4">
            <Button onClick={loadMoreRows}>Load More</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
