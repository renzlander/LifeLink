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
        remove
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
            Are you sure you want to remove this blood bag to collected?
          </Typography>
        </DialogBody>
        <DialogFooter>
            <Button
              variant="gradient"
              onClick={() => setOpen(false)}
              className="mr-1"
            >
              <span>No</span>
            </Button>
            <Button variant="gradient" color="red" >
              <span>Yes</span>
            </Button>
          </DialogFooter>
      </Dialog>
    </>
  );
}


  

export function EditPopUp({user}) {
  const [errorMessage, setErrorMessage] = useState({ serial_no: [], date_donated: [], bled_by: [],  venue: [] });
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [part3, setPart3] = useState("");
  const srNumber = `${part1}${part2}${part3}`;


  const serialNo = user.serial_no;
  const serialFormat = serialNo.match(/^(\d{4})(\d{6})(\d{1})$/);

  let firstPart = "";
  let secondPart = "";
  let thirdPart = "";

  if (serialFormat) {
    firstPart = serialFormat[1];
    secondPart = serialFormat[2];
    thirdPart = serialFormat[3];
  }

  const handleEditSerialNumber = async () => {
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
      <Tooltip content="Edit Serial Number">
        <IconButton variant="text" onClick={() => setOpen(true)}>
          <PencilIcon className="h-4 w-4" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader className="flex justify-between"><div>Edit Serial Number</div><div>Serial Number:  <span className="text-red-600">{firstPart}-{secondPart}-{thirdPart}</span></div></DialogHeader>
        <DialogBody divider className="flex flex-col gap-4">
        <div>
            <div className={`relative flex gap-3 items-center`}>
            <Input
              label="XXXX"
              maxLength={4}
              value={firstPart}
              onChange={(e) => {
                const newValue = e.target.value;
                if (!/^[0-9]*$/.test(newValue)) {
                  return;
                }
                setPart1(newValue);
              }}
              containerProps={{ className: "min-w-[75px]" }}
            />

              <Typography>-</Typography>
              <Input
                label="XXXXXX"
                maxLength={6}
                value={secondPart}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[0-9]*$/.test(newValue)) {
                    return;
                  }
                  setPart2(newValue);
                }}
                containerProps={{ className: "min-w-[100px]" }}
              />
              <Typography>-</Typography>
              <Input
                label="X"
                maxLength={1}
                value={thirdPart}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[0-9]*$/.test(newValue)) {
                    return;
                  }
                  setPart3(newValue);
                }}
                containerProps={{ className: "min-w-[25px]" }}
              />
            </div>
            {errorMessage.serial_no.length > 0 && (
              <div className="error-message text-red-600 text-sm mt-1">
                {errorMessage.serial_no[0]}
              </div>
            )}
          </div>

        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            onClick={() => setOpen(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red" onClick={handleEditSerialNumber}>
            <span>Done</span>
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