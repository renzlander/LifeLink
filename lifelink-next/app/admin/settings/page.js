"use client";
import { Card, List, ListItem, Typography } from "@material-tailwind/react";
import { BledByCrud } from "./components/BledCrud";
import { HospitalCrud } from "./components/HospitalsCrud";
import { MaintenanceSwitch } from "./components/Maintenance";
import { PDCatCrud } from "./components/PdcatCrud";
import { SecurityPin } from "./components/SecurityPin";
import { TDCatCrud } from "./components/TdcatCrud";
import { TDRemCrud } from "./components/TdremCrud";
import { VenueCrud } from "./components/VenueCrud";

import HospitalIcon from "@/public/HospitalIcon";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  HomeModernIcon,
  KeyIcon,
  QueueListIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

export default function Home() {
  const menu = [
    {
      title: "Maintenance Mode",
      url: "#mainte",
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-black" />,
    },
    {
      title: "Venues",
      url: "#venue",
      icon: <HomeModernIcon className="h-5 w-5 text-black" />,
    },
    {
      title: "Hospitals",
      url: "#hospital",
      icon: <HospitalIcon className="h-5 w-5" />,
    },
    {
      title: "Bled By",
      url: "#bled",
      icon: <UserIcon className="h-5 w-5 text-black" />,
    },
    {
      title: "Temporary Deferral Category",
      url: "#tdcat",
      icon: <QueueListIcon className="h-5 w-5 text-black" />,
    },
    {
      title: "Temporary Deferral Remarks",
      url: "#tdrem",
      icon: <QueueListIcon className="h-5 w-5 text-black" />,
    },
    {
      title: "Permanent Deferral Category",
      url: "#pdcat",
      icon: <QueueListIcon className="h-5 w-5 text-black" />,
    },
    {
      title: "Security Pin",
      url: "#security",
      icon: <KeyIcon className="h-5 w-5 text-black" />,
    },
  ];

  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between py-4 px-6">
      <div className="w-full flex justify-between gap-4">
        <Card className="w-1/3 h-full overflow-auto sticky top-20">
          <List>
            {menu.map((item, index) => (
              <Typography
                key={index}
                as="a"
                href={item.url}
                className="scroll-smooth"
              >
                <ListItem className="flex items-center gap-3">
                  {item.icon}
                  {item.title}
                </ListItem>
              </Typography>
            ))}
          </List>
        </Card>
        <div className="w-full flex flex-col gap-4">
          <MaintenanceSwitch />
          <VenueCrud />
          <HospitalCrud />
          <BledByCrud />
          <TDCatCrud />
          <TDRemCrud />
          <PDCatCrud />
          <SecurityPin />
        </div>
      </div>
    </div>
  );
}
