import React from "react";
import { Stepper, Step, Button } from "@material-tailwind/react";
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
            className={activeSteps.includes(index) ? "h-20 w-20" : ""}
          >
            {index === 0 && <HomeIcon className={activeSteps.includes(index) ? "h-10 w-10" : "h-5 w-5"} />}
            {index === 1 && <UserIcon className={activeSteps.includes(index) ? "h-10 w-10" : "h-5 w-5"} />}
            {index === 2 && <CogIcon className={activeSteps.includes(index) ? "h-10 w-10" : "h-5 w-5"} />}
          </Step>
        ))}
      </Stepper>
    </div>
  );
}