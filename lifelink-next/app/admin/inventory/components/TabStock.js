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
  Chip,
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
import { Revert } from "./Revert";
import { Dispense } from "./Dispense";
import { MultipleDispensed } from "./MultiDispensed";

const TABLE_HEAD = [
  { label: "Donor Number", key: "donor_no" },
  { label: "Serial Number", key: "serial_no" },
  { label: "Blood Type", key: "blood_type" },
  { label: "Date Donated", key: "date_donated" },
  { label: "Expiration Date", key: "expiration_date" },
  { label: "Remaining Days", key: "remaining_days" },
  { label: "Priority", key: "priority" },
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

export function TabStock() {
  const [userDetails, setUserDetails] = useState([]);
  const [visibleRows, setVisibleRows] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [blood_type, setBlood] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bloodQty, setBloodQty] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [registeredUser, setRegisteredUser] = useState([]);
  const [hospitalOptions, setHospitalOptions] = useState([]);

  const bloodTypes = ["All", "AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];
  const router = useRouter();

  const handleBloodChange = (selectedBlood) => {
    setBlood(selectedBlood);
    fetchBloodTypeFilteredData(selectedBlood, startDate, endDate);
  };

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
        `${laravelBaseUrl}/api/filter-stocks`,
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

  const fetchUserDetails = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/registered-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setRegisteredUser(response.data.userDetails);
      } else {
        console.error("Oops! Something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching bled_by and venues lists:", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(`${laravelBaseUrl}/api/get-stocks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        setUserDetails(response.data.data);
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
    getHospitalList();
    fetchUserDetails();
  }, [router, searchQuery]);

  const handleRowSelect = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  const selectedRowClass = "bg-gray-400";

  const handleRowSelection = (user, blood_bags_id) => {
    const isSelected = selectedRows.includes(blood_bags_id);

    if (isSelected) {
      setSelectedRows(selectedRows.filter((id) => id !== blood_bags_id));
      setSelectedData(
        selectedData.filter((data) => data.blood_bags_id !== blood_bags_id)
      );
    } else {
      setSelectedRows([...selectedRows, blood_bags_id]);
      setSelectedData([...selectedData, { user, blood_bags_id }]);
    }
  };

  const exportBloodBagsAsPDF = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(`${laravelBaseUrl}/api/export-stocks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
        params: {
          blood_type: blood_type,
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

  const handleLoadMore = () => {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 8);
  };

  const filteredUserDetails = userDetails.filter((user) => {
    const searchFields = [
      user.donor_no.toString(),
      user.serial_no.toString(),
      user.blood_type,
      formatDate(user.date_donated),
      formatDate(user.expiration_date),
      user.remaining_days.toString(),
      user.priority,
      // Add other fields as needed
    ];

    const searchString = searchQuery.toLowerCase();

    return searchFields.some((field) =>
      String(field).toLowerCase().includes(searchString)
    );
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
    <Card className="h-full w-full -mb-6">
      <CardBody className="px-0">
        <div className="flex items-center justify-between px-4 mb-4">
          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 flex justify-center"
            >
              Quantity: {bloodQty}
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
              variant="small"
              color="blue-gray"
              className="mb-2 flex justify-center font-medium"
            >
              Expiration Date Filter:
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
            ></Typography>
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
            <MultipleDispensed
              variant="contained"
              color="red"
              size="sm"
              className="ml-4"
              user={user}
              selectedData={selectedData}
              registeredUser={registeredUser}
              refreshData={fetchData}
              hospitalOptions={hospitalOptions}
            />
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
                      setUser([]);
                    } else {
                      setSelectedRows(
                        userDetails.map((user) => user.blood_bags_id)
                      );
                      setUser(userDetails);
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
                className={`border-b ${
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
                        setUser((prevUsers) =>
                          prevUsers.filter(
                            (selectedUser) =>
                              selectedUser.blood_bags_id !== user.blood_bags_id
                          )
                        );
                      } else {
                        setSelectedRows([...selectedRows, user.blood_bags_id]);
                        setUser((prevUsers) => [...prevUsers, user]);
                      }
                    }}
                    checked={selectedRows.includes(user.blood_bags_id)}
                  />
                </td>
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
                    className="font-normal text-center"
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
                    className="font-normal text-center"
                  >
                    {user.remaining_days}
                  </Typography>
                </td>
                <td className={classes}>
                  <div className="w-max">
                    <Chip
                      variant="ghost"
                      size="sm"
                      value={
                        user.priority === "Low Priority"
                          ? "Low Priority"
                          : user.priority === "Medium Priority"
                          ? "Medium Priority"
                          : "High Priority"
                      }
                      color={
                        user.priority === "Low Priority"
                          ? "green"
                          : user.priority === "Medium Priority"
                          ? "yellow"
                          : "red"
                      }
                    />
                  </div>
                </td>
                <td className={`${classes} flex items-center gap-3`}>
                  <Revert serial_no={user.serial_no} refreshData={fetchData} countdown={user.countdown}
                    countdownEndDate={user.countdown_end_date}/>
                  <Dispense
                    user={user}
                    blood_bags_id={user.blood_bags_id}
                    refreshData={fetchData}
                    registeredUser={registeredUser}
                    hospitalOptions={hospitalOptions}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {userDetails.length > visibleRows && (
          <div className="flex justify-center mt-4">
            <Button onClick={handleLoadMore}>Load More</Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
