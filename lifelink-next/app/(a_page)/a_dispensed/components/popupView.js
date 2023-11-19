import React, { useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Tooltip, IconButton } from "@material-tailwind/react";
import { Typography } from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";
import "react-toastify/dist/ReactToastify.css";

function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
}

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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
          <Dialog open={open} handler={() => setOpen(false)}>
              <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] rounded-t-md text-white font-semibold">
                  Patient Details
              </DialogHeader>
              <DialogBody className="flex flex-col gap-4">
                    <Typography variant="h6" className="font-bold">
                        Dispensed Blood Record
                    </Typography>
                    <div className="flex flex-row justify-around gap-3">
                      <div>
                        <div className="flex flex-col gap-2">
                            <div className="flex">
                                <span className="font-bold mr-4">Patient Name:</span>
                                {`${user?.first_name} ${user?.middle_name} ${user?.last_name}`}
                            </div>
                            <div className="flex ">
                                <span className="font-bold mr-4">Blood Type:</span>
                                {user?.blood_type}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex">
                                <span className="font-bold mr-4">Date of Birth:</span>
                                {formatDate(user?.dob)}
                            </div>
                            <div className="flex">
                                <span className="font-bold mr-4">Age:</span>
                                {age}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex">
                                <span className="font-bold mr-4">Sex:</span>
                                {user?.sex}
                            </div>
                        </div>
                      </div>
                        <div className="flex flex-col gap-2 w-1/3 overflow-y-auto h-[150px]">
                            <span className="font-bold">Serial Numbers Received:</span>
                            <ul className="list-disc ml-4">
                                {user.blood_bags.map((serial, index) => (
                                    <li key={index} className="mb-2">
                                        {serial.serial_no}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <hr className="border-b border-gray-300 mt-4 mb-6" />

                    <div className="flex justify-between">
                        <div className="flex flex-col gap-2">
                            <span className="font-bold">Hospital:</span>
                            <p>{user?.hospital}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="font-bold">Date Received:</span>
                            <p>{formatDate(user?.created_at)}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="font-bold">Payment:</span>
                            <p>{user?.payment}</p>
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
