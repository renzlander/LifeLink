import { laravelBaseUrl } from "@/app/variables";
import { TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function Disposed({ blood_bags_id, refreshData }) {
  const [open, setOpen] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const router = useRouter();


  const handleDisposeBloodBag = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      if (!Array.isArray(blood_bags_id)) {
        blood_bags_id = [blood_bags_id]; // Convert to array
      }

      const response = await axios
        .post(
          `${laravelBaseUrl}/api/dispose-blood`,
          {
            blood_bags_id: blood_bags_id,
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
        toast.success("Removed blood bag successfully");
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
      <IconButton
        variant="gradient"
        color="red"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <TrashIcon className="w-5 h-5 text-white" />
      </IconButton>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>
          Dispose Blood Bag
        </DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />
          <Typography variant="h5" color="red" className="text-center">
            Are you sure you want to disposed this blood bag?
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