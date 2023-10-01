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
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";


function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

export function RemoveBlood({ serial_no, handleOpen, countdown,refreshData }) {
  const [open, setOpen] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(""); 
  const router = useRouter();
    
  const handleRemoveBloodBag = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }
  
      // Construct the URL with serial_no as a query parameter
      const apiUrl = `${laravelBaseUrl}/api/remove-bloodbag?serial_no=${serial_no}`;
  
      // Send DELETE request to the constructed URL
      const response = await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

  
      if (response.data.status === 'success') {
        refreshData();
        toast.success('Removed blood bag successfully');
        console.log('Removed blood bag successfully');
        setOpen(false);
      } else {
        console.error('Error removing blood bag:', response.data.message);
      }
    } catch (error) {
      console.error('Error removing blood bag:', error); 
    }
  };
  
  

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} className="bg-red-600">
        Remove
      </Button>
      <Dialog open={open} handler={() => setOpen(false)} >
        <DialogHeader>Remove Blood Bag</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <Typography className="font-bold text-xl text-red-600 text-center">
            Are you sure you want to remove this blood bag?
          </Typography>
            <Typography className="text-sm text-red-600 font-bold text-center">
              This blood bag can be remove in {countdown} days
            </Typography>
        </DialogBody>
        {generalErrorMessage && (
          <div className="mt-4 text-center bg-red-100 p-2 rounded-lg">
            <Typography color="red" className="text-sm font-semibold">
              {generalErrorMessage}
            </Typography>
          </div>
        )}
        <DialogFooter className="flex justify-center mt-4">
            <Button
              variant="red-cross"
              onClick={() => setOpen(false)}
              className="mr-2"
            >
              No
            </Button>
          <Button variant="red-cross" color="red" onClick={handleRemoveBloodBag}>
            Yes
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}


  

export function EditPopUp({user, countdown,refreshData}) {
  const [errorMessage, setErrorMessage] = useState({ serial_no: [], date_donated: [], bled_by: [],  venue: [] });
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [bledBy, setBledBy] = useState(user.bled_by);
  const [venue, setVenue] = useState(user.venue);
  const [dateDonated, setDateDonated] = useState(user.date_donated);
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [part3, setPart3] = useState("");
  const srNumber = `${part1}${part2}${part3}`;

  console.log('user:', user);
  const serialNo = user.serial_no;
  const serialFormat = serialNo.match(/^(\d{4})(\d{6})(\d{1})$/);
  console.log('serialFormat:', serialFormat[1]);
  let firstPart = "";
  let secondPart = "";
  let thirdPart = "";

  if (serialFormat) {
    firstPart = serialFormat[1];
    secondPart = serialFormat[2];
    thirdPart = serialFormat[3];
  }

  useEffect(() => {
    if (user.serial_no) {
      const serialFormat = user.serial_no.match(/^(\d{4})(\d{6})(\d{1})$/);
      if (serialFormat) {
        setPart1(serialFormat[1]);
        setPart2(serialFormat[2]);
        setPart3(serialFormat[3]);
      }
    }
  }, [user.serial_no]);
  
  const handleEditSerialNumber = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }
  
      const data = {
        blood_bags_id: user.blood_bags_id,
        serial_no: srNumber,
        venue: venue,
        date_donated: dateDonated,
        bled_by: bledBy,
      };
      console.log("Before Axios POST request");
  
      const response = await axios.put(
        `${laravelBaseUrl}/api/edit-bloodbag`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).catch((error) => {
        toast.error('Opps! Something went wrong');
        if (error.response && error.response.data && error.response.data.errors) {
          const { errors } = error.response.data;
          const serialNumberError = errors.serial_no || [];
          const dateError = errors.date_donated || [];
          const bledByError = errors.bled_by || [];
          const venueError = errors.venue || [];
          setErrorMessage({
            serial_no: serialNumberError,
            date_donated: dateError,
            bled_by: bledByError,
            venue: venueError,
          });
        } else {
          setGeneralErrorMessage(error.response.data.message);
          setErrorMessage({
            serial_no: [],
            date_donated: [],
            bled_by: [],
            venue: [],
          });
        }
      });
  
      if (response.data.status === "success") {
        toast.success("Blood bag updated successfully");
        setOpen(false);
        refreshData();
      } else if (response.data.status === "error") {
        if (response.data.message) {
          toast.error(response.data.message);
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
        <DialogHeader className="flex justify-between"><div>Edit Blood Bag</div><div>Serial Number:  <span className="text-red-600">{part1}-{part2}-{part3}</span></div></DialogHeader>
        <Typography className="text-sm text-red-600 font-bold text-center">
          This blood bag can be edited in {countdown} days
        </Typography>
        <DialogBody divider className="flex flex-col gap-4">
          <div>
            <div className={`relative flex gap-3 items-center`}>
              <Input
                label="XXXX"
                maxLength={4}
                value={part1}
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
                value={part2}
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
                value={part3}
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
            {errorMessage.serial_no && (
              <div className="error-message text-red-600 text-sm mt-1">
                {errorMessage.serial_no}
              </div>
            )}
          </div>
          <div className={`relative ${errorMessage.bled_by ? "mb-1" : ""}`}>
            <Input
              label="Bled by"
              value={bledBy}
              onChange={(e) => setBledBy(e.target.value)}
            />
            {errorMessage.bled_by && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.bled_by}
              </div>
            )}
          </div>
          <div className={`relative ${errorMessage.venue ? "mb-1" : ""}`}>
            <Input
              label="Venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
            {errorMessage.venue && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.venue}
              </div>
            )}
          </div>
          <div className={`relative ${errorMessage.date_donated ? "mb-1" : ""}`}>
            <Input
              type="date"
              label="Date"
              value={dateDonated}
              onChange={(e) => setDateDonated(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            {errorMessage.date_donated && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.date_donated}
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
          <Button
            variant="gradient"
            color="red"
            onClick={handleEditSerialNumber}
          >
            <span>Done</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}


export function MoveToStock({ serial_no, handleOpen, refreshData}){
  const [open, setOpen] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");

  const handleMovetoStock = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.post(
        `${laravelBaseUrl}/api/add-to-inventory`,
        {
          serial_no,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).catch((error) => {
        console.error("Unknown error occurred:", error);
      });
    
      if (response.data.status === "success") {
        refreshData();
        console.log("Blood bag added successfully");
        toast.success("Blood bag added to inventory successfully");
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
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} className="bg-red-600">
        Move to stock
      </Button>
      <Dialog open={open} handler={() => setOpen(false)} >
        <DialogHeader>Move Blood Bag to Inventory</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <Typography className="font-bold text-xl text-red-600 text-center">
            Are you sure you want to move this blood bag to inventory?
          </Typography>
        </DialogBody>
        {generalErrorMessage && (
          <div className="mt-4 text-center bg-red-100 p-2 rounded-lg">
            <Typography color="red" className="text-sm font-semibold">
              {generalErrorMessage}
            </Typography>
          </div>
        )}
        <DialogFooter className="flex justify-center mt-4">
            <Button
              variant="red-cross"
              onClick={() => setOpen(false)}
              className="mr-2"
            >
              No
            </Button>
          <Button variant="red-cross" color="red" onClick={handleMovetoStock}>
            Yes
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