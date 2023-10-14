import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";
import React from "react";
import Image from "next/image";
import LineChart from "./lineChart";
import BarChart from "./barChart";

  export function BloodListCard({ bloodType, availability, legend }) {
    
    let colorClass = ""; 
    if (legend === "Empty") {
        colorClass = "text-red-600"; 
    } else if (legend === "Low") {
        colorClass = "text-yellow-600"; 
    } else if (legend === "Critically low") {
        colorClass = "text-orange-600"; 
    }

    let cardHeaderClass = "";
    if (legend === "Empty") {
      cardHeaderClass = "bg-black";
    } else if (legend === "Low") {
      cardHeaderClass = "bg-gradient-to-b from-black via-red-400 to-red-400";
    } else if (legend === "Critically low") {
      cardHeaderClass = "bg-gradient-to-b from-black via-black to-red-400";
    }

    return (
      <Card className="mt-6 w-72 h-full">
        <div className="flex mb-2">
          <CardHeader
            className={`relative flex flex-col justify-center items-center h-20 w-20 ${cardHeaderClass}`}
          >
            <Typography variant="h4" color="white">
              {bloodType}
            </Typography>
          </CardHeader>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              {availability}
            </Typography>
          </CardBody>
        </div>
        <CardFooter className="border-t-2 flex justify-center items-center">
          <Typography variant="p" color="blue-gray" className={`${colorClass}`}>
            {legend}
          </Typography>
        </CardFooter>
      </Card>
    );
  
  }

  
export function LineCard() {
  return (
    <Card className="mt-6 w-1/2">
      <CardHeader color="red" variant="gradient" className="flex items-center justify-center relative p-6 h-full">
        <LineChart />
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          Bloods Stored
        </Typography>
        <Typography>
          Collected blood bags in past few months
        </Typography>
      </CardBody>
      <CardFooter className="border-t">
        <Typography>
          Updated 4 min ago
        </Typography>
      </CardFooter>
    </Card>
  );

}

export function BarCard() {
  return (
    <Card className="mt-6 w-1/2">
      <CardHeader color="red" variant="gradient" className="flex items-center justify-center relative p-6 h-full">
        <BarChart />
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          Bloods Stored
        </Typography>
        <Typography>
          Collected blood bags in past few months
        </Typography>
      </CardBody>
      <CardFooter className="border-t">
        <Typography>
          Updated 4 min ago
        </Typography>
      </CardFooter>
    </Card>
  );

}