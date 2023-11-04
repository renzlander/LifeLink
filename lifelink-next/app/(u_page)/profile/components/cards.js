import React, { useState, useEffect} from "react";
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
  Avatar,
} from "@material-tailwind/react";
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { 
    AtSymbolIcon,
    DevicePhoneMobileIcon,
    CakeIcon,
    UsersIcon,
    HomeIcon,
    BriefcaseIcon,
 } from "@heroicons/react/24/outline";
 import NoBadge from "@/public/Badges/NoBadge";
 import BronzeBadge from "@/public/Badges/BronzeBadge";
 import SilverBadge from "@/public/Badges/SilverBadge";
 import GoldBadge from "@/public/Badges/GoldBadge";

 function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

export default function CardProfile({userDetails}) {
  const badgeComponents = [<NoBadge width={250} height={250} />, <BronzeBadge width={250} height={250} />, <SilverBadge width={250} height={250} />, <GoldBadge width={200} height={200} />];
  const testInt = 3;

  const selectedBadge = badgeComponents[testInt];

  return (
    <Card className="w-full mt-10">
        <CardHeader 
            variant="gradient"
            color="gray"
            className="mb-4 grid h-56 place-items-center relative overflow-visible"
        >
            <Image
                src="/lifelink_bg.png"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
            />
            <Avatar 
                src="patient_icon.png" 
                alt="Profile Picture"
                className="absolute bottom-0 left-0 ml-16 -mb-20 bg-gray-100 border-4 border-gray-100 h-40 w-40"
            />
            <Tooltip content="Badge">
              <div className="absolute -bottom-32 right-5" >
                {selectedBadge}
              </div>
            </Tooltip>
        </CardHeader>
        <CardBody className="text-center flex flex-col items-center">
            <Typography variant="h4" color="blue-gray" className="mb-2">
              {userDetails.first_name} {userDetails.last_name}
            </Typography>
            <Typography color="blue-gray" className="font-medium" textGradient>
                {userDetails.email}
            </Typography>
        </CardBody>
    </Card>
  );
}


export function CardInfo({userDetails}) {
    return (
      <Card className="w-1/3 h-full">
          <CardBody className="flex flex-col justify-start">
            <Typography variant="h4" color="blue-gray" className="uppercase mb-4">
                About
            </Typography>
            <div className="flex items-center">
              <WaterDropIcon className="h-5 w-5 text-red-600" />
              <Typography variant="h6" color="blue-gray" className="uppercase ml-2">
                  Blood Type:
              </Typography>
              <Typography color="blue-gray" className="font-medium ml-3 text-red-900">
                {userDetails.blood_type}
              </Typography>
            </div>
            <div className="flex items-center">
              <AtSymbolIcon className="h-5 w-5 text-black" />
              <Typography variant="h6" color="blue-gray" className="uppercase ml-2">
                  E-mail:
              </Typography>
              <Typography color="blue-gray" className="font-medium ml-3 text-red-900">
                {userDetails.email}
              </Typography>
            </div>
            <div className="flex items-center">
              <DevicePhoneMobileIcon className="h-5 w-5 text-black" />
              <Typography variant="h6" color="blue-gray" className="uppercase ml-2">
                  Phone Number:
              </Typography>
              <Typography color="blue-gray" className="font-medium ml-3 text-red-900">
                {userDetails.mobile}
              </Typography>
            </div>
            <div className="flex items-center">
              <CakeIcon className="h-5 w-5 text-black" />
              <Typography variant="h6" color="blue-gray" className="uppercase ml-2">
                Birthday:
              </Typography>
              <Typography color="blue-gray" className="font-medium ml-3 text-red-900">
                {formatDate(userDetails.dob)}
              </Typography>
            </div>
            <div className="flex items-center">
              <UsersIcon className="h-5 w-5 text-black" />
              <Typography variant="h6" color="blue-gray" className="uppercase ml-2">
                  Sex:
              </Typography>
              <Typography color="blue-gray" className="font-medium ml-3 text-red-900">
                {userDetails.sex}
              </Typography>
            </div>
            <div className="flex items-center">
              <HomeIcon className="h-5 w-5 text-black" />
              <Typography variant="h6" color="blue-gray" className="uppercase ml-2">
                  Address:
              </Typography>
              <Tooltip content={`${userDetails.street}, ${userDetails.barangay} ${userDetails.municipality}, ${userDetails.province}`} placement="right-end">
                <Typography color="blue-gray" className="font-medium ml-3 text-red-900 truncate">
                  {userDetails.street}, {userDetails.barangay} {userDetails.municipality}, {userDetails.province}
                </Typography>
              </Tooltip>
            </div>
            <div className="flex items-center">
              <BriefcaseIcon className="h-5 w-5 text-black" />
              <Typography variant="h6" color="blue-gray" className="uppercase ml-2">
                  Occupation:
              </Typography>
              <Typography color="blue-gray" className="font-medium ml-3 text-red-900">
                {userDetails.occupation}
              </Typography>
            </div>
          </CardBody>
      </Card>
    );
  }
  
export function CardDisplays() {
    return (
        <Card className="w-2/3 h-full">
            <Typography>
                Test
            </Typography>
        </Card>
    );
}

