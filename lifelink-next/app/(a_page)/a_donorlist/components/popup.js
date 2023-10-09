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
import { toast } from "react-toastify";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

export function MoveToDeferral({ user_id, handleOpen, refreshData }) {
  const [open, setOpen] = useState(false);
  const [otherReason, setOtherReason] = useState('');
  const [category, setCategory] = useState('');
  const [remarks, setRemarks] = useState('');
  const [duration, setDuration] = useState(1);
  const [errorMessage, setErrorMessage] = useState({ category: [], specific_reason: [], remarks: [], duration: [] });
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");

  const handleIncrement = () => {
    setDuration(parseInt(duration, 10) + 1);
  };

  const handleDecrement = () => {
    const parsedDuration = parseInt(duration, 10);
    if (parsedDuration > 0) {
      setDuration(parsedDuration - 1);
    }
  };

  const handleChange = (e) => {
    const newValue = parseInt(e.target.duration, 10);
    if (!isNaN(newValue)) {
      setDuration(newValue);
    }
  };


  const handleCategoryChange = (value) => {
    setCategory(value);
  };
  const handleRemarksChange = (value) => {
    setRemarks(value);
  };

  const handleMoveToDeferral = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }
  
      // Prepare data for the POST request
      const data = {
        user_id,
        category: category,
        specific_reason: otherReason,
        remarks: remarks,
        duration: duration,
      };
  
      const response = await axios
        .post(`${laravelBaseUrl}/api/move-to-defferal`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => {
          console.error("Unknown error occurred:", error);
          toast.error("Oops! Something went wrong");
          if (error.response && error.response.data && error.response.data.errors) {
            const { errors } = error.response.data;
            const categoryError = errors.category || [];
            const otherReasonError = errors.specific_reason || [];
            const remarksError = errors.remarks || [];
            const durationError = errors.duration || [];
            setErrorMessage({
              category: categoryError,
              specific_reason: otherReasonError,
              remarks: remarksError,
              duration: durationError,
            });
          } else {
            setGeneralErrorMessage(error.response.data.message);
            setErrorMessage({
              category: [],
              specific_reason: [],
              remarks: [],
              duration: [],
            });
          }
        });
  
  
        if (response.data.status === "success") {
          
        } else if (response.data.status === "error") {
          if (response.data.message) {
            setGeneralErrorMessage(response.data.message);
          } else {
            console.error("Unknown error occurred:", response.data);
          }
        }
        setOpen(false);
        refreshData();
        toast.success("Successfully moved to deferral");
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
      <div className={`relative ${errorMessage.category.length > 0 ? "mb-4" : ""}`}>
        <Select
          label="Category"
          value={category}
          onChange={(value) => handleCategoryChange(value)}
        >
          <Option value="" disabled>Category</Option>
          <Option value="1">History and P.E</Option>
          <Option value="2">Abnormal Hemoglobin</Option>
          <Option value="3">Other Reason/s</Option>
        </Select>
        {errorMessage.category.length > 0 && (
          <div className="error-message text-red-600 text-sm mt-1">
            {errorMessage.category[0]}
          </div>
        )}
      </div>

      {category === '3' && (
        <div className={`relative mb-8`}>
          <Input
            label="Other Reason/s"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
          />
          {errorMessage.specific_reason.length > 0 && (
            <div className="error-message text-red-600 text-sm absolute mt-2">
              {errorMessage.specific_reason[0]}
            </div>
          )}
        </div>
      )}
      <div className={`relative mb-8`}>
        <Select
          label="Remarks"
          value={remarks}
          onChange={(value) => handleRemarksChange(value)}
        >
          <Option value=""></Option>
          <Option value="1">Temporary Deferral</Option>
          <Option value="2">Permanent Deferral</Option>
        </Select>
        {errorMessage.remarks.length > 0 && (
          <div className="error-message text-red-600 text-sm absolute mt-2">
            {errorMessage.remarks[0]}
          </div>
        )}
      </div>
      {remarks === '1' && (
        <div className="flex items-center justify-center mb-4 text-black">
          <Button
            onClick={handleDecrement}
            className="bg-gray-200 text-gray-600 px-4 py-1 rounded-l text-2xl"
          >
            -
          </Button>
          <Input
            type="number"
            label="Days"
            value={duration}
            onChange={e => {
              const inputVal = e.target.value;
              if (/^[0-9]*$/.test(inputVal)) {
                setDuration(inputVal);
              }
            }}
            className="text-center" 
          />
          <Button
            onClick={handleIncrement}
            className="bg-gray-200 text-gray-600 px-3 py-1 rounded-r text-2xl"
          >
            +
          </Button>
          <span className="ml-2 text-gray-600 text-2xl">Days</span>
          {errorMessage.duration.length > 0 && (
          <div className="error-message text-red-600 text-sm absolute mt-2">
            {errorMessage.duration[0]}
          </div>
        )}
        </div>
      )}
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
          <Button variant="gradient" color="red" onClick={handleMoveToDeferral}>
            <span>Move</span>
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