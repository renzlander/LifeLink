import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Tooltip, IconButton, Select, Option } from "@material-tailwind/react";
import { ArrowsRightLeftIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function MoveToDeferral({ user_id, handleOpen, refreshData }) {
    const [open, setOpen] = useState(false);
    const [otherReason, setOtherReason] = useState('');
    const [category, setCategory] = useState('');
    const [remarks, setRemarks] = useState('');
    const [duration, setDuration] = useState(1);
    const [errorMessage, setErrorMessage] = useState({ category: [], specific_reason: [], remarks: [], duration: [] });
    const [generalErrorMessage, setGeneralErrorMessage] = useState("");

    const handleIncrement = () => {
      const parsedDuration = parseInt(duration, 10);
      if (parsedDuration < 999) {
        setDuration((parsedDuration + 1).toString().padStart(3, '0'));
      }
    };
    
    const handleDecrement = () => {
      const parsedDuration = parseInt(duration, 10);
      if (parsedDuration > 0) {
        setDuration((parsedDuration - 1).toString().padStart(3, '0'));
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
  
    const handleMoveToDeferral = async (e) => {
      e.preventDefault();
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
        <Tooltip content="Move to Defferal">
            <IconButton size="sm" onClick={() => setOpen(true)} variant="gradient" color="red">
                <ArrowsRightLeftIcon className="h-5 w-5" />
            </IconButton>
        </Tooltip>
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
            
          <div className={`relative mb-8`}>
                <Select
                  label="Type of Defferal"
                  value={remarks}
                  onChange={(value) => handleRemarksChange(value)}
                  required
                >
                  <Option value="1">Temporary Deferral</Option>
                  <Option value="2">Permanent Deferral</Option>
                </Select>
                {errorMessage.remarks.length > 0 && (
                  <div className="error-message text-red-600 text-sm absolute mt-2">
                    {errorMessage.remarks[0]}
                  </div>
                )}
              </div>
              <div className={`relative ${errorMessage.category.length > 0 ? "mb-4" : ""}`}>
                <Select
                  label="Category"
                  value={category}
                  onChange={(value) => handleCategoryChange(value)}
                  required
                >
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
              {remarks === '1' && (
                <div className="flex items-center justify-center mb-4 text-black w-full">
                  <IconButton
                    onClick={handleDecrement}
                    className="rounded-r-none"
                  >
                    <MinusIcon className="h-5 w-5" />
                  </IconButton>
                  <Input
                    type="text"
                    label="Days"
                    maxLength={3}
                    value={duration}
                    onChange={e => {
                      const inputVal = e.target.value;
                      if (/^[0-9]*$/.test(inputVal)) {
                        setDuration(inputVal);
                      }
                    }}
                    className="text-center rounded-none appearance-none"
                    containerProps={{ className: "max-w-[50px]" }}
                  />
                  <IconButton
                    onClick={handleIncrement}
                    className="rounded-l-none"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </IconButton>
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

  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
}
