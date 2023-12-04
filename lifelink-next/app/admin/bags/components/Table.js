import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Input,
  Option,
  Select,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditPopUp } from "./Edit";
import { MoveToStock } from "./MoveToStock";
import { MultipleMoveToStock } from "./MultiStock";
import { RemoveBlood } from "./RemoveBlood";
import { Unsafe } from "./Unsafe";
import { ReferToLab } from "./ReferToLab";

const TABLE_HEAD = [
  { label: "Donor Number", key: "donor_no" },
  { label: "Serial Number", key: "serial_no" },
  { label: "Name", key: "name" },
  { label: "Blood Type", key: "blood_type" },
  { label: "Date Donated", key: "date_donated" },
  { label: "Expiration Date", key: "expiration_date" },
  { label: "Venue", key: "venue" },
  { label: "Bled By", key: "bled_by" },
  { label: "On-going Testing", key: "laboratory" },
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

export function BagsTable() {
  const [userDetails, setUserDetails] = useState([]);
  const [visibleRows, setVisibleRows] = useState(8); // Track visible rows
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [blood_type, setBlood] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bloodQty, setBloodQty] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [venueOptions, setVenueOptions] = useState([]);
  const [bledByOptions, setBledByOptions] = useState([]);
  const [venue, setVenue] = useState("All");
  const [bledBy, setBledBy] = useState("All");
  const [reactiveOptions, setReactiveOptions] = useState([]);
  const [spoiledOptions, setSpoiledOptions] = useState([]);

  const router = useRouter();
  const bloodTypes = ["All", "AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

  const dynamicBledByOptions = [
    { label: "All", value: "All" },
    ...bledByOptions.map((item) => ({
      label: item.full_name,
      value: item.bled_by_id,
    })),
  ];

  const dynamicVenueOptions = [
    { label: "All", value: "All" },
    ...venueOptions.map((item) => ({
      label: item.venues_desc,
      value: item.venues_id,
    })),
  ];

  const handleBloodChange = (selectedBlood) => {
    setBlood(selectedBlood);
    fetchData(selectedBlood, startDate, endDate, bledBy, venue);
  };

  const handleBledByChange = (selectedBledBy) => {
    setBledBy(selectedBledBy);
    fetchData(blood_type, startDate, endDate, selectedBledBy, venue);
  };

  const handleVenueChange = (selectedVenue) => {
    setVenue(selectedVenue);
    fetchData(blood_type, startDate, endDate, bledBy, selectedVenue);
  };

  const fetchBledByAndVenueLists = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-bledby-and-venue`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setVenueOptions(response.data.venue);
        setBledByOptions(response.data.bledBy);
      } else {
        console.error("Oops! Something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching bled_by and venues lists:", error);
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
        setSpoiledOptions(response.data.spoiledRemarks);
      } else {
        console.error("Oops! Something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching bled_by and venues lists:", error);
    }
  };

  const fetchData = async (blood_type, startDate, endDate, bledBy, venue) => {
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
            blood_type: blood_type,
            startDate: startDate,
            endDate: endDate,
            bledBy: bledBy,
            venue: venue,
          },
        }
      );

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
    fetchData(blood_type, startDate, endDate, bledBy, venue);
    fetchBledByAndVenueLists();
    fetchUnsafeRemarks();
  }, [router, searchQuery, blood_type, startDate, endDate, bledBy, venue]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUserDetails = userDetails.filter((user) => {
    const searchFields = [
      user.donor_no.toString(),
      user.serial_no.toString(),
      `${user.first_name} ${user.last_name}`,
      user.blood_type,
      formatDate(user.date_donated),
      formatDate(user.expiration_date),
      user.venues_desc,
      `${user.bled_by_first_name} ${user.bled_by_middle_name} ${user.bled_by_last_name}`,
      user.isTested === 1 ? "Yes" : "No",
    ];

    const searchString = searchQuery.toLowerCase();

    return searchFields.some((field) =>
      String(field).toLowerCase().includes(searchString)
    );
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
          params: {
            blood_type: blood_type,
            startDate: startDate,
            endDate: endDate,
            bledBy: bledBy,
            venue: venue,
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
  return (
    <Card className="w-full">
      <CardHeader color="red" className="relative h-16 flex items-center">
        <Typography variant="h4" color="white" className="ml-4">
          Collected Blood Bags
        </Typography>
      </CardHeader>
      <CardBody className="px-0">
        <div className="flex items-end justify-between px-4 mb-4 my-5">
          <div className="flex flex-row items-end gap-6">
            <div>
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
            <InputSelect
              label="Venue"
              value={venue}
              onSelect={handleVenueChange}
              options={dynamicVenueOptions}
              isSearchable
              required
              placeholder="Venue"
            />

            <InputSelect
              label="Bled By"
              value={bledBy}
              onSelect={handleBledByChange}
              options={dynamicBledByOptions}
              isSearchable
              required
              placeholder="Venue"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-medium"
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
                    fetchData(blood_type, newStartDate, endDate, bledBy, venue);
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
                    fetchData(blood_type, startDate, newEndDate, bledBy, venue);
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
                  onChange={handleSearchChange}
                />
              </div>
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={exportBloodBagsAsPDF}
              >
                Export as PDF
              </Button>
            </div>
          </div>
        </div>
        {selectedRows.length > 0 && (
          <div className="flex items-center px-4 mt-8 mb-4">
            <Typography variant="h6" className="text-lg mr-4">
              Selected Rows: {selectedRows.length}
            </Typography>
            <MultipleMoveToStock
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
                        userDetails
                          .filter((user) => user.isTested === 1)
                          .map((user) => user.blood_bags_id)
                      );
                    }
                  }}
                  checked={
                    userDetails.length > 0 &&
                    selectedRows.length === userDetails.length
                  }
                />
              </th>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head.key}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head.label}
                  </Typography>
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
                  {user.isTested === 1 ? (
                    <Checkbox
                      onChange={() => {
                        if (selectedRows.includes(user.blood_bags_id)) {
                          setSelectedRows(
                            selectedRows.filter(
                              (id) => id !== user.blood_bags_id
                            )
                          );
                        } else {
                          setSelectedRows([
                            ...selectedRows,
                            user.blood_bags_id,
                          ]);
                        }
                      }}
                      checked={selectedRows.includes(user.blood_bags_id)}
                    />
                  ) : (
                    <Checkbox
                      disabled // disable the checkbox
                      checked={false} // ensure it's unchecked when disabled
                    />
                  )}
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
                    className="font-normal"
                  >
                    {`${user.first_name} ${user.last_name}`}
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
                    className="font-normal"
                  >
                    {user.venues_desc}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {user.bled_by_first_name} {user.bled_by_middle_name}{" "}
                    {user.bled_by_last_name}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal text-center"
                  >
                    {user.isTested === 1 ? "Yes" : "No"}
                  </Typography>
                </td>

                <td
                  className={`${classes} flex items-center justify-around gap-3`}
                >
                  <EditPopUp
                    bledByOptions={bledByOptions}
                    venueOptions={venueOptions}
                    user={user}
                    countdown={user.countdown}
                    countdownEndDate={user.countdown_end_date}
                    refreshData={fetchData}
                  />
                  <RemoveBlood
                    user={user}
                    serial_no={user.serial_no}
                    countdown={user.countdown}
                    countdownEndDate={user.countdown_end_date}
                    refreshData={fetchData}
                  />
                  <ReferToLab
                    bloodBagId={user.blood_bags_id}
                    user={user}
                    refreshData={fetchData}
                  />
                  <MoveToStock
                    serial_no={user.serial_no}
                    user={user}
                    refreshData={fetchData}
                  />
                  <Unsafe
                    serial_no={user.serial_no}
                    refreshData={fetchData}
                    reactiveOptions={reactiveOptions}
                    spoiledOptions={spoiledOptions}
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
