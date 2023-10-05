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

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
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
              {TABS.map(({ label, value }) => (
                <Tab 
                  key={value}
                  value={value}
                  onClick={() => handleTabChange(value)}
                >
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab >
              ))}
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
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        {TABS.find((tab) => tab.value === activeTab)?.tableRender}
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page 1 of 10
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Previous
          </Button>
          <Button variant="outlined" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
