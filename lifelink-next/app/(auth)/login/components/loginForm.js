import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
  } from "@material-tailwind/react";
import axios from "axios";
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { nextBaseUrl } from "@/app/variables";
import { laravelBaseUrl } from "@/app/variables";
   
export function LoginForm() {
    
    const router = useRouter();
    const [email_or_phone, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
      e.preventDefault();
  
      try {
        const response = await axios.post(`${laravelBaseUrl}/api/auth:sanctum/login`, {
          email_or_phone,
          password,
        });
  
        if (response.status === 200) {
          console.log(response);
          if (response.data.user.isAdmin === 0) {
            document.cookie = `token=${response.data.token}; expires=${new Date(new Date().getTime() + 86400 * 1000).toUTCString()}; path=/`;
            // const cookies = document.cookie.split('; ');
            // const tokenFromCookie = cookies.find(cookie => cookie.startsWith('token=')).split('=')[1];
            // console.log(tokenFromCookie);
            router.push("/u_dashboard");
          } else {
            localStorage.setItem("token", response.data.token);
            router.push("/a_dashboard");
          }
        } else {
          console.log(response);
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Card className="p-10" color="white" shadow={true}>
        <Typography variant="h4" color="blue-gray">
          Log In
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Enter your Log In details.
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleLogin}>
          <div className="mb-4 flex flex-col gap-6">
            <Input 
              size="lg"
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
           />
            <Input 
              type="password" size="lg" 
              label="Password" 
              onChange={(e) => setPassword(e.target.value)}
           />
          </div>
          <Button type="submit" className="mt-6" fullWidth>
            Login
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Don't have an account?{" "}
            <Link href="/register">
              <span className="font-medium text-gray-900">
                Sign Up
              </span>
            </Link>
          </Typography>
        </form>
      </Card>
    );
  }