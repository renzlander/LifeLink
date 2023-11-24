import { laravelBaseUrl } from "@/app/variables";
import { Button, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function RegF3() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(90); // 1 30s
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [user_id, setUserId] = useState(null);

  useEffect(() => {
    let timer;

    const storedUserId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_id="))
      .split("=")[1];
    setUserId(storedUserId);

    const checkIfVerified = async () => {
      try {
        const response = await axios.post(
          `${laravelBaseUrl}/api/check-verify-reg`,
          {
            user_id: storedUserId,
          }
        );

        if (response.data.status === "success") {
          document.cookie =
            "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          setIsButtonDisabled(false);
          setCountdown(0); // Stop the countdown if already verified
        } else {
          if (countdown > 0) {
            timer = setTimeout(() => {
              setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
          } else {
            setIsButtonDisabled(false); // Enable the button when the countdown reaches 0
          }
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    };

    checkIfVerified(); // Initial check

    const interval = setInterval(() => {
      checkIfVerified(); // Periodic check
    }, 60000); // Check every minute, adjust as needed

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [countdown]);

  const handleResendClick = async () => {
    // Reset the countdown and disable the button
    setCountdown(90);
    setIsButtonDisabled(true);

    try {
      const response = await axios.post(
        `${laravelBaseUrl}/api/email/verification-notification`,
        {
          user_id: user_id,
        }
      );
      if (response.data.status === "success") {
        setIsButtonDisabled(false); // Enable the button on successful resend
      } else {
      }
    } catch (error) {
      console.error("Error resending verification link:", error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full sm:w-96 mt-6" color="transparent" shadow={false}>
        <div className="p-8 text-center">
          <Typography variant="h4" className="mb-6" color="blue-gray">
            A verification link has been sent to your email.
          </Typography>
          <img src="/phone.svg" alt="Shake Hands" className="w-80 h-80" />
          <Button
            type="button"
            variant="contained"
            onClick={handleResendClick}
            className="w-full mt-8"
            disabled={isButtonDisabled}
          >
            {countdown > 0
              ? `Resend link available in ${Math.floor(countdown / 60)}:${
                  countdown % 60
                }`
              : "Resend link"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
