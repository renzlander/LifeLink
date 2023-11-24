import {
  CheckIcon,
  DocumentIcon,
  EnvelopeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Step, Stepper } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { RegF1 } from "./regf1";
import { RegF2 } from "./regf2";
import { RegF3 } from "./regf3";
import { RegF4 } from "./regf4";

export function RegisterStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(true);
  console.log("activeStep", activeStep);
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
    <div className="md:w-1/2 lg:w-7/12 bg-gray-100 rounded-xl p-8">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step key="userCircleIcon">
          <UserCircleIcon className="h-5 w-5" />
        </Step>
        <Step key="documentIcon">
          <DocumentIcon className="h-5 w-5" />
        </Step>
        <Step key="checkIcon">
          <EnvelopeIcon className="h-5 w-5" />
        </Step>
        <Step key="checkIcon">
          {/* Add your custom icon component here */}
          <CheckIcon className="h-5 w-5" />
        </Step>
      </Stepper>
      <div className="flex justify-center items-center">
        {stepsContent[activeStep]}
      </div>
    </div>
  );
}
