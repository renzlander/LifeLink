import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Switch,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function MaintenanceSwitch() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleTypographyClick = () => {
    setConfirmationOpen(true);
  };

  const handleConfirmation = (confirmed) => {
    setConfirmationOpen(false);
    if (confirmed) {
      setIsSwitchOn(!isSwitchOn);
    }
  };

  const handleSwitchChange = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  return (
    <Card id="mainte" className="w-full bg-white p-4">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Maintenance
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Please do not turn on without a reason
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex items-center justify-between px-4 bg-blue-gray-50 rounded-lg">
        <Confirmation
          isOpen={confirmationOpen}
          handleConfirmation={handleConfirmation}
        />
        <Typography
          variant="h6"
          color="blue-gray"
          className="font-semibold cursor-pointer"
          onClick={handleTypographyClick}
        >
          Turn ON/OFF Maintenance Mode
        </Typography>
        <Switch
          id="custom-switch-component"
          ripple={false}
          checked={isSwitchOn}
          onChange={handleSwitchChange}
          className="h-full w-full checked:bg-gray-800"
          containerProps={{
            className: "w-11 h-6",
          }}
          circleProps={{
            className: "before:hidden left-0.5 border-none",
          }}
        />
      </CardBody>
    </Card>
  );
}

export function Confirmation({ isOpen, handleConfirmation }) {
  const handleClose = (confirmed) => {
    handleConfirmation(confirmed);
  };

  return (
    <Dialog open={isOpen} handler={handleClose}>
      <DialogHeader>Confirmation</DialogHeader>
      <DialogBody>
        Are you sure you want to change the maintenance mode?
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={() => handleClose(false)}>
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={() => handleClose(true)}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
