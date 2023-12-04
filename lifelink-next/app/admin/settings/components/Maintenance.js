import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Switch,
  Typography,
} from "@material-tailwind/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { laravelBaseUrl } from "@/app/variables";
import axios from "axios";

export function MaintenanceSwitch() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await axios.get(
        `${laravelBaseUrl}/api/maintenance-status`
      );
      const maintenanceStatus = response.data.maintenance === "1";
      setIsSwitchOn(maintenanceStatus);
    } catch (error) {
      console.error("Error fetching maintenance status:", error);
    }
  };
  useEffect(() => {
    

    fetchMaintenanceStatus();
  }, []);

  const handleTypographyClick = () => {
    setConfirmationOpen(true);
  };

  const handleConfirmation = (confirmed) => {
    setConfirmationOpen(false);
    if (confirmed) {
      const newMaintenanceStatus = isSwitchOn ? "0" : "1";
      updateMaintenanceStatus(newMaintenanceStatus);
      setIsSwitchOn(!isSwitchOn);
    }
  };

  const handleSwitchChange = () => {
    setConfirmationOpen(true);
  };

  const updateMaintenanceStatus = async (newStatus) => {
    try {
      const response = await axios.get(
        `${laravelBaseUrl}/api/maintenance-status`,
        { maintenance: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );

    } catch (error) {
      console.error("Error updating maintenance status:", error);
    }
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
          isSwitchOn={isSwitchOn}
          refreshData={fetchMaintenanceStatus}
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

export function Confirmation({ isOpen, handleConfirmation, isSwitchOn, refreshData }) {
  const handleClose = (confirmed) => {
    handleConfirmation(confirmed);
  };

  const handleMaintenance = async (confirmed) => {
    try {
      // Check if the user is authenticated
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Construct the URL with the appropriate toggle value as a query parameter
      const toggleValue = confirmed ? "1" : "0";
      const apiUrl = `${laravelBaseUrl}/api/maintenance-mode?toggle=${toggleValue}`;

      // Send a POST request to the constructed URL
      const response = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        refreshData();
        handleClose(true);
      }
    } catch (error) {
      console.error("Error changing maintenance mode:", error);
      // Handle errors appropriately
    }
  };

  return (
    <Dialog open={isOpen} handler={handleClose}>
      <DialogHeader className="border-b">Confirmation</DialogHeader>
      <DialogBody className="flex flex-col items-center gap-4">
        <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500" />
        <Typography
          variant="h5"
          color="amber"
          className="font-medium text-center"
        >
          Are you sure you want to change the maintenance mode?
        </Typography>
      </DialogBody>
      <DialogFooter className="border-t">
        <Button variant="text" color="gray" onClick={() => handleClose(false)}>
          <span>Cancel</span>
        </Button>
        <Button
          variant="gradient"
          color="amber"
          className="text-white"
          onClick={() => handleMaintenance(!isSwitchOn)} // Pass the opposite of the current switch state
        >
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
