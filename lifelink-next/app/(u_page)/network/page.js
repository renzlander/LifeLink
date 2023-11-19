"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardHeader, Typography, Button, CardBody, Tabs, Tab, TabsHeader, Tooltip, Input, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import Request from "./components/requestTab";
import History from "./components/historyTab";

const TABS = [
  {
      label: "Blood Request/Donor Interest",
      value: "request",
      tableRender: <Request />,
  },
  {
      label: "Blood Request History",
      value: "history",
      tableRender: <History />,
  }
];

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS[0].value);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  return (
    <div className="bg-gray-300 min-h-screen flex flex-col gap-y-3 py-4">
      <Card className="w-full mt-8 bg-gray-100">
        <CardHeader color="red" className="relative h-16 flex items-center">
          <Typography variant="h4" color="white" className="ml-4">
            Blood Network
          </Typography>
        </CardHeader>
        <Tabs value={activeTab} className="md:w-1/3 w-full p-4 mx-4 mt-4">
          <TabsHeader className="justify-content: space-between">
            {TABS.map(({ label, value }) => {
              let tooltipText = "";
        
              if (value === "request") {
                tooltipText = "Blood Request/Donor Interest";
              } else if (value === "history") {
                tooltipText = "Blood Request History";
              }
        
              return (
                <Tooltip key={value} content={tooltipText}>
                  <Tab value={value} onClick={() => handleTabChange(value)}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                </Tooltip>
              );
            })}
          </TabsHeader>
        </Tabs>
        <CardBody className="overflow-x-auto px-0">
          {TABS.find((tab) => tab.value === activeTab)?.tableRender}
        </CardBody>
      </Card>
    </div>
    );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
