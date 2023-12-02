"use client";
import { Card, List, ListItem, Typography } from "@material-tailwind/react";
import { BledByCrud } from "./components/BledCrud";
import { HospitalCrud } from "./components/HospitalsCrud";
import { MaintenanceSwitch } from "./components/Maintenance";
import { PDCatCrud } from "./components/PdcatCrud";
import { SecurityPin } from "./components/SecurityPin";
import { TDCatCrud } from "./components/TdcatCrud";
import { ReactiveRemarksCrud } from "./components/ReactiveCrud";
import { SpoiledRemarksCrud } from "./components/SpoiledCrud";

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
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-black" />,
      scroll: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    {
      title: "Venues",
      icon: <HomeModernIcon className="h-5 w-5 text-black" />,
      scroll: () => {
        window.scrollTo({ top: 215, behavior: "smooth" });
      }
    },
    {
      title: "Hospitals",
      icon: <HospitalIcon className="h-5 w-5" />,
      scroll: () => {
        window.scrollTo({ top: 737, behavior: "smooth" });
      }
    },
    {
      title: "Bled By",
      icon: <UserIcon className="h-5 w-5 text-black" />,
      scroll: () => {
        window.scrollTo({ top: 1260, behavior: "smooth" });
      }
    },
    {
      title: "Temporary Deferral Category",
      icon: <QueueListIcon className="h-5 w-5 text-black" />,
      scroll: () => {
        window.scrollTo({ top: 1790, behavior: "smooth" });
      }
    },
    {
      title: "Permanent Deferral Category",
      icon: <QueueListIcon className="h-5 w-5 text-black" />,
      scroll: () => {
        window.scrollTo({ top: 2313, behavior: "smooth" });
      }
    },
    {
      title: "Reactive Blood Bags Remarks",
      icon: <QueueListIcon className="h-5 w-5 text-black" />,
      scroll: () => {
        window.scrollTo({ top: 2836, behavior: "smooth" });
      }
    },
    {
      title: "Spoiled Blood Bags Remarks",
      icon: <QueueListIcon className="h-5 w-5 text-black" />,
      scroll: () => {
        window.scrollTo({ top: 3366, behavior: "smooth" });
      }
    },
    {
      title: "Security Pin",
      icon: <KeyIcon className="h-5 w-5 text-black" />,
      scroll: () => {
        window.scrollTo({ top: 3853, behavior: "smooth" });
      }
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
                onClick={item.scroll}
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
          <PDCatCrud />
          <ReactiveRemarksCrud />
          <SpoiledRemarksCrud />
          <SecurityPin />
        </div>
      </div>
    </div>
  );
}
