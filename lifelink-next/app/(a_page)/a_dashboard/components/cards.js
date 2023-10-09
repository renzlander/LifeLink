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
        <Typography variant="h5" color="blue-gray" className="mb-2">
          UI/UX Review Check
        </Typography>
        <Typography>
          The place is close to Barceloneta Beach and bus stop just 2 min by
          walk and near to &quot;Naviglio&quot; where you can enjoy the main
          night life in Barcelona.
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Button>Read More</Button>
      </CardFooter>
    </Card>
  );
}