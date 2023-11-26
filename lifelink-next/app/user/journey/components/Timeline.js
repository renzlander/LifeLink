import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  Timeline,
  TimelineItem,
  TimelineIcon,
  Typography,
  TimelineHeader,
  TimelineConnector,
} from "@material-tailwind/react";
import { ArchiveBoxArrowDownIcon, BeakerIcon, ArchiveBoxIcon } from "@heroicons/react/24/solid";

const timelineData = [
  {
    icon: ArchiveBoxArrowDownIcon,
    label: "COLLECTED",
    desc: "Blood bag has been collected and is ready for Laboratory Testing.",
    date: "11/23/2023 20:00 PM",
    gif: "/blood_transfuse.gif",
  },
  {
    icon: BeakerIcon,
    label: "LABORATORY",
    desc: "The blood is under testing in the laboratory.",
    date: "11/23/2023 20:00 PM",
    gif: "/blood_test.gif",
  },
  {
    icon: ArchiveBoxIcon,
    label: "STORED",
    desc: "Blood bag has been stored in the Blood Bank.",
    date: "11/23/2023 20:00 PM",
    gif: "/blood_transfuse.gif",
  },
];

export function JourneyTimeline({ activeSteps }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeSteps.length > 0) {
      setActiveStep(activeSteps[0]);
    }
  }, [activeSteps]);

  return (
    <Card className="2xl:w-1/2 w-full mt-6">
      <CardHeader color="red" className="relative h-16 flex items-center">
        <Typography variant="h4" color="white" className="ml-4">
          Trace Blood Bag
        </Typography>
      </CardHeader>
      <CardBody className="w-full h-full">
        <Timeline className="">
          {timelineData.map((item, index) => (
            <TimelineItem key={index} className="2xl:h-40 h-48">
              {index < 2 && <TimelineConnector className="!w-[78px] 2xl:!h-36 !h-40" />}
              <TimelineHeader
                className={`
                  relative 
                  rounded-xl 
                  border 
                  ${index === activeStep ? "border-green-500 bg-white" : "border-gray-50 bg-gray-300"}
                  py-3 pl-4 pr-8 
                  shadow-lg shadow-blue-gray-900/5
                `}
              >
                <TimelineIcon className="p-3" variant="ghost" color={index === activeStep ? "green" : undefined}>
                  {React.createElement(item.icon, { className: "h-5 w-5" })}
                </TimelineIcon>
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col gap-1">
                    <Typography variant="h6" color="blue-gray">
                      {item.label}
                    </Typography>
                    {item.desc === null ? "" : <Typography variant="small" color="blue-gray" className="text-base">{item.desc}</Typography>}
                    {item.date === null ? "" : <Typography variant="small" color="gray" className="font-normal">{item.date}</Typography>}
                  </div>
                  {index === activeStep && <Image src={item.gif} alt="GIF" width={50} height={50} className="2xl:block hidden" />}
                </div>
              </TimelineHeader>
            </TimelineItem>
          ))}
        </Timeline>
      </CardBody>
    </Card>
  );
}