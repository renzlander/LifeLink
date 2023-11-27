import { useState, useEffect } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import OtpInput from "react-otp-input";

export function OneTimePass({ onNextPage }) {
  const [otp, setOtp] = useState("");
  const [time, setTime] = useState(90);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (time > 0) {
        setTime((prevTime) => prevTime - 1);
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="w-full h-96 grid 2xl:w-4/5">
      <div>
        <Typography variant="h5" color="blue-gray" className="text-center">
          OTP has been sent please check your email.
        </Typography>
        <Typography variant="small" color="blue-gray" className="mb-2 text-center">
          If you did not receive OTP, please click the button below to resend
          OTP.
        </Typography>
      </div>
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={4}
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
          onClick={onNextPage}
        >
          Verify
        </Button>
        <Button
          variant="gradient"
          className="w-1/2 place-self-center flex justify-center gap-4"
          disabled={time > 0}
        >
          <span className={time > 0 ? "block" : "hidden"}>{`${minutes}:${
            seconds < 10 ? `0${seconds}` : seconds
          }`}</span>
          Resend OTP
        </Button>
      </div>
    </div>
  );
}
