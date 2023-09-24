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
} from "@heroicons/react/24/solid";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { Typography } from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

export function MoveToDeferral({ user_id, handleOpen }) {
  const [open, setOpen] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [bledBy, setBledBy] = useState("");
  const [venue, setVenue] = useState("");
  const [dateDonated, setDateDonated] = useState("");
  const [errorMessage, setErrorMessage] = useState({ serial_no: [], date_donated: [], bled_by: [],  venue: [] });
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");

  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [part3, setPart3] = useState("");
  const srNumber = `${part1}${part2}${part3}`;

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
        serial_no: srNumber,
        venue: venue,
        date_donated: dateDonated,
        bled_by: bledBy,
      };
      console.log("Before Axios POST request");

      // Send POST request to add-bloodbag API
      const response = await axios.post(
        `${laravelBaseUrl}/api/add-bloodbag`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).catch((error) => {
        console.error("Unknown error occurred:", error);
        if (error.response && error.response.data && error.response.data.errors) {
          const { errors } = error.response.data;
          const serialNumberError = errors.serial_no || [];
          const dateError = errors.date_donated || [];
          const bledByError = errors.bled_by || [];
          const venueError = errors.venue || [];
          setErrorMessage({ serial_no: serialNumberError, date_donated: dateError, bled_by: bledByError, venue: venueError });
        } else {
          setGeneralErrorMessage(error.response.data.message);
          setErrorMessage({ serial_no: [], date_donated: [], bled_by: [], venue: [] });
        }
      });
    
      if (response.data.status === "success") {
        // Blood bag added successfully, you can handle this accordingly
        console.log("Blood bag added successfully");
      }  else if (response.data.status === "error") {
        if (response.data.message) {
          setGeneralErrorMessage(response.data.message);
        } else {
          console.error("Unknown error occurred:", response.data);
        }
      }
      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error("Unknown error occurred:", error);
    }
  };


  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} variant="gradient" color="red">
        Move to Deferral
      </Button>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Move to Deferral</DialogHeader>
        {generalErrorMessage && (
          <div className="mt-4 text-center bg-red-100 p-2 rounded-lg">
            <Typography color="red" className="text-sm font-semibold">
              {generalErrorMessage}
            </Typography>
          </div>
        )}

        <DialogBody divider className="flex flex-col gap-6">
          <Typography className="font-bold text-4xl -mb-3 rounded-md text-black px-2 py-1">
            Move to Deferral Form HERE!!! 
          </Typography>
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