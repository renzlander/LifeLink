import { DocumentIcon, UserCircleIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { RegF1 } from "./regf1";
import { RegF2 } from "./regf2";
import { RegF3 } from "./regf3";

export function RegisterStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(true);
  console.log("activeStep",activeStep);
  const handleNextStep = () => {
    if (!isLastStep) {
      setActiveStep((cur) => cur + 1);
      setIsFirstStep(false);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setActiveStep((cur) => cur - 1);
      setIsLastStep(false);
    }
  };

  const stepsContent = [
    <RegF1 onNextStep={handleNextStep} />,
    <RegF2 onNextStep={handleNextStep} />,
    <RegF3 />,
  ];

  useEffect(() => {
    const user_id = document.cookie.replace(/(?:(?:^|.*;\s*)user_id\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (user_id) {
      setActiveStep(1);
    }
  }, []);

  return (
    <div className="md:w-1/2 lg:w-7/12 bg-gray-100 rounded-xl p-8">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step>
          <UserCircleIcon className="h-5 w-5" />
        </Step>
        <Step>
          <DocumentIcon className="h-5 w-5" />
        </Step>
        <Step>
          <CheckIcon className="h-5 w-5" />
        </Step>
      </Stepper>
      <div className="flex justify-center items-center">
      {stepsContent[activeStep]}
      </div>
      {/* <div className="mt-8 flex justify-between">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          Previous
        </Button>
        {isLastStep ? (
          <Button onClick={logIn}>Finish</Button>
        ) : (
          <Button onClick={handleNextStep}>Next</Button>
        )}
      </div> */}
    </div>
  );
}
