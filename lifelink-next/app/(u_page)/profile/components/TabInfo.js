import React, { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
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
  IconButton,
} from "@material-tailwind/react";
import { 
    AtSymbolIcon,
    DevicePhoneMobileIcon,
    CakeIcon,
    UsersIcon,
    HomeIcon,
    BriefcaseIcon,
 } from "@heroicons/react/24/outline";
 import { 
    PencilIcon,
  } from "@heroicons/react/24/solid";
 import NoneBadge from "@/public/Badges/NoBadge";
 import BronzeBadge from "@/public/Badges/BronzeBadge";
 import SilverBadge from "@/public/Badges/SilverBadge";
 import GoldBadge from "@/public/Badges/GoldBadge";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

function formatMiddleName(middleName) {
  if (!middleName) {
    return "";
  }

  const nameParts = middleName.split(" ");
  if (nameParts.length === 1) {
    // If there's only one word, return the first letter
    return `${nameParts[0].charAt(0)}.`;
  } else {
    // If there are multiple words, return the first letter of each word
    const firstLetters = nameParts.map((part) => part.charAt(0));
    return `${firstLetters.join(".")}.`;
  }
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

export function TabInfo({ userDetails, donationSummary, lastDonation }) {
  const formattedMiddleName = formatMiddleName(userDetails.middle_name);

  return (
    <Card>
      <CardBody>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 gap-y-4">
          <div className="col-span-1 md:border-r md:border-b-0 border-b px-2 pb-4">
            <Typography variant="h6" className="font-sans text-lg text-blue-gray-700 mb-6">
              Badge
            </Typography>
            <div className="flex flex-col items-center justify-center gap-3">
              {donationSummary.badge === "none" && <NoneBadge width={200} height={200} />}
              {donationSummary.badge === "bronze" && <BronzeBadge width={200} height={200} />}
              {donationSummary.badge === "silver" && <SilverBadge width={200} height={200} />}
              {donationSummary.badge === "gold" && <GoldBadge width={200} height={200} />}
              <Chip
                  value={donationSummary.badge === "none" ? "No Badge" : donationSummary.badge === "bronze" ? "Bronze Badge" : donationSummary.badge === "silver" ? "Silver Badge" : "Gold Badge"}
                  color={
                            donationSummary.badge === "none"
                          ? "gray"
                          : donationSummary.badge === "bronze"
                          ? "brown" 
                          : donationSummary.badge === "silver"
                          ? "blue-gray" 
                          : "yellow"
                  }
                  variant="gradient"
                  className="text-white"
              />
              <Typography variant="paragraph" color="blue-gray" className="bg-gray-200 p-4 rounded-lg shadow-md md:text-base text-sm text-center flex items-center">
                  <span className="font-bold mx-2">{donationSummary.donationsNeeded}</span> more {donationSummary.donationsNeeded === 1 ? "Donation" : "Donations"} to unlock
                  <Chip
                      value={`${donationSummary.nextBadge} Badge`}
                      color={donationSummary.nextBadge === "bronze" ? "brown" : donationSummary.nextBadge === "silver" ? "blue-gray" : "yellow"}
                      variant="gradient"
                      className="text-white mx-2"
                  />
                  badge
              </Typography>
            </div>
          </div>
          <div className="col-span-1 md:border-r md:border-b-0 border-b px-2 pb-4">
            <div className="flex items-center justify-between w-full mb-6">
              <Typography variant="h6" className="font-sans text-lg text-blue-gray-700">
                Personal Info
              </Typography>
              {/* <IconButton variant="text">
                <PencilIcon className="w-4 h-4" />
              </IconButton> */}
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="small" className="font-semibold text-base text-blue-gray-700">
                Full Name: <span className="font-normal ml-3">{userDetails.first_name} {formattedMiddleName} {userDetails.last_name}</span>
              </Typography>
              <Typography variant="small" className="font-semibold text-base text-blue-gray-700">
                Blood Type: <span className="font-normal ml-3">{userDetails.blood_type}</span>
              </Typography>
              <Typography variant="small" className="font-semibold text-base text-blue-gray-700">
                Mobile: <span className="font-normal ml-3">{userDetails.mobile}</span>
              </Typography>
              <Typography variant="small" className="font-semibold text-base text-blue-gray-700">
                Birthdate: <span className="font-normal ml-3">{formatDate(userDetails.dob)}</span>
              </Typography>
              <Typography variant="small" className="font-semibold text-base text-blue-gray-700">
                Address: <span className="font-normal ml-3">{userDetails.street}, {userDetails.barangay} {userDetails.municipality}, {userDetails.province}</span>
              </Typography>
              <Typography variant="small" className="font-semibold text-base text-blue-gray-700">
                Occupation: <span className="font-normal ml-3">{userDetails.occupation}</span>
              </Typography>
            </div>
          </div>
          <div className="col-span-1 px-2 pb-4">
            <Typography variant="h6" color="blue-gray" className="font-sans text-lg text-blue-gray-700 mb-6">
              Donation Info
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-sans text-base text-blue-gray-700 mb-6">
              {lastDonation.days_since_last_donation}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-sans text-base text-blue-gray-700 mb-6">
              Next donation date is {formatDate(lastDonation.nextDonationDate)}
            </Typography>
            <div className="flex flex-col items-start gap-2">
              <Typography variant="small" className="font-semibold text-base text-blue-gray-700">
                Total Donations: <span className="font-normal ml-3">{donationSummary.totalDonation}</span>
              </Typography>
              <Typography variant="small" className="font-semibold text-base text-blue-gray-700">
                Dispensed Bloods: <span className="font-normal ml-3">{donationSummary.dispensedBlood}</span>
              </Typography>
              <Typography variant="small" className="font-semibold text-base text-blue-gray-700">
                Received Bloods: <span className="font-normal ml-3">{donationSummary.receivedBlood}</span>
              </Typography>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}