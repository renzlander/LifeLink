import { EyeIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";

export function ViewPopUp({ user }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip content="View User">
        <IconButton variant="text" onClick={() => setOpen(true)}>
          <EyeIcon className="h-4 w-4" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)} size="lg">
        <DialogHeader>User Details</DialogHeader>
        <DialogBody
          divider
          className="h-96 flex flex-col gap-4 overflow-y-auto"
        >
          <Chip value="FULL NAME" color="blue-gray" />
          <div className="flex gap-10 text-gray-900">
            <Typography>
              <strong>First Name:</strong>
              <br />
              {user.first_name}
            </Typography>
            <Typography>
              <strong>Middle Name:</strong>
              <br />
              {user.middle_name ? user.middle_name : "N/A"}
            </Typography>
            <Typography>
              <strong>Last Name:</strong>
              <br />
              {user.last_name}
            </Typography>
          </div>
          <Chip value="Donor Info" color="blue-gray" />
          <div className="flex gap-12 text-gray-900">
            <Typography>
              <strong>Number of Donation:</strong> {user.donate_qty}
            </Typography>
            <Typography>
              <strong>Badge:</strong> {user.badge}
            </Typography>
          </div>
          <Chip value="Contact Info" color="blue-gray" />
          <div className="flex gap-10 text-gray-900">
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography>
              <strong>Mobile:</strong> {user.mobile}
            </Typography>
          </div>
          <Chip value="Personal Info" color="blue-gray" />
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
          <Chip value="Full Address" color="blue-gray" />
          <Typography className="text-md text-gray-900 font-medium">
            {user.street}, {user.brgyDesc}, {user.citymunDesc}, {user.provDesc},{" "}
            {user.regDesc}
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
