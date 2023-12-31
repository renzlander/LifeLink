import {
  Card,
  CardBody,
  CardHeader,
  Tab,
  Tabs,
  TabsHeader,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { TabExp } from "./TabExpired";
import TabRBB from "./TabRbb";
import TabSBB from "./TabSbb";
import { TabStock } from "./TabStock";

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
    label: "RBB",
    value: "tdbb",
    tableRender: <TabRBB />,
  },
  {
    label: "SBB",
    value: "pdbb",
    tableRender: <TabSBB />,
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
              {TABS.map(({ label, value }) => {
                let tooltipText = "";

                if (value === "stock") {
                  tooltipText = "Stock";
                } else if (value === "exp") {
                  tooltipText = "Expired";
                } else if (value === "tdbb") {
                  tooltipText = "Reactive Blood Bags";
                } else if (value === "pdbb") {
                  tooltipText = "Spoiled Blood Bags";
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
      </CardHeader>
      <CardBody className="px-0">
        {TABS.find((tab) => tab.value === activeTab)?.tableRender}
      </CardBody>
    </Card>
  );
}
