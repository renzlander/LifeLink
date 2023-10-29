import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Input,
  Spinner,
  Tabs, 
  Tab, 
  TabsHeader,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { useRouter } from "next/navigation";
import { SerialNumbers } from "./serialNumbers";
import { PatientRecord } from "./patientRecord";

const SerialNumbersComponent = ({ dispensedSerialNumbers, onSearch }) => (
  <SerialNumbers dispensedSerialNumbers={dispensedSerialNumbers} onSearch={{ dispensedSerialNumbers, onSearch }} />
);
const PatientRecordComponent = ({ dispensedRecords, donors }) => (
  <PatientRecord dispensedRecords={dispensedRecords} donors={donors}/>
);
const TABS = [
  {
    label: "Stock",
    value: "stock",
    tableRender: <SerialNumbersComponent/>,
  },
  {
    label: "Expired",
    value: "exp",
    tableRender: <PatientRecordComponent />,
  },
];

export function DispenseTable() { 
  const [donors, setDonors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const [dispensedSerialNumbers, setDispensedSerialNumbers] = useState([]); // Initialize with an empty array here
  const [dispensedRecords, setDispensedRecords] = useState([]);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  const router = useRouter();

  const fetchSerialNumbers = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(`${laravelBaseUrl}/api/get-all-serial-no`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        setDispensedSerialNumbers(response.data.serialNumbers);
      } else {
        console.error("Oops! Something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching SerialNumbers:", error);
    }
  };
  const fetchDispenseRecords = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const data = {
        serialNo: searchQuery,
        serialNumbers: serialNumbersArray,
    };

      const response = await axios.post(`${laravelBaseUrl}/api/dispensed-list`, data,{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (response.data.status === "success") {
        setDispensedRecords(response.data.dispensedList);
        setDonors(response.data.donors); 
      } else {
        console.error("Oops! Something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching SerialNumbers:", error);
    }
  }

  const serialNumbersArray = dispensedRecords.map((record) =>
    record.serial_numbers.split(',').map((serial) => serial.trim())
  ).flat();

  useEffect(() => {
    const fetchSerialNumbers = async () => {
      try {
        // Your API call to fetch serial numbers
        // Example:
        const response = await axios.get(`${laravelBaseUrl}/api/get-all-serial-no`);

        if (response.data.status === "success") {
          setDispensedSerialNumbers(response.data.serialNumbers);
        } else {
          console.error("Oops! Something went wrong while fetching serial numbers.");
        }
      } catch (error) {
        console.error("Error fetching SerialNumbers:", error);
      }
    };

    fetchSerialNumbers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      // Only make the API call when searchQuery is not empty
      fetchDispenseRecords();
    }
  }, [searchQuery]);

  return (
    <Card className="h-full w-full mt-4">
      <CardHeader color="red" className="relative h-16 flex items-center">
        <Typography variant="h4" color="white" className="ml-4">
          Dispensed Bloods
        </Typography>
      </CardHeader>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-6">
        <div className="mb-4 ml-4 mr-4 flex justify-end items-center">
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <Tabs value={activeTab} className="w-full md:w-max">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab value={value} onClick={() => handleTabChange(value)}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setSearchQuery(inputValue);
                  fetchData(inputValue);
                }}
              />
            </div>
            <Button
              className="flex items-center gap-3"
              size="sm"
            >
              Export as PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-x-auto px-0">
        {TABS.find((tab) => tab.value === activeTab)?.tableRender} 
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        {/* <Button
          variant="outlined"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <IconButton
              key={index}
              variant={currentPage === index + 1 ? "outlined" : "text"}
              size="sm"
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
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
        </Button> */}
      </CardFooter>
    </Card>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}