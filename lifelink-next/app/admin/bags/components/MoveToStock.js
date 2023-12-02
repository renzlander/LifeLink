import { laravelBaseUrl } from "@/app/variables";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

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

export function MoveToStock({ serial_no, handleOpen, refreshData }) {
  const [open, setOpen] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");

  const handleMovetoStock = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios
        .post(
          `${laravelBaseUrl}/api/add-to-inventory`,
          {
            serial_no,
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
        toast.success("Blood bag added to inventory successfully");
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
      <Tooltip content="Move to Stock" className="w-max">
        <IconButton
          variant="red"
          color="red"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <ArrowsRightLeftIcon className="w-5 h-5 text-white" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Move Blood Bag to Inventory</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <Typography variant="paragraph" className="text-center">
            Move to Inventory: When the blood bag has completed testing and is
            ready for storage, it should be recorded in the inventory under the
            'Stocks' tab.
          </Typography>
          <Typography variant="h6" color="red" className="text-center">
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
