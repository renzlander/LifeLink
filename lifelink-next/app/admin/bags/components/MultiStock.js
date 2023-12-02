import { laravelBaseUrl } from "@/app/variables";

import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function MultipleMoveToStock({ selectedRows, refreshData }) {
  const [open, setOpen] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const router = useRouter();
  console.log("dada", selectedRows);
  const handleDisposeBloodBag = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      if (!Array.isArray(selectedRows)) {
        serial_no = [selectedRows]; // Convert to array
      }

      const response = await axios
        .post(
          `${laravelBaseUrl}/api/bulk-move-to-inventory`,
          {
            blood_bags_id: selectedRows,
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
        setOpen(false);
      } else {
        console.error("Error removing blood bag:", response.data.message);
      }
    } catch (error) {
      console.error("Error removing blood bag:", error);
    }
  };

  return (
    <>
      <Button
        variant="gradient"
        color="red"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Move to Stock
      </Button>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Move to Stocks</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <Typography variant="h5" color="red" className="text-center">
            Are you sure you want to move all of this blood bag to stocks?
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
          <Button
            variant="red-cross"
            color="red"
            onClick={handleDisposeBloodBag}
          >
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
