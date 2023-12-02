import { laravelBaseUrl } from "@/app/variables";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AddBloodBagPopup } from "./PopupAdd";
import { AddUsers } from "./PopupAddUser";
import { EditPopUp } from "./PopupEdit";
import { MoveToDeferral } from "./PopupMoveToDeferral";
import { ViewPopUp } from "./PopupView";

const TABLE_HEAD = [
  { label: "Donor Number", key: "donor_no" },
  { label: "Full Name", key: "fullname" },
  { label: "Blood Type", key: "blood_type" },
  { label: "Email Address", key: "email" },
  { label: "Mobile", key: "mobile" },
  { label: "Birthday", key: "dob" },
  { label: "Last Date Donated", key: "datedonated" },
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

export function UsersTable() {
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleRows, setVisibleRows] = useState(8); // Track visible rows
  const [bledByOptions, setBledByOptions] = useState([]);
  const [venueOptions, setVenueOptions] = useState([]);
  const [temporaryDeferralCategories, setTemporaryDeferralCategories] =
    useState([]);
  const [permanentDeferralCategories, setPermanentDeferralCategories] =
    useState([]);
  const router = useRouter();

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
          const permaCategories = response.data.permaCategories;

          setTemporaryDeferralCategories(tempCategories);
          setPermanentDeferralCategories(permaCategories);
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
        setBledByOptions(response.data.bledBy);
        setVenueOptions(response.data.venue);
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

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-user-details`,
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
    fetchData();
    fetchBledByAndVenueLists();
  }, [router, searchQuery]);

  const exportUserDetailsAsPDF = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/export-pdf-user-details`,
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

  if (loading) {
    return (
      <div className="flex min-h-screen max-w-full flex-col py-2 justify-center items-center">
        <Spinner color="red" className="h-16 w-16" />
        <p className="mb-[180px] text-gray-600">Loading...</p>
      </div>
    );
  }

  const loadMoreRows = () => {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 4);
  };

  const filteredUserDetails = userDetails.filter((user) => {
    const fullName = `${user.first_name} ${user.middle_name} ${user.last_name}`.toLowerCase();
    const email = user.email.toLowerCase();
    const mobile = user.mobile.toLowerCase();
    const donorNumber = String(user.donor_no).toLowerCase(); // Convert to string
    
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      mobile.includes(searchQuery.toLowerCase()) ||
      donorNumber.includes(searchQuery.toLowerCase())
    );
  });
  
  
  const handleClear = () => {
    onChange("");
  };

  return (
    <Card className="h-full w-full mt-4">
      <CardHeader color="red" className="relative h-16 flex items-center">
        <Typography variant="h4" color="white" className="ml-4">
          Users List
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-auto px-0">
        <div className="mb-4 ml-4 mr-4 flex justify-between items-center">
          <div>
            <AddUsers refreshData={fetchData} />
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
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
              size="sm"
              onClick={exportUserDetailsAsPDF}
            >
              Export as PDF
            </Button>
          </div>
        </div>
        {userDetails.length === 0 ? (
          <div className="text-center text-gray-600 mt-8">
            No users available.
          </div>
        ) : (
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
                <tr
                  key={user.donor_no}
                  className="border-b border-blue-gray-100"
                >
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
                      className="font-normal capitalize"
                    >
                      {user.latest_date_donated
                        ? formatDate(user.latest_date_donated)
                        : "Not yet donated"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <ViewPopUp user={user} />
                    <EditPopUp user={user} refreshData={fetchData} />
                  </td>
                  <td
                    className={`${classes} mt-1 flex items-center justify-center gap-2`}
                  >
                    {user.remarks !== 0 ? (
                      <Chip size="lg" value="DEFERRED" color="blue-gray">
                        DEFERRED
                      </Chip>
                    ) : (
                      <div className="space-x-2">
                        <AddBloodBagPopup
                          user_id={user.user_id}
                          bledByOptions={bledByOptions}
                          venueOptions={venueOptions}
                        />
                        <MoveToDeferral
                          user_id={user.user_id}
                          refreshData={fetchData}
                          temporaryDeferralCategories={
                            temporaryDeferralCategories
                          }
                          permanentDeferralCategories={
                            permanentDeferralCategories
                          }
                          venueOptions={venueOptions}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {visibleRows < userDetails.length && (
          <div className="flex justify-center mt-4">
            <Button onClick={loadMoreRows}>Load More</Button>
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
