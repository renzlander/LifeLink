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
      <Button size="sm" onClick={() => setOpen(true)} className="bg-red-600 mr-4">
        Revert
      </Button>
      <Dialog open={open} handler={() => setOpen(false)} >
        <DialogHeader>Remove Blood Bag</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <Typography className="font-bold text-xl text-red-600 text-center">
            Are you sure you want to return it to collected?
          </Typography>
            <Typography className="text-sm text-red-600 font-bold text-center">
              This blood bag can be return in {countdown} days
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
        Dispense
      </Button>
      <Dialog open={open} handler={() => setOpen(false)} >
        <DialogHeader>Move Blood Bag to Inventory</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <Typography className="font-bold text-xl text-red-600 text-center">
            DISPENSE FORM HERE.........
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


export function Disposed({ serial_no, handleOpen, countdown,refreshData }) {
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
      <Button size="sm" onClick={() => setOpen(true)} className="bg-red-600 mr-4">
        Dispose
      </Button>
      <Dialog open={open} handler={() => setOpen(false)} >
        <DialogHeader>Remove Blood Bag</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <Typography className="font-bold text-xl text-red-600 text-center">
            Are you sure you want to disposed this blood bag?
          </Typography>
            <Typography className="text-sm text-red-600 font-bold text-center">
              This blood bag can be return in {countdown} days
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

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}