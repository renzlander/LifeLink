import { laravelBaseUrl } from "@/app/variables";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
import { ViewPopUp } from "./Popup";

const TABLE_HEAD = [
  { label: "Donor Number", key: "donor_no" },
  { label: "First Name", key: "first_name" },
  { label: "Middle Name", key: "middle_name" },
  { label: "Last", key: "last_name" },
  { label: "Blood Type", key: "blood_type" },
  { label: "Email Address", key: "email" },
  { label: "Mobile", key: "mobile" },
  { label: "Last Date Donated", key: "last_donated" },
  { label: "Donate Quantity", key: "donate_qty" },
  { label: "Badge", key: "badge" },
  { label: "Donor Type", key: "donor Type" },
  { label: "" },
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

export function DonorTable() {
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleRows, setVisibleRows] = useState(8); // Track visible rows
  const [bloodType, setBloodType] = useState("All");
  const [donorType, setDonorType] = useState("All");

  const router = useRouter();
  const bloodTypes = ["All", "AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];
  const donorTypes = ["All", "First Time", "Regular", "Lapsed", "Galloneer"];

  const handleBloodChange = (selectedBlood) => {
    setBloodType(selectedBlood);
    fetchData(selectedBlood, donorType);
  };

  const handleDonorTypeChange = (selectedDonorType) => {
    setDonorType(selectedDonorType);
    fetchData(bloodType, selectedDonorType);
  };

  const fetchData = async (bloodType, donorType) => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(`${laravelBaseUrl}/api/get-donor-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          blood_type: bloodType,
          donor_type: donorType,
        },
      });

      if (response.data.status === "success") {
        setUserDetails(response.data.data);
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
    fetchData(bloodType, donorType);
  }, [router, searchQuery, bloodType, donorType]);

  const exportUserDetailsAsPDF = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/export-pdf-donor-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
          params: {
            bloodType: bloodType,
            donorType: donorType,
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUserDetails = userDetails.filter((user) => {
    const fullName =
      `${user.first_name} ${user.middle_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const loadMoreRows = () => {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 8);
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
          Donor List
        </Typography>
      </CardHeader>
      <div className="flex items-end justify-between px-4 mt-6">
        <div className="mx-4 flex justify-between items-center w-full">
          <div className="flex flex-row items-end gap-6">
            <div>
              <Select
                onChange={handleBloodChange}
                label="Blood Type"
                value={bloodType}
              >
                {bloodTypes.map((blood) => (
                  <Option key={blood} value={blood}>
                    {blood}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <Select
                onChange={handleDonorTypeChange}
                label="Donor Types"
                value={donorType}
              >
                {donorTypes.map((donor) => (
                  <Option key={donor} value={donor}>
                    {donor}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
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
              onClick={exportUserDetailsAsPDF}
            >
              Export as PDF
            </Button>
          </div>
        </div>
      </div>
      <CardBody className="overflow-x-auto px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
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
              <tr key={user.donor_no} className="border-b">
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
                    {user.email}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {user.mobile}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal capitalize"
                  >
                    {formatDate(user.last_donated)}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal capitalize"
                  >
                    {user.donate_qty}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal capitalize"
                  >
                    {user.badge}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal capitalize"
                  >
                    {user.donor_type_desc}
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
