import { EyeIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

export function ViewPopUp({ user }) {
  const [open, setOpen] = useState(false);

  const age = calculateAge(user?.dob);

  return (
    <>
      <Tooltip content="View User">
        <IconButton variant="text" onClick={() => setOpen(true)}>
          <EyeIcon className="h-4 w-4" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)} size="lg">
        <DialogHeader>
          Patient Details
        </DialogHeader>
        <DialogBody divider className="flex flex-col gap-4">
          <Typography variant="h5" color="blue-gray">
            Dispensed Blood Record
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Typography variant="h6" color="blue-gray" className="flex gap-2">
                Patient Name:
                <span className="font-light">
                {`${user?.first_name} ${user?.middle_name} ${user?.last_name}`}
                </span>
              </Typography>
              <Typography variant="h6" color="blue-gray" className="flex gap-2">
                Blood Type:
                <span className="font-light">
                {user?.blood_type}
                </span>
              </Typography>
              <Typography variant="h6" color="blue-gray" className="flex gap-2">
                Birthday:
                <span className="font-light">
                {formatDate(user?.dob)}
                </span>
              </Typography>
              <Typography variant="h6" color="blue-gray" className="flex gap-2">
                Age:
                <span className="font-light">
                {age}
                </span>
              </Typography>
              <Typography variant="h6" color="blue-gray" className="flex gap-2">
                Sex:
                <span className="font-light">
                {user?.sex}
                </span>
              </Typography>
            </div>
            <div className="col-span-1">
              <Typography variant="h6" color="blue-gray">
                Serial Numbers Received:
              </Typography>
              <ul className="list-disc ml-4">
                {user.blood_bags.map((serial, index) => (
                  <li key={index} className="font-medium text-blue-gray-700 mb-2">
                    {serial.serial_no}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <hr className="fading_divider_gray my-4" />

          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <Typography variant="h6" color="blue-gray">
                Hospital:
              </Typography>
              <Typography variant="small" color="blue-gray" className="text-md">
                {user?.hospital_desc}
              </Typography>
            </div>
            <div className="col-span-1 place-self-center">
              <Typography variant="h6" color="blue-gray">
                Date Received:
              </Typography>
              <Typography variant="small" color="blue-gray" className="text-md">
                {formatDate(user?.created_at)}
              </Typography>
            </div>
            <div className="col-span-1 place-self-end">
              <Typography variant="h6" color="blue-gray">
                Payment:
              </Typography>
              <Typography variant="small" color="blue-gray" className="text-md">
                {user?.payment}
              </Typography>
            </div>
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
