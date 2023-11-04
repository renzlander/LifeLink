import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";
import React from "react";
import BloodDropletIcon from "@/public/BloodDroplet";

  export function BloodListCard({ bloodType, availability, legend }) {
    let colorClass = ""; 
    let offsetTop = 0;
    let offsetBot = 0;

    if (legend === "Empty") {
        colorClass = "text-red-600"; 
        offsetTop = 100; 
        offsetBot = 0; 
    } else if (legend === "Critically low") {
        colorClass = "text-yellow-600"; 
        offsetTop = 80; 
        offsetBot = 20; 
    } else if (legend === "Low") {
        colorClass = "text-orange-600"; 
        offsetTop = 60; 
        offsetBot = 40; 
    }

    return (
      <Card className="mt-6 w-72 h-full">
        <div className="flex mb-2">
          <CardHeader
            color="transparent"
            shadow={false}
            className='relative flex flex-col justify-center items-center h-28 w-28'
          >
            <BloodDropletIcon width={200} height={200} topOffset={offsetTop} botOffset={offsetBot} />
            <Typography
              variant="h4"
              color="white"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[40%]"
            >
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