"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { RequestEmail } from "./components/RequestEmail";
import { OneTimePass } from "./components/OTP";
import { NewPass } from "./components/NewPass";

export default function ForgotPassword() {
  const [activePage, setActivePage] = useState(0);

  const handleNextpage = useCallback(() => {
    setActivePage((cur) => cur + 1);
  }, []);

  const pages = [
    <RequestEmail key="requestEmail" onNextPage={handleNextpage} />,
    <OneTimePass key="oneTimePass" onNextPage={handleNextpage} />,
    <NewPass key="newPass" onNextPage={handleNextpage} />,
    <LastPage key="lastPage" />,
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-[95%] 2xl:w-1/2 h-full mt-12">
        <CardHeader color="gray" className="relative h-16 flex items-center mb-4">
          <Typography variant="h4" color="white" className="ml-4">
            Forgot Password
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col items-center overflow-auto">
          {pages[activePage]}
        </CardBody>
      </Card>
    </main>
  );
}

export function LastPage() {
  const router = useRouter();

  return (
    <div className="w-full h-96 grid col-start-2 col-end-8 place-content-center gap-6">
      <Typography variant="h4" color="blue-gray" className="mb-8">
        Password Changed Successfully!
      </Typography>
      <CheckCircleIcon className="w-36 h-36 text-green-500 place-self-center mb-12" />
      <Button variant="gradient" className="w-1/2 place-self-center" onClick={() => router.push("/login")}>
        Back to Login
      </Button>
    </div>
  );
}