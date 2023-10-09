import React from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import { HomeIcon, CogIcon, UserIcon } from "@heroicons/react/24/outline";

export function JourneyStepper({ activeSteps }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const totalSteps = 3; // Total number of steps

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  return (
    <div className="w-full bg-white rounded-xl py-4 px-8">
      <Stepper activeStep={activeSteps[activeSteps.length - 1]}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <Step
            key={index}
            className={`${
              activeSteps.includes(index) ? "h-28 w-28 animate-fade active" : "h-24 w-24 animate-fade inactive"
            }`}
          >
            {index === 0 && (
              <div className={`flex flex-col items-center ${activeSteps.includes(index) ? "" : "opacity-40"}`}>
                <HomeIcon className={`h-10 w-10 mb-2 ${activeSteps.includes(index) ? "" : "h-6 w-6"}`} />
                <Typography variant="caption" className="text-center">
                  Collected
                </Typography>
              </div>
            )}
            {index === 1 && (
              <div className={`flex flex-col items-center ${activeSteps.includes(index) ? "" : "opacity-40"}`}>
                <UserIcon className={`h-10 w-10 mb-2 ${activeSteps.includes(index) ? "" : "h-6 w-6"}`} />
                <Typography variant="caption" className="text-center">
                  Laboratory
                </Typography>
              </div>
            )}
            {index === 2 && (
              <div className={`flex flex-col items-center ${activeSteps.includes(index) ? "" : "opacity-40"}`}>
                <CogIcon className={`h-10 w-10 mb-2 ${activeSteps.includes(index) ? "" : "h-6 w-6"}`} />
                <Typography variant="caption" className="text-center">
                  Stored
                </Typography>
              </div>
            )}
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
