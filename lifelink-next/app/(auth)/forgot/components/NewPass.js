import { useState } from "react";
import {
  Card,
  Typography,
  Input,
  Button,
  Collapse,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import PasswordChecklist from "react-password-checklist";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

export function NewPass({ onNextPage }) {
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const [valid, setValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckList = () => setOpen(true);
  const showPassword = () => setShowPass(!showPass);
  const showConfirmPassword = () => setShowConPass(!showConPass);

  const isPasswordMatching = pass === confirmPass;
  const confirmPasswordStyle =
    confirmPass === "" ? "normal" : isPasswordMatching ? "success" : "error";

    const handleNewPass = async () => {
      try {
        const userEmail = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user_email="))
          ?.split("=")[1];
        const userToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
    
        const response = await axios.post(`${laravelBaseUrl}/api/reset-password`, {
          token: userToken,
          email: userEmail,
          password: pass,
          password_confirmation: confirmPass
        });
    
        console.log(response);
        if (response.data.status === "success") {
          // Delete the "token" and "user_email" cookies
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; SameSite=Strict";
          document.cookie = "user_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; SameSite=Strict";

          onNextPage();
        } else {
          setErrorMessage(response.data.message);
          console.error("API request failed:", response.data.message);
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "An error occurred");
        console.error("Error exporting PDF:", error);
      }
    };
    

  return (
    <div className="w-full h-96 grid 2xl:w-1/2">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Input your new password.
      </Typography>
      {errorMessage && (
        <div className="my-2 h-[80px] text-center bg-red-100 p-2 rounded-lg sm:max-w-md md:max-w-lg lg:max-w-xl whitespace-normal">
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
      <div className="flex flex-col items-center gap-3 mb-3">
        <Input
          size="lg"
          type={showPass === true ? "text" : "password"}
          label="New Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onFocus={handleCheckList}
          required
          icon={
            showPass === true ? (
              <EyeSlashIcon className="w-5 h-5" onClick={showPassword} />
            ) : (
              <EyeIcon className="w-5 h-5" onClick={showPassword} />
            )
          }
          maxLength={128}
        />
        
      </div>
      <Input
        size="lg"
        type={showConPass === true ? "text" : "password"}
        label="Confirm New Password"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
        required
        {...(confirmPasswordStyle === "normal"
          ? {}
          : confirmPasswordStyle === "success"
          ? { success: true }
          : { error: true })}
        icon={
          showConPass === true ? (
            <EyeSlashIcon className="w-5 h-5" onClick={showConfirmPassword} />
          ) : (
            <EyeIcon className="w-5 h-5" onClick={showConfirmPassword} />
          )
        }
      />
      <Collapse open={open} className={open === false ? "hidden" : ""}>
          <Card shadow={false} className="bg-gray-300 w-full px-4 py-2">
            <PasswordChecklist
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={8}
              value={pass}
              valueAgain={confirmPass}
              onChange={(isValid) => {
                if (isValid === true) {
                  setValid(true);
                } else {
                  setValid(false);
                }
              }}
            />
          </Card>
        </Collapse>
      <Button
        type="submit"
        variant="gradient"
        className="w-1/2 place-self-center"
        disabled={!isPasswordMatching || !pass || valid === false}
        onClick={handleNewPass}
      >
        Submit
      </Button>
    </div>
  );
}
