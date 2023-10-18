import React, { useEffect, useState } from "react";
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
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { Typography } from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}
  

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
        <DialogHeader>{user.first_name} {user.middle_name} {user.last_name}</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4">
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
            {user.street}, {user.barangay}, {user.municipality}, {user.province}, {user.region}
          </Typography>
          <div className="flex justify-around w-full gap-10 overflow-x-auto">
            <div className="bg-white p-4 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Donated Blood</h3>
              <div className="overflow-y-auto max-h-[150px]">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-red-100">
                      <th className="px-4 py-2">Serial Number</th>
                      <th className="px-4 py-2">Date Donated</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                        {user.blood_bags.map((bag, index) => (
                          <div key={index}>
                            {bag.serial_no}
                          </div>
                        ))}
                        </Typography>
                      </td>
                      <td className="px-4 py-2">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {user.blood_bags.map((bag, index) => (
                          <div key={index}>
                            {formatDate(bag.date_donated)}
                          </div>
                        ))}
                        </Typography>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white p-4 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Received Blood</h3>
              <div className="overflow-y-auto max-h-[150px]">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-red-100">
                      <th className="px-4 py-2">Serial Number</th>
                      <th className="px-4 py-2">Date Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2">78901221251</td>
                      <td className="px-4 py-2">2023-09-25</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">78901221251</td>
                      <td className="px-4 py-2">2023-09-25</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">78901221251</td>
                      <td className="px-4 py-2">2023-09-25</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">78901221251</td>
                      <td className="px-4 py-2">2023-09-25</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}