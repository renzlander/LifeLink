import React, { useState } from "react";
import {
  Card,
  Input,
  Checkbox,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

export function RegF1() {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${laravelBaseUrl}/api/auth/register-step1`, {
        email,
        mobile,
        password,
        password_confirmation,
      });
      
      // Handle the response from the API
      console.log(response);
      
      // Redirect to another page or perform any other actions
    } catch (error) {
      // Handle the error
      console.log(error);
    }
  };

  return (
    <Card className='mt-6 flex justify-center items-center' color="transparent" shadow={false}>
      <Typography variant="h4" className="mt-2" color="blue-gray">
        Enter your details for logging in
      </Typography>

      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col gap-6">
          <Input size="lg" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input size="lg" label="Phone Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
          <Input type="password" size="lg" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input type="password" size="lg" label="Confirm Password" value={password_confirmation} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <Checkbox
          label={
            <Typography
              variant="small"
              color="gray"
              className="flex items-center font-normal"
            >
              I agree the
              <a
                href="#"
                className="font-medium transition-colors text-red-600 hover:text-red-800"
              >
                &nbsp;Terms and Conditions
              </a>
            </Typography>
          }
          containerProps={{ className: "-ml-2.5" }}
        />
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <a href='/login' className="font-medium text-gray-900">
            Sign In
          </a>
        </Typography>
        <button type="submit">Submit</button>
      </form>
    </Card>
  );
}