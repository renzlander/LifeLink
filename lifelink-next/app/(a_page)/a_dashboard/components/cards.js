import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";
import React from "react";
import LineChart from "./tableChart";
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

  return (
    <Card className="mt-6 w-1/4 h-full">
      <div className="flex mb-5">
        <CardHeader color="red" className="relative flex justify-center items-center h-20 w-20">
          <Typography variant="h2" color="white" className="mb-2">
            {bloodType}
          </Typography>
        </CardHeader>
        <CardBody>
          <Typography variant="h5" className="mb-2">
            {availability}
          </Typography>
        </CardBody>
      </div>
      <CardFooter className="border-t flex justify-center items-center">
        <Typography variant="h6" className={`${colorClass}`}>
          Amount: {" "}
        </Typography>
        <Typography variant="h5" className='text-red-500'>
          10
        </Typography>
      </CardFooter>
    </Card>
  );

}

export function LineCard() {
  return (
    <Card className="mt-6 w-1/3">
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
    <Card className="mt-6 w-1/3">
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

export function CountDonorCard() {
  return (
    <Card className="mt-6 w-full">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2 text-center">
          NO. OF DONORS
        </Typography>
        <div className="flex justify-center">
          <Typography variant="h1" color="red" className="w-1/2 my-10 py-4 rounded-lg bg-red-600 text-gray-100 shadow-md shadow-gray-600 text-center">
            8000
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}

export function DeferralCard() {
  return (
    <Card className="py-10 mt-6 w-full">
      <CardBody>
        <div className="flex flex-col items-center justify-center">
        <Typography variant="h2" color="blue-gray" className="mb-2">
          Deferral Count
        </Typography>
          <Typography variant="h2" color="red" className="w-1/6 text-red-500 text-center">
            8000
          </Typography>
        </div>
        <div className="flex flex-col items-center justify-center">
        <Typography variant="h2" color="blue-gray" className="mb-2">
          Dispensed Count
        </Typography>
          <Typography variant="h2" color="red" className="w-1/6 text-red-500 text-center">
            8000
          </Typography>
        </div>
        <div className="flex flex-col items-center justify-center">
        <Typography variant="h2" color="blue-gray" className="mb-2">
          Expired Blood
        </Typography>
          <Typography variant="h2" color="red" className="w-1/6 text-red-500 text-center">
            8000
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}