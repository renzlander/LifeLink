import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Chip,
  } from "@material-tailwind/react";
import React from "react";
import BloodDropletIcon from "@/public/BloodDroplet";

export function BloodListCard({ bloodType, availability, legend }) {
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
    <Card className="w-56">
      <CardHeader
        color="transparent"
        shadow={false}
        className='mx-auto flex flex-col justify-center items-center h-20 w-20'
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
      <CardBody className="flex items-center justify-center py-3 px-2 w-full">
        <div className="flex flex-col justify-center items-center gap-4">
          <Typography variant="paragraph" color="gray" className="text-blue-gray-500 font-medium mr-2">
            STATUS:
          </Typography>
          <Chip size="sm" variant="gradient" color={colorClass} value={legend} className="flex justify-center" />
          <Chip size="sm" variant="ghost" color={status} value={availability} className="flex justify-center"/>
        </div>
      </CardBody>
    </Card>
  );
}