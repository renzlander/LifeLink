import { useState, useEffect } from "react";
import { Typography, Button } from "@material-tailwind/react";
import OtpInput from "react-otp-input";
import { laravelBaseUrl } from "@/app/variables";
import axios from "axios";

export function OneTimePass({ onNextPage }) {
  const [otp, setOtp] = useState("");
  const [time, setTime] = useState(90);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (time > 0) {
        setTime((prevTime) => prevTime - 1);
      } else {
        clearInterval(countdownInterval);
        setResendDisabled(false); // Enable Resend OTP button when the countdown reaches 0
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const handleResendOTP = async () => {
    try {
      const userEmail = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_email="))
        ?.split("=")[1];
      const response = await axios.post(`${laravelBaseUrl}/api/resend-otp`, {
        email: userEmail,
      });

      console.log(response);
      if (response.data.status === "success") {
        toast.success("OTP successfully sent");
      } else {
        setErrorMessage(response.data.message);
        console.error("API request failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
    }

    setResendDisabled(true);
    setTime(90);
  };

  const handleVerifyOtp = async () => {
    try {
      const userEmail = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_email="))
        ?.split("=")[1];

      const response = await axios.post(`${laravelBaseUrl}/api/verify-otp`, {
        email: userEmail,
        otp: otp,
      });

      console.log(response);
      if (response.data.status === "success") {
        const token = response.data.token;
        document.cookie = `token=${token}; secure; SameSite=Strict`;
        onNextPage();
      } else {
        setErrorMessage(response.data.message);
        console.error("API request failed:", response.data.message);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
      console.error("Error exporting PDF:", error);
    }
  };

  return (
    <div className="w-full h-96 grid 2xl:w-4/5">
      <div>
        <Typography variant="h5" color="blue-gray" className="text-center">
          OTP has been sent. Please check your email.
        </Typography>
        <Typography
          variant="small"
          color="blue-gray"
          className="mb-2 text-center"
        >
          If you did not receive OTP, click the button below to resend.
        </Typography>
      </div>
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
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        renderSeparator={<span>-</span>}
        renderInput={(props) => (
          <input
            {...props}
            className="border border-gray-300 bg-gray-50 rounded-md"
            style={{ width: "3rem", height: "3rem", textAlign: "center" }}
          />
        )}
        containerStyle={{ gap: "1rem", justifyContent: "center" }}
      />
      <div className="flex flex-col justify-center gap-4 mt-10">
        <Button
          variant="gradient"
          color="green"
          className="w-1/2 place-self-center"
          onClick={handleVerifyOtp}
        >
          Verify
        </Button>
        <Button
          variant="gradient"
          className="w-1/2 place-self-center"
          onClick={handleResendOTP}
          disabled={resendDisabled}
        >
          {resendDisabled ? (
            <span>{`${minutes}:${
              seconds < 10 ? `0${seconds}` : seconds
            }`}</span>
          ) : (
            "Resend OTP"
          )}
        </Button>
      </div>
    </div>
  );
}
