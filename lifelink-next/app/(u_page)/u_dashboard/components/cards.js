import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";
import React from "react";

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
      <Card className="mt-6 w-72 h-full">
        <div className="flex mb-2">
          <CardHeader color="red" className="relative flex justify-center items-center h-20 w-20">
            <Typography variant="h4" color="white" className="mb-2">
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