import { laravelBaseUrl } from "@/app/variables";
import { BeakerIcon } from "@heroicons/react/24/outline";

import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export function ReferToLab({ bloodBagId, user, refreshData }) {
  const [open, setOpen] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");

  const handleReferToLab = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios
        .post(
          `${laravelBaseUrl}/api/refer-to-laboratory`,
          {
            blood_bags_id: bloodBagId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((error) => {
          console.error("Unknown error occurred:", error);
        });

      if (response.data.status === "success") {
        refreshData();
        window.location.reload();
        toast.success("Blood bag refered to laboratory successfully");
      } else if (response.data.status === "error") {
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
      <Tooltip content="Refer to Lab" className="w-max">
        <IconButton
          variant="red"
          color="red"
          size="sm"
          onClick={() => setOpen(true)}
          disabled={user.isTested === 1}
        >
          <BeakerIcon className="w-5 h-5 text-white" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Mark as Referred to Lab</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <Typography className="text-base text-gray-700 text-center">
            The 'Refer to Laboratory' option indicates that this blood bag has
            been sent to the laboratory for the testing phase. Please be aware
            that this action is irreversible.
          </Typography>
          <Typography className="text-base text-gray-700 text-center">
            Are you sure you want to mark this as a referred blood bag to the
            laboratory?
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
          <Button variant="red-cross" color="red" onClick={handleReferToLab}>
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
