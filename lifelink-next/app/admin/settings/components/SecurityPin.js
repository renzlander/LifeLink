import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Collapse,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import PasswordChecklist from "react-password-checklist";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function SecurityPin() {
  const [oldSecurityPin, setOldSecurityPin] = useState("");
  const [newSecurityPin, setNewSecurityPin] = useState("");
  const [confirmNewSecurityPin, setConfirmNewSecurityPin] = useState("");
  const [validationError, setValidationError] = useState("");
  const [pinMatch, setPinMatch] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangeSecurityPin = async (e) => {
    e.preventDefault();
    const token = getCookie("token");

    if (pinMatch === false) {
      setValidationError("New security pin does not match");
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

      if (response.data.status === "success") {
        toast.success("Security pin updated successfully");
        // Optionally, you can reset the input fields after a successful change
        setOldSecurityPin("");
        setNewSecurityPin("");
        setConfirmNewSecurityPin("");
        setValidationError(""); // Reset validation error
        setErrorMessage("");
      }else{
        setErrorMessage(response.data.message);
        toast.error("Ooops! Something went wrong");
      }
    } catch (error) {
      toast.error("Ooops! Something went wrong");
      console.error("Error changing security pin:", error); // Handle error
      setErrorMessage(error.response.data.message);
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
      {errorMessage && (
          <div className="bg-red-100 border text-center border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
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
          onFocus={() => setOpen(true)}
        />
        <Collapse open={open} className={open ? "" : "hidden"}>
          <Card shadow={false} className="bg-gray-300 w-full px-4 py-2">
            <PasswordChecklist
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={8}
              value={newSecurityPin}
              valueAgain={confirmNewSecurityPin}
              onChange={(isValid) => {
                if (isValid) {
                  setPinMatch(true);
                } else {
                  setPinMatch(false);
                }
              }}
            />
          </Card>
        </Collapse>
        <Input
          label="Confirm new security pin"
          type="password"
          value={confirmNewSecurityPin}
          onChange={(e) => setConfirmNewSecurityPin(e.target.value)}
        />

        {validationError && (
          <Typography variant="small" color="red">
            {validationError}
          </Typography>
        )}

        <Button
          size="sm"
          onClick={handleChangeSecurityPin}
          disabled={!pinMatch}
        >
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
