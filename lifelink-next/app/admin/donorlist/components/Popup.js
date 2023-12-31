import { EyeIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { TableDonated } from "./TableDonated";
import { TableReceived } from "./TableReceived";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

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
        <DialogHeader>
          {user.first_name} {user.middle_name} {user.last_name}
        </DialogHeader>
        <DialogBody divider className="h-96 flex flex-col gap-4 overflow-y-auto">
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
              <strong>Date of Birth:</strong> {formatDate(user.dob)}
            </Typography>
            <Typography>
              <strong>Blood Type:</strong> {user.blood_type}
            </Typography>
          </div>
          <Typography className="font-bold text-xs -mb-3 bg-red-400 rounded-md text-white px-2 py-1">
            ADDRESS
          </Typography>
          <Typography className="text-lg text-gray-900 font-medium">
            {user.street}, {user.brgyDesc}, {user.citymunDesc}, {user.provDesc}
            , {user.regDesc}
          </Typography>
          <div className="mt-6 flex justify-between w-full gap-10">
            <Card className="border-2 w-1/2">
              <CardHeader
                color="gray"
                shadow={false}
                className="relative h-10 flex items-center pl-4"
              >
                <Typography variant="h6">Donated Blood</Typography>
              </CardHeader>
              <CardBody>
                <TableDonated user={user} />
              </CardBody>
            </Card>
            <Card className="border-2 w-1/2">
              <CardHeader
                color="gray"
                shadow={false}
                className="relative h-10 flex items-center pl-4"
              >
                <Typography variant="h6">Received Blood</Typography>
              </CardHeader>
              <CardBody>
                <TableReceived user={user} />
              </CardBody>
            </Card>
          </div>
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
