import React from "react";
import Image from "next/image";
import { Stepper, Step } from "@material-tailwind/react";
import { 
  ArchiveBoxArrowDownIcon, 
  BeakerIcon, 
  UserIcon } from "@heroicons/react/24/outline";
import CollectedIcon from "./icons";

export function JourneyStepper({ activeSteps }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const totalSteps = 3; // Total number of steps

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  const gifSources = [
    '/blood_transfuse.gif',
    '/blood_test.gif',
    '/blood_transfuse.gif'
  ];

  return (
    <div className="w-full bg-white rounded-xl mt-10 py-4 px-8">
      <Stepper activeStep={activeSteps[activeSteps.length - 1]}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <Step
            key={index}
            className={activeSteps.includes(index) ? "h-20 w-20" : ""}
          >
            {index === 0 && <CollectedIcon width={activeSteps.includes(index) ? 30 : 15} height={activeSteps.includes(index) ? 30 : 15} fill="white" />}
            {index === 1 && <BeakerIcon className={activeSteps.includes(index) ? "h-10 w-10" : "h-5 w-5"} />}
            {index === 2 && <ArchiveBoxArrowDownIcon className={activeSteps.includes(index) ? "h-10 w-10" : "h-5 w-5"} />}
          </Step>
        ))}
      </Stepper>
      <div className="flex justify-center items-center my-8">
        {activeSteps.map((stepIndex) => (
          <div key={stepIndex} className="mx-4">
            <Image src={gifSources[stepIndex]} width={150} height={150} />
          </div>
        ))}
      </div>
    </div>
  );
}
