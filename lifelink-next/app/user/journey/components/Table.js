import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { JourneyTimeline } from "./Timeline";

const TABLE_HEAD = [
  { label: "Serial Number", key: "serial_no" },
  { label: "Date Donated", key: "date_donated" },
  { label: "Status", key: "status" },
];

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

export function BloodBagTable({ bloodJourney }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [activeSteps, setActiveSteps] = useState([0]); // Initialize with the first step
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // Track the clicked row

  useEffect(() => {
    // Set the first row as default when the component loads
    if (bloodJourney.length > 0) {
      handleRowClick(bloodJourney[0], 0);
    }
  }, [bloodJourney]);

  function getStatusText(journey) {
    const { collected, tested, stored, dateCollected, dateTested, dateStored } =
      journey;

    if (collected === 1 && tested === 1 && stored === 1) {
      return "Stored";
    } else if (collected === 1 && tested === 1) {
      return "Laboratory";
    } else if (collected === 1) {
      return "Collected";
    } else {
      return "Unknown";
    }
  }

  // Handle row click event
  function handleRowClick(journey, index) {
    const status = getStatusText(journey);

    let activeStepsArray = [];
    if (status === "Collected") {
      activeStepsArray = [0];
    } else if (status === "Laboratory") {
      activeStepsArray = [1];
    } else if (status === "Stored") {
      activeStepsArray = [2];
    }

    setActiveSteps(activeStepsArray);
    setSelectedRowIndex(index);
  }

  return (
    <div className="w-full min-h-screen flex 2xl:flex-row flex-col items-start justify-between gap-4 py-4">
      <Card className="2xl:w-1/2 w-full mt-6">
        <CardHeader color="red" className="relative h-16 flex items-center">
          <Typography variant="h4" color="white" className="ml-4">
            My Blood Bags
          </Typography>
        </CardHeader>
        <CardBody className="px-0 overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head.key}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 sticky top-0"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head.label}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bloodJourney.map((journey, index) => (
                <tr
                  key={journey.serial_number}
                  onClick={() => handleRowClick(journey, index)}
                  className={`cursor-pointer ${
                    selectedRowIndex === index
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-300 transition-colors"
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Typography
                        variant="small"
                        color={
                          selectedRowIndex === index ? "white" : "blue-gray"
                        }
                        className="font-bold"
                      >
                        {journey.serial_number}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color={selectedRowIndex === index ? "white" : "blue-gray"}
                      className="font-normal"
                    >
                      {formatDate(journey.date)}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color={selectedRowIndex === index ? "white" : "blue-gray"}
                      className="font-normal"
                    >
                      {getStatusText(journey)}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
      <JourneyTimeline
        activeSteps={activeSteps}
        bloodJourney={bloodJourney}
        selectedRowIndex={selectedRowIndex}
      />
    </div>
  );
}
