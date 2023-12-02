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
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TABLE_HEAD = [
  { label: "Donor Number", key: "donor_no" },
  { label: "Name", key: "name" },
  { label: "Blood Type", key: "blood_type" },
  { label: "Email Address", key: "email" },
  { label: "Mobile", key: "mobile" },
  { label: "Birthday", key: "dob" },
  { label: "Duration (Days)", key: "deferred_duration" },
  { label: "Category", key: "category" },
  { label: "Remarks", key: "remarks" },
  { label: "End Date of Deferral", key: "end_date" },
  { label: "", key: "tools" },
  { label: "", key: "actions" },
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

export function TemporaryTable() {
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleRows, setVisibleRows] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [remarks, setRemarks] = useState("All");
  const [temporaryDeferralCategories, setTemporaryDeferralCategories] =
    useState([]);

  const router = useRouter();
  console.log("temporaryDeferralCategories:", temporaryDeferralCategories);

  const dynamicTemporaryCategories = [
    {
      label: "All",
      value: "All",
    },
    ...temporaryDeferralCategories.map((item) => ({
      label: item.category_desc,
      value: item.category_desc,
    })),
  ];

  const dyanamicRemarksOptions = [
    {
      label: "All",
      value: "All",
    },
    ...temporaryDeferralCategories.map((item) => ({
      label: item.remarks,
      value: item.remarks,
    })),
  ];

  useEffect(() => {
    const fetchDeferralCategories = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `${laravelBaseUrl}/api/get-defferal-categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          const tempCategories = response.data.tempCategories;
          setTemporaryDeferralCategories(tempCategories);
        } else {
          console.error("Failed to fetch deferral categories.");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching deferral categories:",
          error
        );
      }
    };

    fetchDeferralCategories();
  }, []);

  const handleCategorySelect = (selectedValue) => {
    console.log("handleCategorySelect:", selectedValue);
    setCategory(selectedValue);
  };

  const handleRemarksSelect = (selectedValue) => {
    console.log("handleRemarksSelect:", selectedValue);
    setRemarks(selectedValue);
  };

  const fetchData = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-temporary-defferal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            category: category,
            remarks: remarks,
          },
        }
      );

      console.log("Response:", response);

      if (response && response.data && response.data.status === "success") {
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
    fetchData();
  }, [router, searchQuery, category, remarks]);

  const exportUserDetailsAsPDF = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Send a request to the PDF export endpoint
      const response = await axios.get(
        `${laravelBaseUrl}/api/export-pdf-user-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Set the response type to blob for binary data
        }
      );

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
    <>
      <Card className="w-full -mb-6">
        <CardBody className="px-0">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex flex-row px-4 gap-6">
              <InputSelect
                label="Category"
                value={category}
                onSelect={handleCategorySelect}
                options={dynamicTemporaryCategories}
                isSearchable
                required
                placeholder="Category"
              />
              <InputSelect
                label="Remarks"
                value={remarks}
                onSelect={handleRemarksSelect}
                options={dyanamicRemarksOptions}
                isSearchable
                required
                placeholder="Remarks"
              />
            </div>
            <div className="flex items-center gap-3 px-4">
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
                onClick={exportUserDetailsAsPDF}
              >
                <DocumentArrowDownIcon className="h-4 w-4" /> Export to PDF
              </Button>
            </div>
          </div>
          {/* <div>
            <Typography
              variant="subtitle1"
              className="mb-2 flex justify-center font-bold text-red-800"
            >
            </Typography>
          </div> */}
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
                <tr key={user.donor_no}>
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
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {`${user.first_name} ${user.middle_name} ${user.last_name}`}
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
                      {formatDate(user.dob)}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {user.deferred_duration}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {user.category_desc}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {user.remarks}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {formatDate(user.end_date)}
                    </Typography>
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
    </>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
