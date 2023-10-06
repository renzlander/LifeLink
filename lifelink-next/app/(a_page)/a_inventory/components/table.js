import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Tabs,
  Tab,
  TabsHeader,
  Tooltip,
  Select,
  Option,
} from "@material-tailwind/react";
import { TabStock } from "./tabStock";
import { TabExp } from "./tabExpired";
import { TabTemp } from "./tabTdbb";
import { TabPerma } from "./tabPdbb";

const TABS = [
  {
    label: "Stock",
    value: "stock",
    tableRender: <TabStock />,
  },
  {
    label: "Expired",
    value: "exp",
    tableRender: <TabExp />,
  },
  {
    label: "TDBB",
    value: "tdbb",
    tableRender: <TabTemp />,
  },
  {
    label: "PDBB",
    value: "pdbb",
    tableRender: <TabPerma />,
  },
];

export function InventoryTable() {
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const [blood_type, setBlood] = useState("");

  const bloodTypes = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  const handleBloodChange = (selectedBlood) => {
    setBlood(selectedBlood);
  };

  return (
    <Card className="h-full w-full">
      <CardHeader color="red" className="relative h-16 flex items-center">
        <Typography variant="h4" color="white" className="ml-4">
          Inventory
        </Typography>
      </CardHeader>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value={activeTab} className="w-full md:w-max">
            <TabsHeader>
              {TABS.map(({ label, value }) => {
                let tooltipText = "";
                
                if (value === 'stock') {
                  tooltipText = 'Stock';
                } else if (value === 'exp') {
                  tooltipText = 'Expired';
                }else if (value === 'tdbb') {
                  tooltipText = 'Temporary Deferred Blood Bag';
                }else if (value === 'pdbb') {
                  tooltipText = 'Permanent Deferred Blood Bag';
                }

                return (
                  <Tooltip key={value} content={tooltipText}>
                    <Tab 
                      value={value}
                      onClick={() => handleTabChange(value)}
                    >
                      &nbsp;&nbsp;{label}&nbsp;&nbsp;
                    </Tab >
                  </Tooltip>
                );
              })}
            </TabsHeader>
          </Tabs>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            <Button className="flex items-center gap-3">
              <DocumentArrowDownIcon className="h-4 w-4" /> Export to PDF
            </Button>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div>
            <Select onChange={handleBloodChange} label="Blood Type" value={blood_type}>
            {bloodTypes.map((blood) => (
              <Option key={blood} value={blood}>
                {blood}
              </Option>
            ))}
          </Select>
          </div>
          <div className="flex items-center gap-4">
            <Input type="date" label="Start Date" className=""/>
            <Typography> to </Typography>
            <Input type="date" label="End Date" className=""/>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        {TABS.find((tab) => tab.value === activeTab)?.tableRender}
      </CardBody>
    </Card>
  );
}
