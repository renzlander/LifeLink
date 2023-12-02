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

export function SecurityPin() {
  const [oldSecurityPin, setOldSecurityPin] = useState("");
  const [newSecurityPin, setNewSecurityPin] = useState("");
  const [confirmNewSecurityPin, setConfirmNewSecurityPin] = useState("");
  const [validationError, setValidationError] = useState("");
  const [pinMatch, setPinMatch] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChangeSecurityPin = async (e) => {
    e.preventDefault();
    const token = getCookie("token");

    if (pinMatch === false) {
      setValidationError("New security pin does not match");
      console.log("lol");
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

        <Button size="sm" onClick={handleChangeSecurityPin} disabled={!pinMatch}>
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
