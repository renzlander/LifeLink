import { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Input, Button } from "@material-tailwind/react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

export function RequestEmail({ onNextPage }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");



  const sendOtpToMail = async () => {
    try {
      const response = await axios.post(
        `${laravelBaseUrl}/api/forgot-password`,
        {
          email: email,
        }
      );

      console.log(response);
      if (response.data.status === "success") {
        document.cookie = `user_email=${email}; secure; SameSite=Strict`;
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
    <div className="w-full h-96 grid 2xl:w-1/2">
      <Typography variant="h4" color="blue-gray" className="mb-8">
        Enter your Email to send an OTP.
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
      <Input
        size="lg"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <Button
        variant="gradient"
        className="w-1/2 place-self-center"
        onClick={sendOtpToMail}
      >
        Send OTP
      </Button>
      <Typography className="text-center text-gray-600 font-normal">
        Back to{" "}
        <span
          className="font-medium text-gray-900 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Log In
        </span>
      </Typography>
    </div>
  );
}
