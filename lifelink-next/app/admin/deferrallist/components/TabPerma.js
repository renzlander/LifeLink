import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import {
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
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
  { label: "Category", key: "category" },
  { label: "", key: "tools" },
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

export function PermanentTable() {
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleRows, setVisibleRows] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [permanentDeferralCategories, setPermanentDeferralCategories] =
    useState([]);

  const dynamicPermaCategories = [
    {
      label: "All",
      value: "All",
    },
    ...permanentDeferralCategories.map((item) => ({
      label: item.category_desc,
      value: item.category_desc,
    })),
  ];

  const handleCategorySelect = (selectedValue) => {
    setCategory(selectedValue);
  };

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
          const permaCategories = response.data.permaCategories;
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

  const fetchData = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-permanent-defferal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            category: category,
          },
        }
      );


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
  }, [router, searchQuery, category]);

  const exportUserDetailsAsPDF = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Send a request to the PDF export endpoint
      const response = await axios.get(
        `${laravelBaseUrl}/api/export-permanent-defferal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
          params: {
            category: category,
          },
        }
      );

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      const fileName = `exported_document_${Date.now()}.pdf`;

      const pdfUrl = window.URL.createObjectURL(pdfBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = pdfUrl;
      downloadLink.download = fileName;

      document.body.appendChild(downloadLink);
      downloadLink.click();

      document.body.removeChild(downloadLink);

      window.URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  const loadMoreRows = () => {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 4);
  };

  const filteredUserDetails = userDetails.filter((user) => {
    const searchFields = [
      user.donor_no.toString(),
      `${user.first_name} ${user.last_name}`,
      user.blood_type,
      user.email,
      user.mobile.toString(),
      formatDate(user.dob),
      user.category_desc,
      user.specific_reason,
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
    <>
      <Card className="w-full -mb-6">
        <CardBody className="px-0">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex flex-row px-4 gap-6">
              <InputSelect
                label="Category"
                value={category}
                onSelect={handleCategorySelect}
                options={dynamicPermaCategories}
                isSearchable
                required
                placeholder="Category"
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
                      {`${user.first_name} ${user.last_name}`}
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
                      {user.category_desc}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {user.specific_reason}
                    </Typography>
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
    </>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
