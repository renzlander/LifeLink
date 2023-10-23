import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import { Typography } from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";
import 'react-toastify/dist/ReactToastify.css';

export function ViewPopUp({user}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip content="View User">
        <IconButton variant="text" onClick={() => setOpen(true)}>
          <EyeIcon className="h-4 w-4" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>View User</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4">
          <Typography className="font-bold text-xs -mb-3 bg-red-400 rounded-md text-white px-2 py-1">
            NAME
          </Typography>
          <div className="flex gap-10 text-gray-900">
            <Typography>
              <strong>First Name:</strong>
              <br/>
              {user.first_name}
            </Typography>
            <Typography>
              <strong>Middle Name:</strong> 
              <br/>
              {user.middle_name ? user.middle_name : "N/A"}
            </Typography>
            <Typography>
              <strong>Last Name:</strong> 
              <br/>
              {user.last_name}
            </Typography>
          </div>
          <Typography className="font-bold text-xs -mb-3 bg-red-400 rounded-md text-white px-2 py-1">
            Donor Info
          </Typography>
          <div className="flex gap-12 text-gray-900">
            <Typography>
              <strong>Number of Donation:</strong> {user.donate_qty}
            </Typography>
            <Typography>
              <strong>Badge:</strong> {user.badge}
            </Typography>
          </div>
          <Typography className="font-bold text-xs -mb-3 bg-red-400 rounded-md text-white px-2 py-1">
            CONTACT INFO
          </Typography>
          <div className="flex gap-10 text-gray-900">
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography>
              <strong>Mobile:</strong> {user.mobile}
            </Typography>
          </div>
          <Typography className="font-bold text-xs -mb-3 bg-red-400 rounded-md text-white px-2 py-1">
            PERSONAL INFO
          </Typography>
          <div className="flex gap-10 text-gray-900">
            <Typography>
              <strong>Sex:</strong> {user.sex}
            </Typography>
            <Typography>
              <strong>Date of Birth:</strong> {user.dob}
            </Typography>
            <Typography>
              <strong>Blood Type:</strong> {user.blood_type}
            </Typography>
          </div>
          <Typography className="font-bold text-xs -mb-3 bg-red-400 rounded-md text-white px-2 py-1">
            ADDRESS
          </Typography>
          <Typography className="text-lg text-gray-900 font-medium">
            {user.street}, {user.barangay}, {user.municipality}, {user.province}, {user.region}
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" onClick={() => setOpen(false)}>
            <span>Close</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}