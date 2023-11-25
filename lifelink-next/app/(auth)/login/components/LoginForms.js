"use client";
import React from "react";
import { laravelBaseUrl } from "@/app/variables";
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
  const router = useRouter();
  const [email_or_phone, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isToastShown, setIsToastShown] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await toast.promise(
        axios.post(`${laravelBaseUrl}/api/auth:sanctum/login`, {
          email_or_phone,
          password,
        }),
        {
          pending: "Logging in...",
          success: "Login successful",
          error: "Login failed",
        }
      );
      if (response.status === 200) {
        if (response.data.user.isAdmin === 0) {
          document.cookie = `token=${response.data.token}; expires=${new Date(
            new Date().getTime() + 86400 * 1000
          ).toUTCString()}; path=/`;
          // toast.success("Login successful!");
          router.push("/user/dashboard");
        } else {
          document.cookie = `token=${response.data.token}; expires=${new Date(
            new Date().getTime() + 86400 * 1000
          ).toUTCString()}; path=/`;
          // toast.success("Login successful!");
          router.push("/admin/dashboard");
        }
      } else {
        setErrorMessage(response.data.response.data.msg);
        toast.error(response.data.response.data.msg);
      }
    } catch (error) {
      if (error.response.data.user_id) {
        document.cookie = `user_id=${error.response.data.user_id}; secure; SameSite=Strict`;
        setTimeout(() => {
          router.push("/register");
        }, 2000);
      }
      setErrorMessage(error.response.data.msg);
      toast.error(error.response.data.msg);
    }
  };

  return (
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
            type="password"
            size="lg"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="mt-6" fullWidth>
          Login
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Don't have an account?{" "}
          <Link href="/register">
            <span className="font-medium text-gray-900">Sign Up</span>
          </Link>
        </Typography>
      </form>
    </Card>
  );
}
