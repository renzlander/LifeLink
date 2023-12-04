import { laravelBaseUrl } from "@/app/variables";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Tooltip,
  Spinner,
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

export function RemoveBlood({
  serial_no,
  countdownEndDate,
  handleOpen,
  countdown,
  refreshData,
}) {
  const [open, setOpen] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedEndDate = countdownEndDate; // Replace with your actual date string
  const countdownEnd = new Date(formattedEndDate);

  const router = useRouter();

  const handleRemoveBloodBag = async () => {
    try {
      setIsSubmitting(true);
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

      if (response.data.status === "success") {
        refreshData();
        toast.success("Removed blood bag successfully");
        window.location.reload();

        setOpen(false);
      } else {
        console.error("Error removing blood bag:", response.data.message);
      }
    } catch (error) {
      console.error("Error removing blood bag:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Tooltip content="Undo">
        <IconButton
          variant="red"
          color="red"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <ArrowUturnLeftIcon className="w-5 h-5 text-white" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Blood Bag Removal Confirmation</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <Typography className="text-base text-gray-700 text-center">
            The 'Undo' option allows you to remove a blood bag that you
            previously added. Please be aware that this option has a time limit.
            Once the time has elapsed, you won't be able to reverse this action.
          </Typography>
          <Typography className="text-base text-gray-700 text-center">
            Are you certain you want to proceed with the removal of this blood
            bag?
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
        <DialogFooter className="flex justify-center">
          <Button
            variant="filled"
            onClick={() => setOpen(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            className="flex items-center justify-center gap-5"
            onClick={handleRemoveBloodBag}
            disabled={countdownEnd < new Date() || isSubmitting}
          >
            {isSubmitting ? <Spinner className="h-4 w-4" /> : ""}
            Confirm Removal
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
