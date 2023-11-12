import React, { useState } from "react";
import {
    Card,
    Checkbox,
    Button,
    IconButton,
    SpeedDial,
    SpeedDialHandler,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Textarea,
    List,
    ListItem,
    ListItemPrefix,
    Typography,
  } from "@material-tailwind/react";
  import { PlusIcon } from "@heroicons/react/24/outline";
  import { ToastContainer, toast } from "react-toastify";
  import axios from "axios";
  import { laravelBaseUrl } from "@/app/variables";

  const formatDate = (donationDate) => {
    const formattedDate = new Date(donationDate).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return formattedDate;
};

  export function CreatePost() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(!open);

    return (
        <div>  
            <div className="relative h-80 w-full">
                <div className="absolute bottom-0 right-0">
                    <SpeedDial>
                        <SpeedDialHandler>
                            <IconButton size="lg" className="rounded-full" onClick={handleOpen}>
                                <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
                            </IconButton>
                        </SpeedDialHandler>
                    </SpeedDial>
                </div>
            </div>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Create Post</DialogHeader>
                <DialogBody className="flex flex-col" divider>
                    <Textarea label="Write Something" />
                    <ContactCheckbox />
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="gradient"
                        color="gray"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="red" onClick={handleOpen}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
  }

  
 export function ContactCheckbox() {
    const contactMode = ["Phone", "E-mail"];
  
    return (
      <Card className="w-full max-w-md">
        <Typography variant="h5" color="blue-gray" className="ml-4 mt-4">Modsadadse of Contact</Typography>
        <List className="flex-row">
          {contactMode.map((contactMode) => (
            <ListItem className="p-0" key={contactMode}>
              <label
                htmlFor={`horizontal-list-${contactMode.toLowerCase()}`}
                className="flex w-full cursor-pointer items-center px-3 py-2"
              >
                <ListItemPrefix className="mr-3">
                  <Checkbox
                    id={`horizontal-list-${contactMode.toLowerCase()}`}
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                      className: "p-0",
                    }}
                  />
                </ListItemPrefix>
                <Typography color="blue-gray" className="font-medium">
                  {contactMode}
                </Typography>
              </label>
            </ListItem>
          ))}
        </List>
      </Card>
    );
  }

  export function Interested({ requestId, onInterestedClick, updateInterestedBloodRequests, fetchMySchedule }) {
    const [open, setOpen] = useState(false);
    const [generalErrorMessage, setGeneralErrorMessage] = useState("");

    const handleInterested = async () => {
      try {
          const token = getCookie("token");
          if (!token) {
              router.push("/login");
              return;
          }

          // Prepare data for the POST request
          const data = {
              blood_request_id:requestId,
          };

          const response = await axios
              .post(`${laravelBaseUrl}/api/button-interested`, data, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              })
              .catch((error) => {
                  console.error("Unknown error occurred:", error);
                  if (error.response && error.response.data && error.response.data.errors) {
                    setGeneralErrorMessage(error.response.data.message);
                    toast.error("Opps! Something went wrong.");
                  } else {
                    setGeneralErrorMessage(error.response.data.message);
                    toast.error("Opps! Something went wrong.");                      }
              });

          if (response.data.status === "success") {
                toast.success("Thank you for your interest!");
                updateInterestedBloodRequests(requestId);
                fetchMySchedule();
                setOpen(false);
          } else if (response.data.status === "error") {
              if (response.data.message) {
                  setGeneralErrorMessage(response.data.message);
              } else {
                  console.error("Unknown error occurred:", response.data);
              }
          }

      } catch (error) {
          toast.error(error);
          console.error("Unknown error occurred:", error);
      }
  };

    return (
      <>
          <Button color="green" variant="gradient" className="w-1/8 mt-4" onClick={() => setOpen(true)}>
              <span>I'm Interested</span>
          </Button>
          <Dialog open={open} handler={() => setOpen(false)}>
              <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] text-white font-semibold">Confirmation of Interest</DialogHeader>
              {generalErrorMessage && (
            <div className="mt-2 text-center bg-red-100 p-2 rounded-lg">
              <Typography color="red" className="text-sm font-semibold">
                {generalErrorMessage}
              </Typography>
            </div>
          )}
              <DialogBody divider className="flex flex-col gap-4 items-center">
                  <Typography className="text-sm text-blue-gray-500 text-center">
                      Note: By confirming your interest, Red Cross staff may contact you for further details. Your contact information will be used solely for donation coordination. Donating blood is voluntary, free, and not compulsory. We appreciate your willingness to contribute to this life-saving cause.
                  </Typography>
                  <Typography className="font-semibold text-sm text-red-600 text-center">Are you sure you would like to express your interest in donating?</Typography>
              </DialogBody>
              
              <DialogFooter className="flex justify-center mt-4">
                  <Button variant="red-cross" onClick={() => setOpen(false)} className="mr-2">
                      No
                  </Button>
                  <Button variant="red-cross" color="red" onClick={handleInterested}>
                      Yes, Confirm Interest
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