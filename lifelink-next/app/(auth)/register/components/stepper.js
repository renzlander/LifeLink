import { 
    Stepper,
    Step,
    Button,
    Typography 
} from "@material-tailwind/react";
import {
  DocumentIcon,
  UserCircleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { RegF1 } from "./regf1";
import { RegF2 } from "./regf2";
import { RegF3 } from "./regf3";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

const stepsContent = [
    <RegF1/>,
    <RegF2/>,
    <RegF3/>,
];

export function RegisterStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(true);

  const router = useRouter();

  const logIn = () => {
    router.push('/u_dashboard');
  };

  const handleNext = () => {
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

  const renderContent = () => {
    return stepsContent[activeStep];
  };

  return (
    <div className="w-full bg-gray-100 px-24 py-8">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step>
          <UserCircleIcon className="h-5 w-5" />
          <div className="absolute -bottom-8 w-max text-center">
            <Typography
              variant="h6"
              color={activeStep === 0 ? "blue-gray" : "gray"}
            >
              Login Details
            </Typography>
          </div>
        </Step>
        <Step>
          <DocumentIcon className="h-5 w-5" />
          <div className="absolute -bottom-8 w-max text-center">
            <Typography
              variant="h6"
              color={activeStep === 1 ? "blue-gray" : "gray"}
            >
              Personal Details
            </Typography>
          </div>
        </Step>
        <Step>
          <CheckIcon className="h-5 w-5" />
          <div className="absolute -bottom-8 w-max text-center">
            <Typography
              variant="h6"
              color={activeStep === 2 ? "blue-gray" : "gray"}
            >
              Done
            </Typography>
          </div>
        </Step>
      </Stepper>
      {renderContent()}
      <div className="mt-8 flex justify-between">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          Previous
        </Button>
        {isLastStep ? (
          <Button onClick={logIn}>Finish</Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>
    </div>
  );
}
