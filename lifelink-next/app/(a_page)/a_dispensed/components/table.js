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
  Chip,
  Tabs,
  Tab,
  TabsHeader,
} from "@material-tailwind/react";
import { ViewPopUp } from "./popupView";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { useRouter } from "next/navigation";
import { SerialNumbers } from "./serialNumbers";
import { PatientRecord } from "./patientRecord";

export function DispenseTable({ dispensedSerialNumbers, fetchDispenseRecords, dispensedRecords, donors}) {
  const [searchQuery, setSearchQuery] = useState(""); 

  // Function to update the search query
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      // Only make the API call when searchQuery is not empty
      fetchDispenseRecords;
    }
  }, [searchQuery]);

  const TABS = [
    {
        label: "Dispensed Blood Finder",
        value: "stock",
        tableRender: 
          <SerialNumbers 
            dispensedSerialNumbers={dispensedSerialNumbers}
            onSearch={handleSearch} // Pass the search query update function
          />,
    },
    {
        label: "Patiend Record",
        value: "exp",
        tableRender: 
          <PatientRecord 
            dispensedRecords={dispensedRecords}
            donors={donors}
          />,
    },
  ];

  const [activeTab, setActiveTab] = useState(TABS[0].value);

  const handleTabChange = (tabValue) => {
      setActiveTab(tabValue);
  };

  return (
    <Card className="h-full w-full mt-4">
      <CardHeader color="red" className="relative h-16 flex items-center">
        <Typography variant="h4" color="white" className="ml-4">
          Dispensed Bloods
        </Typography>
      </CardHeader>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-6">
        <Tabs value={activeTab} className="w-full">
          <TabsHeader>
              {TABS.map(({ label, value }) => {
                  return (
                    <Tab value={value} onClick={() => handleTabChange(value)}>
                        &nbsp;&nbsp;{label}&nbsp;&nbsp;
                    </Tab>
                  );
              })}
          </TabsHeader>
        </Tabs>
      </CardHeader>
      <CardBody className="overflow-x-auto px-0">
        {TABS.find((tab) => tab.value === activeTab)?.tableRender}
      </CardBody>
    </Card>
  );
}

