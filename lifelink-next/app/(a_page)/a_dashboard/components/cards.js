import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Chip,
    Select,
    Option,
  } from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { laravelBaseUrl } from "@/app/variables";
import axios from "axios";
import BloodDropletIcon from "@/public/BloodDroplet";

export function BloodListCard({ bloodType, availability, legend, count, percentage }) {
  let colorClass = "";
  let offsetTop = 0;
  let offsetBot = 0;

  if (legend === "Empty") {
      colorClass = "gray";
      offsetTop = 100; 
      offsetBot = 0; 
  } else if (legend === "Critically low") {
      colorClass = "red"; 
      offsetTop = 80; 
      offsetBot = 20; 
  } else if (legend === "Low") {
      colorClass = "orange"; 
      offsetTop = 60; 
      offsetBot = 40; 
  }

  let status = "";
  if (availability === "Available") {
    status = "green";
  } else {
    status = "blue-gray";
  }
  
  return (
    <Card className="3xl:w-72 w-[13.5rem]">
      <CardHeader
        color="red"
        variant="filled"
        shadow={false}
        floated={false} 
        className='mx-auto flex flex-col justify-center items-center h-16 w-16 p-2'
      >
        <BloodDropletIcon width={200} height={200} topOffset={offsetTop} botOffset={offsetBot} />
        <Typography
          variant="h6"
          color="white"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[40%]"
        >
          {bloodType}
        </Typography>
      </CardHeader>
      <CardBody className="flex items-center justify-center py-3 px-4 w-full">
        <div className="flex items-center">
          <Typography variant="paragraph" color="gray" className="text-blue-gray-500 font-medium mr-2">
            Quantity:
          </Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-xl font-semibold">
            {count}
          </Typography>
        </div>
        <div className="flex gap-2">
        </div>
      </CardBody>
      <hr className="fading_divider_gray" />
      <CardFooter className="flex justify-start items-center p-3">
        <div className="flex justify-between items-center gap-2 w-full">
          <Typography variant="paragraph" className='text-gray-600 text-sm font-medium'>
            Status:
          </Typography>
          <div className="flex flex-col gap-2">
            <Chip size="sm" variant="gradient" color={colorClass} value={legend} className="flex justify-center" />
            <Chip size="sm" variant="gradient" color={status} value={availability} className="flex justify-center"/>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function CountDonorCard({donorCount, deferralsCount, dispensedCount, expiredCount}) {
  const TABLE_ROWS = [
    {
      label: "Donors",
      count: donorCount,
    },
    {
      label: "Deffered",
      count: deferralsCount,
    },
    {
      label: "Dispensed Blood",
      count: dispensedCount,
    },
    {
      label: "Expired Blood",
      count: expiredCount,
    },
    {
      label: "Spoiled Blood Bag",
      count: "0",
    },
    {
      label: "Reactive Blood Bag",
      count: "0",
    },
  ];

  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date();
    date.setMonth(index);
    return date.toLocaleDateString(undefined, { month: "long" });
  });

  const startYear = 2000;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, index) => {
    return (currentYear - index).toString();
  });

  return (
    <Card className="mt-6 w-full">
      <CardHeader color="gray" className="relative h-16 flex items-center mb-4">
        <Typography variant="h4" color="white" className="ml-4">
          MBD Summary
        </Typography>
      </CardHeader>
      <CardBody className="p-0">
      <div className="mt-3 flex justify-end items-center gap-3 w-full px-4">
        <Select label="Month" containerProps={{ className: "min-w-[25px]" }}>
          {months.map((month) => (
            <Option key={month} value={month}>{month}</Option>
          ))}
        </Select>
        <Select label="Year" containerProps={{ className: "min-w-[25px]" }}>
          {years.map((year) => (
            <Option key={year} value={year}>{year}</Option>
          ))}
        </Select>
      </div>
      <table className="w-full min-w-max table-auto text-left">
        <tbody>
          {TABLE_ROWS.map(({ label, count }, index) => {
            const isLast = index === TABLE_ROWS.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
 
            return (
              <tr key={label}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    className="font-normal text-blue-gray-500"
                  >
                    {label}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    className="font-normal text-blue-gray-500"
                  >
                    {count}
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </CardBody>
    </Card>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
