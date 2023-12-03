import { laravelBaseUrl } from "@/app/variables";
import { ArrowUturnLeftIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

export function Revert({ serial_no, refreshData, countdownEndDate }) {
  const [open, setOpen] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const router = useRouter();

  const formattedEndDate = countdownEndDate; // Replace with your actual date string
  const countdownEnd = new Date(formattedEndDate);

  const handleRemoveBloodBag = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Construct the URL with serial_no as a query parameter
      const apiUrl = `${laravelBaseUrl}/api/move-back-to-collected?serial_no=${serial_no}`;

      // Send a POST request to the constructed URL
      const response = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        refreshData();
        toast.success("Return blood bag to collected successfully");
        setOpen(false);
      } else {
        // Handle error case when the API returns an error status
        setGeneralErrorMessage(response.data.message);
      }
    } catch (error) {
      // Handle any other errors, such as network issues or exceptions
      console.error("Error removing blood bag:", error);
      setGeneralErrorMessage("An error occurred while removing the blood bag.");
    }
  };

  return (
    <>
      <Tooltip content="Undo">
        <IconButton
          variant="gradient"
          color="red"
          size="sm"
          disabled={countdownEnd < new Date()}
          onClick={() => setOpen(true)}
        >
          <ArrowUturnLeftIcon className="w-5 h-5 text-white" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>
          Remove Blood Bag
        </DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />
          <Typography variant="h5" color="red" className="text-center">
            Are you sure you want to return it to collected?
          </Typography>
          <Typography className="text-sm text-gray-700 text-center">
            The removal of this blood bag is allowed until{" "}
            <span className="font-bold">{formatDate(countdownEndDate)}</span>.
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
            onClick={handleRemoveBloodBag}
            disabled={countdownEnd < new Date()}
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
