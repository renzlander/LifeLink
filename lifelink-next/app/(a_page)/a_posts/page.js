"use client";
import Image from "next/image";
import { PostCard, FilterCheckBox, CreatePost } from "./components/post";
import { Card, CardHeader, CardBody, Checkbox, Typography, List, ListItem, ListItemPrefix, Avatar, Chip, Tabs, Tab, TabsHeader, Tooltip } from "@material-tailwind/react";
import React, { useState } from "react";

const TABS = [
    {
        label: "Blood Request",
        value: "bloodRequest",
        tableRender: <PostCard />,
    },
    {
        label: "Find Donor",
        value: "findDonor",
        tableRender: <CreatePost />,
    },
];
export default function Home() {
    const [activeTab, setActiveTab] = useState(TABS[0].value);

    const handleTabChange = (tabValue) => {
        setActiveTab(tabValue);
    };
    return (
        <div className="bg-gray-200 flex h-screen flex-col items-center justify-between p-12">
            <Card className="h-full w-full mt-4">
                <CardHeader color="red" className="relative h-16 flex items-center">
                    <Typography variant="h4" color="white" className="ml-4">
                        Blood Network
                    </Typography>
                </CardHeader>

                <CardBody className="overflow-x-auto px-0">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row px-8 pb-6">
                        <Tabs value={activeTab} className="w-1/3">
                            <TabsHeader>
                                {TABS.map(({ label, value }) => {
                                    let tooltipText = "";

                                    if (value === "bloodRequest") {
                                        tooltipText = "Blood Request";
                                    } else if (value === "findDonor") {
                                        tooltipText = "Find Donor";
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
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">{TABS.find((tab) => tab.value === activeTab)?.tableRender}</div>
                </CardBody>
            </Card>
        </div>
    );
}
