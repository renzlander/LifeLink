import { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Input, Button } from "@material-tailwind/react";

export function RequestEmail({ onNextPage }) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <div className="w-full h-96 grid 2xl:w-1/2">
      <Typography variant="h4" color="blue-gray" className="mb-8">
        Enter your Email to send an OTP.
      </Typography>
      <Input
        size="lg"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="gradient" className="w-1/2 place-self-center" onClick={onNextPage}>
        Send OTP
      </Button>
      <Typography className="text-center text-gray-600 font-normal">
        Back to{" "}
        <span className="font-medium text-gray-900 cursor-pointer" onClick={() => router.push("/login")}>Log In</span>
      </Typography>
    </div>
  );
}
