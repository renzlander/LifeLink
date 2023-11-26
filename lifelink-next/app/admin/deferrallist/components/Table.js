import {
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Tab,
  Tabs,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { PermanentTable } from "./TabPerma";
import { TemporaryTable } from "./TabTemp";

const TABS = [
  {
    label: "TEMPORARY",
    value: "tdef",
    tableRender: <TemporaryTable />,
  },
  {
    label: "PERMANENT",
    value: "pdef",
    tableRender: <PermanentTable />,
  },
];

export function DeferralTable() {
  const [activeTab, setActiveTab] = useState(TABS[0].value);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  return (
    <Card className="h-full w-full">
      <CardHeader color="red" className="relative h-16 flex items-center">
        <Typography variant="h4" color="white" className="ml-4">
          Deferral List
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
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        {TABS.find((tab) => tab.value === activeTab)?.tableRender}
      </CardBody>
    </Card>
  );
}
