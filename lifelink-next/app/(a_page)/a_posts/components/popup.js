import React from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

export function MarkAccomodated({bloodRequestId, fetchBloodRequest}) {
  const [open, setOpen] = React.useState(false);

  const MarkAccomodated = async () => {
    try {
        const token = getCookie("token");
        if (!token) {
            router.push("./login");
            return;
        }

        const response = await axios.post(
            `${laravelBaseUrl}/api/mark-as-accomodated`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    blood_request_id: bloodRequestId,
                },
            }
        );

        if (response.data.status === "success") {
            toast.success("Blood request mark as accomodated successfully");
            fetchBloodRequest();
            setOpen(false);
        } else if (response.data.status === "error") {
            if (response.data.message) {
                setGeneralErrorMessage(response.data.message);
                toast.error("Opps! Something went wrong.");
            } else {
                console.error("Unknown error occurred:", response.data);
            }
        }
    } catch (error) {
        toast.error("Opps! Something went wrong.");
        console.error("Error fetching user information:", error);
    }
};
 
  const handleOpen = () => setOpen(!open);
 
  return (
    <>
      <IconButton color="green" variant="gradient" className="rounded-l-none" onClick={handleOpen}>
        <CheckIcon className="h-5 w-5" />
      </IconButton>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Mark as Accomodated</DialogHeader>
        <DialogBody>
          Are you sure you want to mark this request as accomodated? 
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={MarkAccomodated}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export function MarkDeclined({bloodRequestId, fetchBloodRequest}) {
  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);
  const MarkDeclined = async () => {
    try {
          const token = getCookie("token");
          if (!token) {
              router.push("./login");
              return;
          }

          const response = await axios.post(
              `${laravelBaseUrl}/api/mark-as-declined`,
              {},
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
                  params: {
                      blood_request_id: bloodRequestId,
                  },
              }
          );

          if (response.data.status === "success") {
              toast.success("Blood request mark as declined successfully");
              fetchBloodRequest();
              setOpen(false);
          } else if (response.data.status === "error") {
              if (response.data.message) {
                  setGeneralErrorMessage(response.data.message);
                  toast.error("Opps! Something went wrong.");
              } else {
                  console.error("Unknown error occurred:", response.data);
              }
          }
      } catch (error) {
          toast.error("Opps! Something went wrong.");
          console.error("Error fetching user information:", error);
      }
  };
  
  return (
    <>
      <IconButton color="red" variant="gradient" className="rounded-l-none" onClick={handleOpen}>
        <XMarkIcon className="h-5 w-5" />
      </IconButton>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Marks as Declined</DialogHeader>
        <DialogBody>
          Are you sure you want to mark this request as declined?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={MarkDeclined}>
            <span>Confirm</span>
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
