import { laravelBaseUrl } from "@/app/variables";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { Typography } from "@mui/material";
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

export function Revert({ serial_no, refreshData }) {
  const [open, setOpen] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const router = useRouter();

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
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        color="red"
        variant="gradient"
      >
        Undo
      </Button>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] text-white font-semibold">
          Remove Blood Bag
        </DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <Typography className="font-bold text-xl text-red-600 text-center">
            Are you sure you want to return it to collected?
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
          >
            Yes
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

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
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="bg-red-600 mr-4"
      >
        Dispose
      </Button>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] text-white font-semibold">
          Dispose Blood Bag
        </DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <Typography className="font-bold text-xl text-red-600 text-center">
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

export function MultipleDisposed({ selectedRows, refreshData }) {
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

      if (!Array.isArray(selectedRows)) {
        blood_bags_id = [selectedRows]; // Convert to array
      }

      const response = await axios
        .post(
          `${laravelBaseUrl}/api/dispose-blood`,
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
      <Button
        variant="contained"
        color="red"
        size="sm"
        className="ml-4"
        onClick={() => setOpen(true)}
      >
        Dispose
      </Button>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] text-white font-semibold">
          Dispose Blood Bag
        </DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 items-center">
          <Typography className="font-bold text-xl text-red-600 text-center">
            Are you sure you want to disposed all of this blood bag?
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
