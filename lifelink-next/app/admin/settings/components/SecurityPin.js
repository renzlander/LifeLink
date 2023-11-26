import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

export function SecurityPin() {
  const [oldSecurityPin, setOldSecurityPin] = useState("");
  const [newSecurityPin, setNewSecurityPin] = useState("");
  const [confirmNewSecurityPin, setConfirmNewSecurityPin] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasCapitalLetter, setHasCapitalLetter] = useState(false);

  useEffect(() => {
    // Update validation checkmarks
    setIsLengthValid(newSecurityPin.length >= 8);
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(newSecurityPin));
    setHasNumber(/\d/.test(newSecurityPin));
    setHasCapitalLetter(/[A-Z]/.test(newSecurityPin));
  }, [newSecurityPin]);

  const isChangeButtonDisabled = () => {
    return (
      !isLengthValid ||
      !hasSpecialChar ||
      !hasNumber ||
      !hasCapitalLetter ||
      newSecurityPin !== confirmNewSecurityPin
    );
  };

  const handleChangeSecurityPin = async () => {
    const token = getCookie("token");

    // Front-end validation
    if (isChangeButtonDisabled()) {
      setValidationError(
        "Please make sure the security pin meets all requirements and matches the confirmation."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${laravelBaseUrl}/api/change-security-pin`,
        {
          old_security_pin: oldSecurityPin,
          new_security_pin: newSecurityPin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data); // Handle success response

      // Optionally, you can reset the input fields after a successful change
      setOldSecurityPin("");
      setNewSecurityPin("");
      setConfirmNewSecurityPin("");
      setValidationError(""); // Reset validation error
    } catch (error) {
      console.error("Error changing security pin:", error); // Handle error
    }
  };

  return (
    <Card id="security">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography variant="h5" color="blue-gray">
          Change Security Pin
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Change the security pin for the Deferral List
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Input
          label="Old security pin"
          type="password"
          value={oldSecurityPin}
          onChange={(e) => setOldSecurityPin(e.target.value)}
        />
        <Input
          label="New security pin"
          type="password"
          value={newSecurityPin}
          onChange={(e) => setNewSecurityPin(e.target.value)}
        />
        <div className="flex flex-col  gap-2">
          <div className="flex items-center gap-2">
            <span className={isLengthValid ? "text-green-500" : "text-red-500"}>
              {isLengthValid ? "✔" : "✘"}
            </span>
            <Typography
              className={isLengthValid ? "text-green-500" : "text-red-500"}
              variant="caption"
            >
              Security pin has at least 8 characters.
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <span className={hasSpecialChar ? "text-green-500" : "text-red-500"}>
              {hasSpecialChar ? "✔" : "✘"}
            </span>
            <Typography
              className={hasSpecialChar ? "text-green-500" : "text-red-500"}
              variant="caption"
            >
              Security pin has special characters.
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <span className={hasNumber ? "text-green-500" : "text-red-500"}>
              {hasNumber ? "✔" : "✘"}
            </span>
            <Typography
              className={hasNumber ? "text-green-500" : "text-red-500"}
              variant="caption"
            >
              Security pin has a number.
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={hasCapitalLetter ? "text-green-500" : "text-red-500"}
            >
              {hasCapitalLetter ? "✔" : "✘"}
            </span>
            <Typography
              className={hasCapitalLetter ? "text-green-500" : "text-red-500"}
              variant="caption"
            >
              Security pin has a capital letter.
            </Typography>
          </div>
        </div>
        <Input
          label="Confirm new security pin"
          type="password"
          value={confirmNewSecurityPin}
          onChange={(e) => setConfirmNewSecurityPin(e.target.value)}
        />

        {validationError && (
          <Typography color="red" className="mt-1 font-normal">
            {validationError}
          </Typography>
        )}

        <Button onClick={handleChangeSecurityPin} disabled={isChangeButtonDisabled()}>
          Change
        </Button>
      </CardBody>
    </Card>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
