import React from "react";
import { Stepper, Step, Button } from "@material-tailwind/react";
import { HomeIcon, CogIcon, UserIcon } from "@heroicons/react/24/outline";
 
export function JourneyStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
 
  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
 
  return (
    <div className="w-full bg-white rounded-xl py-4 px-8">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step className={activeStep === 0 ? "h-20 w-20" : ""}>
          <HomeIcon className={activeStep === 0 ? "h-10 w-10" : "h-5 w-5"} />
        </Step>
        <Step className={activeStep === 1 ? "h-20 w-20" : ""}>
          <UserIcon className={activeStep === 1 ? "h-10 w-10" : "h-5 w-5"} />
        </Step>
        <Step className={activeStep === 2 ? "h-20 w-20" : ""}>
          <CogIcon className={activeStep === 2 ? "h-10 w-10" : "h-5 w-5"} />
        </Step>
      </Stepper>
      <div className="mt-16 flex justify-between">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        <Button onClick={handleNext} disabled={isLastStep}>
          Next
        </Button>
      </div>
    </div>
  );
}