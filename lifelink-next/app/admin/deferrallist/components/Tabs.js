import { Square3Stack3DIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import React from "react";
import { PermanentDeferralTable } from "./TablePermanentDeferral";
import { TemporaryDeferralTable } from "./TableTemporaryDeferral";

export function DeferralTabs() {
  const data = [
    {
      label: "Temporary Deferral",
      value: "dashboard",
      icon: Square3Stack3DIcon,
      desc: <TemporaryDeferralTable />,
    },
    {
      label: "Permanent Deferral",
      value: "profile",
      icon: UserCircleIcon,
      desc: <PermanentDeferralTable />,
    },
  ];

  return (
    <div className="w-full">
      {" "}
      {/* Adjust the width as needed */}
      <Tabs value="dashboard">
        <TabsHeader>
          {data.map(({ label, value, icon }) => (
            <Tab key={value} value={value}>
              <div className="flex items-center gap-2">
                {React.createElement(icon, { className: "w-5 h-5" })}
                {label}
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
}
