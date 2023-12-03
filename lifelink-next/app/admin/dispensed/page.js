"use client";
import { laravelBaseUrl } from "@/app/variables";
import axios from "axios";
import { useEffect, useState } from "react";
import { PatientRecord } from "./components/PatientRecord";
import { SerialNumbers } from "./components/SerialNumbers";
import { DispenseTable } from "./components/Table";

import { Card, Tab, Tabs, TabsHeader } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

const TABS = [
  {
    label: "Dispensed Blood Finder",
    value: "stock",
  },
  {
    label: "Dispensed List",
    value: "exp",
  },
];

export default function Home() {
  const [dispensedSerialNumbers, setDispensedSerialNumbers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dispensedRecords, setDispensedRecords] = useState([]);
  const [donors, setDonors] = useState([]);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  const fetchSerialNumbers = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-all-serial-no`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      const response = await axios.post(
        `${laravelBaseUrl}/api/dispensed-list`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setDispensedRecords(response.data.dipensedList);
        setDonors(response.data.donors);
      } else {
        console.error("Oops! Something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching SerialNumbers:", error);
    }
  };

  const serialNumbersArray = dispensedRecords
    .map((record) =>
      record.serial_numbers.split(",").map((serial) => serial.trim())
    )
    .flat();

  useEffect(() => {
    fetchSerialNumbers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      fetchDispenseRecords();
    }
  }, [searchQuery, fetchDispenseRecords]);

  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center gap-10 py-4 px-6">
      <Card className="w-full">
        <Tabs value={activeTab} className="w-full">
          <TabsHeader>
            {TABS.map(({ label, value }) => {
              return (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => handleTabChange(value)}
                >
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              );
            })}
          </TabsHeader>
        </Tabs>
      </Card>
      {activeTab === TABS[0].value ? (
        <div className="flex items-start justify-between gap-3 w-full">
          <SerialNumbers
            dispensedSerialNumbers={dispensedSerialNumbers}
            onSearch={handleSearch}
          />
          <PatientRecord dispensedRecords={dispensedRecords} donors={donors} />
        </div>
      ) : (
        <DispenseTable />
      )}
    </div>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
