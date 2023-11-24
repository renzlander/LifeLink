import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { useRouter } from 'next/navigation';

export function AuthCard({ onAuthenticate }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.post(
        `${laravelBaseUrl}/api/check-security-pin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            security_pin: password
          },
        }
      );

      if (response.data.status === "success") {
        onAuthenticate();
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('Invalid password. Please try again.');
    }
  };

  return (
    <Card className="w-96 mt-20">
      <CardHeader
        variant="gradient"
        color="gray"
        className="p-6 mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h5" color="white" className="text-center">
          Oops! You need an Admin password to access this page.
        </Typography>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <Input
            label="Password"
            size="lg"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          {error && <Typography variant="body" color="red">{error}</Typography>}
          <Button variant="gradient" type='submit' fullWidth>
            Submit
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
