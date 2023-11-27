import {
  CheckIcon,
  DocumentIcon,
  EnvelopeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { 
  Step,
  Stepper,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { useEffect, useState, useCallback } from "react";
import { RegF1 } from "./RegForm1";
import { RegF2 } from "./RegForm2";
import { RegF3 } from "./RegForm3";
import { RegF4 } from "./RegForm4";

export default function RegisterStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(true);
  
  const handleNextStep = useCallback(() => {
    if (!isLastStep) {
      setActiveStep((cur) => cur + 1);
      setIsFirstStep(false);
    }
  }, [isLastStep]);

  const handlePrev = useCallback(() => {
    if (!isFirstStep) {
      setActiveStep((cur) => cur - 1);
      setIsLastStep(false);
    }
  }, [isFirstStep]);

  const stepsContent = [
    <RegF1 key="step1" onNextStep={handleNextStep} />,
    <RegF2 key="step2" onNextStep={handleNextStep} />,
    <RegF3 key="step3" />,
    <RegF4 key="step4" />,
  ];

  useEffect(() => {
    const user_id = document.cookie.replace(
      /(?:(?:^|.*;\s*)user_id\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (user_id) {
      setActiveStep(1);
    }
  }, []);

  return (
    <Card className="w-full 2xl:w-1/2 bg-gray-100 my-12">
      <CardHeader color='gray' variant='gradient' className="h-16 flex items-center p-4 mb-4">
        <Stepper
          activeStep={activeStep}
          isLastStep={(value) => setIsLastStep(value)}
          isFirstStep={(value) => setIsFirstStep(value)}
          lineClassName="bg-gray-400"
          activeLineClassName="bg-gray-700"
        >
          <Step
            className="bg-gray-400"
            activeClassName="!bg-gray-800 text-gray-100"
            completedClassName="!bg-gray-800 text-gray-100"
            key="userCircleIcon"
          >
            <UserCircleIcon className="h-5 w-5" />
          </Step>
          <Step 
            className="bg-gray-400"
            activeClassName="!bg-gray-800 text-gray-100"
            completedClassName="!bg-gray-800 text-gray-100"
            key="documentIcon"
          >
            <DocumentIcon className="h-5 w-5" />
          </Step>
          <Step
            className="bg-gray-400"
            activeClassName="!bg-gray-800 text-gray-100"
            completedClassName="!bg-gray-800 text-gray-100"
            key="checkIcon"
          >
            <EnvelopeIcon className="h-5 w-5" />
          </Step>
          <Step
            className="bg-gray-400"
            activeClassName="!bg-gray-800 text-gray-100"
            completedClassName="!bg-gray-800 text-gray-100"
            key="checkIcon"
          >
            <CheckIcon className="h-5 w-5" />
          </Step>
        </Stepper>
      </CardHeader>
      <CardBody className="flex flex-col justify-center items-center">
        {stepsContent[activeStep]}
      </CardBody>
    </Card>
  );
}
