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
    router.push('/login');
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
    <div className="md:w-1/2 lg:w-7/12 bg-gray-100 rounded-xl p-8">
      <Stepper
      className="relative"
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
        {renderContent()}
      </div>
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
