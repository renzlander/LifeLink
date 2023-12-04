import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import {
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
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
import { Disposed } from "./Disposed";
import { MultipleDisposed } from "./MultiDisposed";

const TABLE_HEAD = [
  { label: "Donor Number", key: "donor_no" },
  { label: "Serial Number", key: "serial_no" },
  { label: "First Name", key: "first_name" },
  { label: "Middle Name", key: "middle_name" },
  { label: "Last Name", key: "last_name" },
  { label: "Blood Type", key: "blood_type" },
  { label: "Date Donated", key: "date_donated" },
  { label: "Expiration Date", key: "expiration_date" },
  { label: "Remarks", key: "remarks" },
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

export function TabTemp() {
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleRows, setVisibleRows] = useState(8); // Track visible rows
  const [searchQuery, setSearchQuery] = useState("");
  const [blood_type, setBlood] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bloodQty, setBloodQty] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [reactiveOptions, setReactiveOptions] = useState([]);
  const [remarks, setRemarks] = useState("All");

  const bloodTypes = ["All", "AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];
  const router = useRouter();

  const reactiveDynamicOptions = [
    {
      label: "All",
      value: "All",
    },
    ...reactiveOptions.map((item) => ({
      label: item.reactive_remarks_desc,
      value: item.reactive_remarks_desc,
    })),
  ];

  const handleBloodChange = (selectedBlood) => {
    setBlood(selectedBlood);
    fetchBloodTypeFilteredData(selectedBlood, remarks, startDate, endDate);
  };

  const handleRemarks = (selectedRemarks) => {
    setRemarks(selectedRemarks);
    fetchBloodTypeFilteredData(blood_type, selectedRemarks, startDate, endDate); // Pass the selected remarks here
  };

  const fetchBloodTypeFilteredData = async (
    selectedBlood,
    remarks,
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
        `${laravelBaseUrl}/api/filter-deferral-bloodbags`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            blood_type: selectedBlood, // Use the selected blood type
            remarks: remarks,
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

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-deferral-bloodbags`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const fetchUnsafeRemarks = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-unsafe-remarks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setReactiveOptions(response.data.reactiveRemarks);
      } else {
        console.error("Oops! Something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching remarks:", error);
    }
  };

  useEffect(() => {
    fetchBloodTypeFilteredData(blood_type, remarks, startDate, endDate);
    fetchUnsafeRemarks();
  }, [router, searchQuery]);

  const exportBloodBagsAsPDF = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Send a request to the PDF export endpoint
      const response = await axios.get(`${laravelBaseUrl}/api/export-rbb`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
        params: {
          blood_type: blood_type,
          remarks: remarks,
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

  if (loading) {
    return (
      <div className="flex min-h-screen max-w-full flex-col py-2 justify-center items-center">
        <Spinner color="red" className="h-16 w-16" />
        <p className="mb-[180px] text-gray-600">Loading...</p>
      </div>
    );
  }

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

  const filteredUserDetails = userDetails
    ? userDetails.filter((user) => {
        const searchFields = [
          user.donor_no.toString(),
          user.serial_no.toString(),
          user.first_name,
          user.middle_name,
          user.last_name,
          user.blood_type,
          formatDate(user.date_donated),
          formatDate(user.expiration_date),
          user.reactive_remarks_desc,
          // Add other fields as needed
        ];

        const searchString = searchQuery.toLowerCase();

        return searchFields.some((field) =>
          String(field).toLowerCase().includes(searchString)
        );
      })
    : [];

  return (
    <Card className="w-full -mb-6">
      <CardBody className="px-0">
        <div className="flex items-center justify-between gap-3 px-4 mb-4">
          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 flex justify-center"
            >
              Quantity: {bloodQty}
            </Typography>
            <div className="flex items-center justify-between gap-4">
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
              <InputSelect
                label="Reactive Remarks"
                containerProps={{ className: "w-[50%]" }}
                value={remarks}
                onSelect={handleRemarks}
                options={reactiveDynamicOptions}
                isSearchable
                required
                placeholder="Reactive Remarks"
              />
            </div>
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 flex justify-center font-medium"
            >
              Date Donated Filter:
            </Typography>
            <div className="flex items-center gap-4">
              <Input
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  setStartDate(newStartDate);
                  fetchBloodTypeFilteredData(
                    blood_type,
                    remarks,
                    newStartDate,
                    endDate
                  );
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
                  fetchBloodTypeFilteredData(
                    blood_type,
                    remarks,
                    startDate,
                    newEndDate
                  );
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
                size="sm"
                className="flex items-center gap-3wrap"
                onClick={exportBloodBagsAsPDF}
              >
                <DocumentArrowDownIcon className="h-5 w-5" /> Export PDF
              </Button>
            </div>
          </div>
        </div>
        {selectedRows.length > 0 && (
          <div className="flex items-center px-4 mt-8 mb-4">
            <Typography variant="h6" className="text-lg mr-4">
              Selected Rows: {selectedRows.length}
            </Typography>
            <MultipleDisposed
              variant="contained"
              color="red"
              size="sm"
              className="ml-4"
              selectedRows={selectedRows}
              refreshData={fetchData}
            />
          </div>
        )}
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
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
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <div className="flex items-center">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
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
                <td className={classes}>
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
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold"
                  >
                    {user.donor_no}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography variant="small" color="red" className="font-bold">
                    {user.serial_no}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {user.first_name}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {user.middle_name}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {user.last_name}
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
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {user.reactive_remarks_desc}
                  </Typography>
                </td>
                <td className={classes}>
                  <Disposed
                    blood_bags_id={user.blood_bags_id}
                    refreshData={fetchBloodTypeFilteredData}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 p-4">
        {userDetails && visibleRows < userDetails.length && (
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
