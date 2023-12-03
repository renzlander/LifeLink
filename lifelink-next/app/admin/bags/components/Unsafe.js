import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Radio,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export function Unsafe({
  serial_no,
  handleOpen,
  reactiveOptions,
  spoiledOptions,
  refreshData,
}) {
  const [open, setOpen] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [reason, setReason] = useState(null); // To store the selected reason (Reactive or Spoiled)
  const [remarks, setRemarks] = useState(""); // To store the selected remarks

  const reactiveDynamicOptions = reactiveOptions.map((item) => ({
    label: item.reactive_remarks_desc,
    value: item.reactive_remarks_id,
  }));

  const spoiledDynamicOptions = spoiledOptions.map((item) => ({
    label: item.spoiled_remarks_desc,
    value: item.spoiled_remarks_id,
  }));

  const handleRemarks = (selectedValue) => {
    setRemarks(selectedValue);
  };

  const handUnsafeBags = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.post(
        `${laravelBaseUrl}/api/mark-unsafe`,
        {
          serial_no: serial_no,
          reason: reason,
          remarks: remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        console.log("yehey successss");
        refreshData();
        toast.success("Marked as unsafe successfully");
        window.location.reload();
      } else {
        console.error("Oops! Something went wrong.");
      }
      setOpen(false);
    } catch (error) {
      console.error("Error fetching bled_by and venues lists:", error);
    }
  };

  return (
    <>
      <Tooltip content="Mark as Unsafe" className="w-max">
        <IconButton
          variant="red"
          color="red"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <ExclamationTriangleIcon className="w-5 h-5 text-white" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader className="border-b-2">Mark as Unsafe</DialogHeader>
        <DialogBody className="flex flex-col gap-4 items-center text-center">
          <Typography
            variant="paragraph"
            color="gray"
            className="text-lg text-center"
          >
            Select a reason:
          </Typography>
          <div className="flex flex-col items-start gap-2">
            <Radio
              name="reason"
              label="Reactive"
              value="Spoiled"
              checked={reason === "Reactive"}
              onChange={() => setReason("Reactive")}
            />
            <Radio
              name="reason"
              label="Spoiled"
              value="Spoiled"
              checked={reason === "Spoiled"}
              onChange={() => setReason("Spoiled")}
            />
          </div>
          {reason && (
            <Typography
              variant="paragraph"
              color="gray"
              className="text-center"
            >
              Select remarks for {reason}:
            </Typography>
          )}
          {reason === "Reactive" && (
            <InputSelect
              label="Reactive Remarks"
              containerProps={{ className: "w-[50%]" }}
              value={remarks}
              onSelect={handleRemarks}
              options={reactiveDynamicOptions}
              isSearchable
              required
              placeholder="Reactive Remarks"
            />
          )}
          {reason === "Spoiled" && (
            <InputSelect
              label="Spoiled Remarks"
              containerProps={{ className: "w-[50%]" }}
              value={remarks}
              onSelect={handleRemarks}
              options={spoiledDynamicOptions}
              isSearchable
              required
              placeholder="Spoiled Remarks"
            />
          )}
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
            disabled={!reason || !remarks}
            onClick={handUnsafeBags}
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
