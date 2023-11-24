"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardHeader, Typography, Button, CardBody, Tabs, Tab, TabsHeader, Tooltip, Input, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import Request from "./components/RequestTab";
import History from "./components/HistoryTab";

const TABS = [
  {
      label: "Created Posts",
      value: "request",
      tableRender: <Request />,
  },
  {
      label: "Blood Requests",
      value: "history",
      tableRender: <History />,
  }
];

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS[0].value);

  const handleTabChange = (tabValue) => setActiveTab(tabValue);;

  return (
    <div className="w-full min-h-screen flex flex-col py-4 ">
      <Card className="w-full mt-8 bg-gray-100">
        <CardHeader color="red" className="relative h-16 flex items-center">
          <Typography variant="h4" color="white" className="ml-4">
            Blood Network
          </Typography>
        </CardHeader>
        <Tabs value={activeTab} className="w-full 2xl:w-1/2 p-4 2xl:mx-4 mt-4">
          <TabsHeader className="justify-content: space-between">
            {TABS.map(({ label, value }) => {
              let tooltipText = "";
        
              if (value === "request") {
                tooltipText = "Blood Donor Requests";
              } else if (value === "history") {
                tooltipText = "Blood Request Made";
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
