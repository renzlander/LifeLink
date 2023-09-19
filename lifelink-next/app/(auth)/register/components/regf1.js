import { Card, Input, Button, Typography } from "@material-tailwind/react";
import PasswordChecklist from "react-password-checklist"
import React, { useState, useEffect } from "react";
import { laravelBaseUrl } from "@/app/variables";
import axios from "axios";

export function RegF1({ onNextStep }) {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${laravelBaseUrl}/api/auth/register-step1`,
        {
          email,
          mobile,
          password,
          password_confirmation,
        }
      );
      if (response.data.user_id) {
        document.cookie = `user_id=${response.data.user_id}; secure; SameSite=Strict`;
      }
      if (response.status === 200) {
        console.log(response);
        onNextStep();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isPasswordMatching = password === password_confirmation;
  const confirmPasswordStyle = password_confirmation === "" ? "normal" : (isPasswordMatching ? 'success' : 'error');

  return (
    <Card className="mt-6 flex justify-center items-center" color="transparent" shadow={false}>
      <Typography variant="h4" className="mt-2" color="blue-gray">
        Enter your details for logging in
      </Typography>

      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col gap-6">
          <Input 
            size="lg" 
            label="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            size="lg" 
            label="Phone Number" 
            value={mobile} 
            onChange={(e) => {
              const inputValue = e.target.value;
              const sanitizedValue = inputValue.replace(/[^0-9]/g, '').slice(0, 11);
              setMobile(sanitizedValue);
            }} 
            required 
          />
          <Input 
            type="password" 
            size="lg" 
            label="Password" 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }} 
            required 
          />
          <PasswordChecklist
            rules={["minLength","specialChar","number","capital"]}
            minLength={8}
            value={password}
          />
          <Input 
            type="password" 
            size="lg" 
            label="Confirm Password" 
            value={password_confirmation} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            {...(confirmPasswordStyle === "normal" ? {} : (confirmPasswordStyle === "success" ? { success: true } : { error: true }))}
          />
        </div>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-gray-900">
            Sign In
          </a>
        </Typography>
        <div className="flex justify-center mt-6">
          <Button type="submit">
            NEXT STEP
          </Button>
        </div>
      </form>
    </Card>
  );
}
