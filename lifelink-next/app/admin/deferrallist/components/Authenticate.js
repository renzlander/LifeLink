import { laravelBaseUrl } from "@/app/variables";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthCard({ onAuthenticate }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [showPin, setShowPin] = useState(false);

  const handleShowPin = () => {
    setShowPin(!showPin);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
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
            security_pin: password,
          },
        }
      );

      if (response.data.status === "success") {
        onAuthenticate();
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Invalid password. Please try again.");
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
            type={showPin ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            icon={
              showPin ? (
                <EyeSlashIcon className="w-5 h-5" onClick={handleShowPin} />
              ) : (
                <EyeIcon className="w-5 h-5" onClick={handleShowPin} />
              )
            }
          />
          {error && (
            <Typography variant="body" color="red">
              {error}
            </Typography>
          )}
          <Button variant="gradient" type="submit" fullWidth>
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
