import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import {
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Input,
  Option,
  Select,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { differenceInYears, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ViewPopUp } from "./PopupView";

const TABLE_HEAD = [
  { label: "Dispensed Date", key: "dispensed_date" },
  { label: "Full Name", key: "full_name" },
  { label: "Blood Type", key: "blood_type" },
  { label: "Age", key: "dob" },
  { label: "Sex", key: "sex" },
  { label: "Diagnosis", key: "diagnosis" },
  { label: "Hospital", key: "hospital" },
  { label: "Payment", key: "payment" },
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

export function DispenseTable() {
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleRows, setVisibleRows] = useState(8);
  const [blood_type, setBlood] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bloodQty, setBloodQty] = useState();
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [hospital, setHospital] = useState("All");
  const [payment, setPayment] = useState("All");
  const router = useRouter();

  const bloodTypes = ["All", "AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];
  const paymentTypes = ["All", "Free", "Discounted"];

  const calculateAge = (dateOfBirth) => {
    const dobDate = parseISO(dateOfBirth);
    const currentDate = new Date();
    return differenceInYears(currentDate, dobDate);
  };

  const dynamicHospitalOptions = [
    {
      label: "All",
      value: "All",
    },
    ...hospitalOptions.map((item) => ({
      label: item.hospital_desc,
      value: item.hospitals_id.toString(),
    })),
  ];

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

  const handleBloodChange = (selectedBlood) => {
    setBlood(selectedBlood);
    fetchBloodTypeFilteredData(
      selectedBlood,
      hospital,
      payment,
      startDate,
      endDate
    );
  };
  const handlePaymentChange = (selectedPayment) => {
    setPayment(selectedPayment);
    fetchBloodTypeFilteredData(
      blood_type,
      hospital,
      selectedPayment,
      startDate,
      endDate
    );
  };
  const handleHospital = (selectedHospital) => {
    setHospital(selectedHospital);
    fetchBloodTypeFilteredData(
      blood_type,
      selectedHospital,
      payment,
      startDate,
      endDate
    ); // Pass the selected remarks here
  };

  const fetchBloodTypeFilteredData = async (
    blood_type,
    hospital,
    payment,
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
        `${laravelBaseUrl}/api/dispList`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            blood_type: blood_type,
            hospital: hospital,
            payment: payment, // Use the selected payment
            startDate: startDate,
            endDate: endDate,
          },
        }
      );

      console.log(response);
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

  const fetchData = async (page = "") => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-dispensed-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    getHospitalList(); // Fetch hospital options

    // Initial data fetch with default values
    fetchBloodTypeFilteredData(
      blood_type,
      hospital,
      payment,
      startDate,
      endDate
    );
  }, [router, searchQuery, blood_type, hospital, payment, startDate, endDate]);

  const exportBloodBagsAsPDF = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Send a request to the PDF export endpoint
      const response = await axios.get(
        `${laravelBaseUrl}/api/export-patient-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
          params: {
            blood_type: blood_type,
            payment: payment,
            hospital: hospital,
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

  const loadMoreRows = () => {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 4);
  };

  const filteredUserDetails = userDetails
    ? userDetails.filter((user) => {
        const fullName =
          `${user.first_name} ${user.middle_name} ${user.last_name}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      })
    : [];

  if (loading) {
    return (
      <div className="flex min-h-screen max-w-full flex-col py-2 justify-center items-center">
        <Spinner color="red" className="h-16 w-16" />
        <p className="mb-[180px] text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardBody>
        <div className="flex items-center justify-between px-4 mb-4">
          <div className="">
            <Typography
              variant="subtitle1"
              className="mb-2 flex justify-center font-bold text-red-800"
            >
              No. of Patients:{bloodQty}
            </Typography>
            <div className="flex items-center gap-4">
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
              <Select
                onChange={handlePaymentChange}
                label="Payment"
                value={payment}
              >
                {paymentTypes.map((payment) => (
                  <Option key={payment} value={payment}>
                    {payment}
                  </Option>
                ))}
              </Select>
              <InputSelect
                label="Hospital"
                containerProps={{ className: "w-[50%]" }}
                value={hospital}
                onSelect={handleHospital}
                options={dynamicHospitalOptions}
                isSearchable
                required
                placeholder="Hospital"
              />
            </div>
          </div>
          <div>
            <Typography
              variant="subtitle1"
              className="mb-2 flex justify-center font-bold text-red-800"
            >
              Dispensed Date Filter
            </Typography>
            <div className="flex items-center gap-4">
              <Input
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  setStartDate(newStartDate);
                  console.log("newStartDate", newStartDate);
                  fetchBloodTypeFilteredData(
                    blood_type,
                    hospital,
                    payment,
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
                    hospital,
                    payment,
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
                className="flex items-center gap-3"
                onClick={exportBloodBagsAsPDF}
              >
                <DocumentArrowDownIcon className="h-4 w-4" /> Export to PDF
              </Button>
            </div>
          </div>
        </div>

        <table className="w-full min-w-max table-auto text-left">
          <thead>
            {TABLE_HEAD.map((head) => (
              <th
                key={head.key}
                className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer"
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
          </thead>
          <tbody>
            {filteredUserDetails.slice(0, visibleRows).map((user, index) => (
              <tr>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {formatDate(user.created_at)}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {user.first_name} {user.middle_name} {user.last_name}
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
                    {calculateAge(user.dob)}{" "}
                    {/* Calculate age based on date of birth */}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {user.sex}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {user.diagnosis}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {user.hospital_desc}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {user.payment}
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
