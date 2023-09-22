import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Tooltip,
  IconButton,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { Typography } from "@mui/material";

export function AddBloodBagPopup({ user_id, handleOpen }) {
  const [open, setOpen] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [bledBy, setBledBy] = useState("");
  const [venue, setVenue] = useState("");
  const [dateDonated, setDateDonated] = useState("");

  const handleAddBloodBag = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Prepare data for the POST request
      const data = {
        user_id,
        serial_no: serialNumber,
        venue: venue,
        date_donated: dateDonated,
        bled_by: bledBy,
      };

      // Send POST request to add-bloodbag API
      const response = await axios.post(
        `${laravelBaseUrl}/api/add-bloodbag`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        // Blood bag added successfully, you can handle this accordingly
        console.log("Blood bag added successfully");
      } else {
        console.error("Error adding blood bag:", response.data.message);
      }

      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error("Error adding blood bag:", error);
    }
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} variant="gradient" color="red">
        + Add Blood Bag
      </Button>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Add Blood Bag</DialogHeader>
        <DialogBody divider className="flex flex-col gap-6">
          <Input
            label="Serial Number"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
          <Input
            label="Bled by"
            value={bledBy}
            onChange={(e) => setBledBy(e.target.value)}
          />
          <Input
            label="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
          <Input
            type="date"
            label="Date"
            value={dateDonated}
            onChange={(e) => setDateDonated(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpen(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red" onClick={handleAddBloodBag}>
            <span>Add</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export function EditPopUp() {
  const [open, setOpen] = useState(false);
  const bloodTypes = ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'];

  return (
    <>
      <Tooltip content="Edit User">
        <IconButton variant="text" onClick={() => setOpen(true)}>
          <PencilIcon className="h-4 w-4" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Delete User</DialogHeader>
        <DialogBody divider className="flex flex-col gap-6">
          <Input type="text" label="Donor Number" />
          <Input type="text" label="Name" />
          <Select label="Blood Type">
            {bloodTypes.map(type => (
              <Option key={type}>{type}</Option>
            ))}
          </Select>
          <Input type="text" label="E-mail" />
          <Input type="text" label="Mobile" />
          <Input type="date" label="Date of Birth" />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            onClick={() => setOpen(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red">
            <span>Done</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export function DeletePopUp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip content="Delete User">
        <IconButton variant="text" onClick={() => setOpen(true)}>
          <TrashIcon className="h-4 w-4 text-red-500" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Delete User</DialogHeader>
        <DialogBody divider className="flex flex-col gap-6">
          <Typography>
            Are you sure you want to delete this user?
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            onClick={() => setOpen(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red">
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}