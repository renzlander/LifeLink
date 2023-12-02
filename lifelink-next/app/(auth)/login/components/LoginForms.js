"use client";
import React, { useCallback, useEffect } from "react";
import { laravelBaseUrl } from "@/app/variables";
import {
  Button,
  Card,
  Input,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaintenanceMode } from "../../components/Maintenance";

export default function LoginForm() {
  const router = useRouter();
  const [email_or_phone, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(true);

  const updateOpenState = (value) => {
    setOpen(value);
  };

  const showPassword = () => setShowPass(!showPass);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`${laravelBaseUrl}/api/maintenance-status`);
  
        // Access the data from the response
        const { maintenance } = response.data;

        console.log(maintenance);
        setIsMaintenance(maintenance);
      } catch (error) {
        console.error("Error fetching maintenance status:", error);
      }
    };

    fetchData();
  }, []); 
  

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${laravelBaseUrl}/api/auth:sanctum/login`,
        {
          email_or_phone,
          password,
        }
      );
      if (response.status === 200) {
        if (response.data.user.isAdmin === 0) {
          if (isMaintenance == 1) {
            setOpen(true);
          } else {
            document.cookie = `token=${response.data.token}; expires=${new Date(
              new Date().getTime() + 86400 * 1000
            ).toUTCString()}; path=/`;
            router.push("/user/dashboard");
          }
        } else {
          document.cookie = `token=${response.data.token}; expires=${new Date(
            new Date().getTime() + 86400 * 1000
          ).toUTCString()}; path=/`;
          router.push("/admin/dashboard");
        }
      } else {
        setErrorMessage(response.data.response.data.msg);
      }
    } catch (error) {
      if (error.response.data.user_id) {
        document.cookie = `user_id=${error.response.data.user_id}; secure; SameSite=Strict`;
        setTimeout(() => {
          router.push("/register");
        }, 2000);
      }
      setErrorMessage(error.response.data.msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MaintenanceMode updateOpenState={updateOpenState} open={open} />
      <Card className="p-10" color="white" shadow={true}>
        <Typography variant="h4" color="blue-gray">
          Sign in
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Enter your Log In details.
        </Typography>
        {errorMessage && (
          <div className="mt-4 text-center bg-red-100 p-2 rounded-lg sm:max-w-md md:max-w-lg lg:max-w-xl whitespace-normal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="red"
              className="w-4 h-4 mx-auto mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <Typography color="red" className="text-sm font-semibold">
              {errorMessage}
            </Typography>
          </div>
        )}

        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={handleLogin}
        >
          <div className="mb-4 flex flex-col gap-6">
            <Input
              size="lg"
              label="Email or Mobile"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type={showPass === true ? "text" : "password"}
              size="lg"
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={
                showPass === true ? (
                  <EyeSlashIcon className="w-5 h-5" onClick={showPassword} />
                ) : (
                  <EyeIcon className="w-5 h-5" onClick={showPassword} />
                )
              }
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-6 flex items-center justify-center gap-5"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner className="h-4 w-4" /> : ""}
            {isSubmitting ? "LOGGING IN" : "LOGIN"}
          </Button>
          <Typography
            color="gray"
            className="w-fit mx-auto mt-4 text-center font-medium hover:text-gray-900 cursor-pointer"
            onClick={() => router.push("/forgot")}
          >
            Forgot Password
          </Typography>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Don't have an account?{" "}
            <span
              className="font-medium text-gray-900 cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Sign Up
            </span>
          </Typography>
        </form>
      </Card>
    </>
  );
}
