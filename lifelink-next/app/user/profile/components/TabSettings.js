import React, { useState, useEffect } from "react";
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
  Avatar,
  Chip,
  Input,
  Button,
} from "@material-tailwind/react";

export function TabSettings({ userDetails, donationSummary }) {

  return (
    <Card className="px-2">
      <CardBody>
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4 gap-y-4">
          <div className="col-span-1 md:border-r md:border-b-0 border-b pb-4">
            <div className="flex flex-col items-start justify-between w-full gap-6">
              <Typography variant="h6" className="font-sans text-lg text-blue-gray-700 mb-2">
                Change Photo
              </Typography>
              <Typography variant="small" className="font-medium text-base text-blue-gray-700">
                Profile Picture:
              </Typography>
              <Button variant="outlined" color="blue-gray" size="sm">Upload Photo</Button>
              <Typography variant="small" className="font-medium text-base text-blue-gray-700">
                Cover Photo:
              </Typography>
              <Button variant="outlined" color="blue-gray" size="sm">Upload Photo</Button>
            </div>
          </div>
          <div className="col-span-3 pb-4">
            <div className="flex flex-col items-start justify-between w-full gap-6">
              <Typography variant="h6" className="font-sans text-lg text-blue-gray-700 mb-2">
                Request Change Info
              </Typography>
              <div className="flex items-center justify-between w-full gap-4 2xl:flex-nowrap flex-wrap">
                <Input label="First Name" />
                <Input label="Middle Name" />
                <Input label="Last Name" />
              </div>
              <Input label="Email" />
              <Input label="Mobile Number" />
              <Input label="Blood Type" />
              <Input label="Birthdate" />
              <Input label="Address" />
              <Input label="Occupation" />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}