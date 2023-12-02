import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import { PencilIcon } from "@heroicons/react/24/solid";
import { 
  ArrowUturnLeftIcon,
  ArrowsRightLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import {
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Tooltip,
  Typography,
  Radio,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  const formattedEndDate = countdownEndDate; // Replace with your actual date string
  const countdownEnd = new Date(formattedEndDate);

  const router = useRouter();

  const handleRemoveBloodBag = async () => {
    try {
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
      <Tooltip content="Undo">
        <IconButton variant="red" color="red" size="sm" onClick={() => setOpen(true)}>
          <ArrowUturnLeftIcon className="w-5 h-5 text-white" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>
          Blood Bag Removal Confirmation
        </DialogHeader>
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
        <DialogFooter className="flex justify-center mt-4">
          <Button
            variant="filled"
            size="sm"
            onClick={() => setOpen(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            size="sm"
            onClick={handleRemoveBloodBag}
            disabled={countdownEnd < new Date()}
          >
            Confirm Removal
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export function EditPopUp({
  bledByOptions,
  venueOptions,
  user,
  countdown,
  countdownEndDate,
  refreshData,
}) {
  const [errorMessage, setErrorMessage] = useState({
    serial_no: [],
    date_donated: [],
    bled_by: [],
    venue: [],
  });

  console.log("Segi", user);

  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [bledBy, setBledBy] = useState(user.bled_by);
  const [venue, setVenue] = useState(user.venue);
  const [dateDonated, setDateDonated] = useState(user.date_donated);
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [part3, setPart3] = useState("");
  const srNumber = `${part1}-${part2}-${part3}`;
  const serialNo = user.serial_no;
  const serialNoWithoutHyphens = serialNo.replace(/-/g, "");
  const serialFormat = serialNoWithoutHyphens.match(/^(\d{4})(\d{6})(\d{1})$/);
  const formattedEndDate = countdownEndDate; // Replace with your actual date string
  const countdownEnd = new Date(formattedEndDate);
  let firstPart = "";
  let secondPart = "";
  let thirdPart = "";
  if (serialFormat) {
    firstPart = serialFormat[1];
    secondPart = serialFormat[2];
    thirdPart = serialFormat[3];
  }
  // console.log("serialFormat[1]", firstPart);
  useEffect(() => {
    if (user.serial_no) {
      const serialFormat = serialNoWithoutHyphens.match(
        /^(\d{4})(\d{6})(\d{1})$/
      );
      if (serialFormat) {
        setPart1(serialFormat[1]);
        setPart2(serialFormat[2]);
        setPart3(serialFormat[3]);
      }
    }
  }, [user.serial_no]);
  
  const validateSerialNumber = () => {
    let valid = true;
    const errors = {
      serial_no: [],
      date_donated: [],
      bled_by: [],
      venue: [],
      donationType: [],
    };

    if (part1.length !== 4) {
      errors.serial_no.push("All fields for serial numbers must be complete.");
      valid = false;
    }

    if (part2.length !== 6) {
      errors.serial_no.push("All fields for serial numbers must be complete.");
      valid = false;
    }

    if (part3.length !== 1) {
      errors.serial_no.push("All fields for serial numbers must be complete.");
      valid = false;
    }

    setErrorMessage(errors);

    return valid;
  };

  const dynamicBledByOptions = bledByOptions.map((item) => ({
    label: item.full_name,
    value: item.bled_by_id.toString(),
}));

  const dynamicVenueOptions = venueOptions.map((item) => ({
    label: item.venues_desc,
    value: item.venues_id.toString(),
  }));

  const handleEditSerialNumber = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const isSerialNumberValid = validateSerialNumber();
      if (!isSerialNumberValid) {
        return; // Stop execution if serial number is not valid
      }
      const data = {
        blood_bags_id: user.blood_bags_id,
        serial_no: srNumber,
        venue: venue,
        date_donated: dateDonated,
        bled_by: bledBy,
      };

      const response = await axios
        .put(`${laravelBaseUrl}/api/edit-bloodbag`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => {
          toast.error("Opps! Something went wrong");
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            const { errors } = error.response.data;
            const serialNumberError = errors.serial_no || [];
            const dateError = errors.date_donated || [];
            const bledByError = errors.bled_by || [];
            const venueError = errors.venue || [];
            setErrorMessage({
              serial_no: serialNumberError,
              date_donated: dateError,
              bled_by: bledByError,
              venue: venueError,
            });
          } else {
            setGeneralErrorMessage(error.response.data.message);
            setErrorMessage({
              serial_no: [],
              date_donated: [],
              bled_by: [],
              venue: [],
            });
          }
        });

      if (response.data.status === "success") {
        toast.success("Blood bag updated successfully");
        setOpen(false);
        refreshData();
      } else if (response.data.status === "error") {
        if (response.data.message) {
          toast.error(response.data.message);
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

  const handleBledBySelect = (selectedValue) => {
    setBledBy(selectedValue);
  };

  const handleVenueSelect = (selectedValue) => {
    setVenue(selectedValue);
  };

  return (
    <>
      <Tooltip content="Edit Serial Number" className="w-max">
        <IconButton
          variant="text"
          onClick={() => setOpen(true)}
          disabled={countdownEnd < new Date()}
        >
          <PencilIcon className="h-4 w-4" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] rounded-t-md text-white font-semibold">
          <div>Edit Blood Bag</div>
        </DialogHeader>
        <DialogBody divider className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-3">
            <Typography variant="h4" className="text-gray-800">
              Serial Number:{" "}
              <span className="text-red-600">{user.serial_no}</span>
            </Typography>
            <Chip
              size="sm"
              value={
                countdown === 0
                  ? "Editing is not available at the moment."
                  : `This blood bag can be edited until  ${formatDate(
                      countdownEndDate
                    )}`
              }
            />
          </div>
          <div>
            <div className={`relative flex gap-3 items-center`}>
              <Input
                label="XXXX"
                maxLength={4}
                value={part1}
                disabled={countdown === 0}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[0-9]*$/.test(newValue)) {
                    return;
                  }
                  setPart1(newValue);
                }}
                containerProps={{ className: "min-w-[75px]" }}
              />

              <Typography>-</Typography>
              <Input
                label="XXXXXX"
                maxLength={6}
                value={part2}
                disabled={countdown === 0}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[0-9]*$/.test(newValue)) {
                    return;
                  }
                  setPart2(newValue);
                }}
                containerProps={{ className: "min-w-[100px]" }}
              />
              <Typography>-</Typography>
              <Input
                label="X"
                maxLength={1}
                value={part3}
                disabled={countdown === 0}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[0-9]*$/.test(newValue)) {
                    return;
                  }
                  setPart3(newValue);
                }}
                containerProps={{ className: "min-w-[25px]" }}
              />
            </div>
            {errorMessage.serial_no && (
              <div className="error-message text-red-600 text-sm mt-1">
                {errorMessage.serial_no}
              </div>
            )}
          </div>
          <div className={`relative ${errorMessage.bled_by ? "mb-1" : ""}`}>
            {/* <Input
              label="Bled by"
              value={bledBy}
              disabled={countdown === 0}
              onChange={(e) => setBledBy(e.target.value)}
            /> */}
            <InputSelect
              label="Bled by"
              value={bledBy}
              onSelect={handleBledBySelect}
              options={dynamicBledByOptions}
              isSearchable
              required
              placeholder="Bled By"
            />
            {errorMessage.bled_by && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.bled_by}
              </div>
            )}
          </div>
          <div className={`relative ${errorMessage.venue ? "mb-1" : ""}`}>
            <InputSelect
              label="Venue"
              value={venue}
              onSelect={handleVenueSelect}
              options={dynamicVenueOptions}
              isSearchable
              required
              placeholder="Venue"
            />
            {errorMessage.venue && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.venue}
              </div>
            )}
          </div>
          <div
            className={`relative ${errorMessage.date_donated ? "mb-1" : ""}`}
          >
            <Input
              type="date"
              label="Date"
              value={dateDonated}
              disabled={countdown === 0}
              onChange={(e) => setDateDonated(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
            {errorMessage.date_donated && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.date_donated}
              </div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            onClick={() => setOpen(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={handleEditSerialNumber}
            disabled={countdownEnd < new Date()}
          >
            <span>Done</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

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
        <IconButton variant="red" color="red" size="sm" onClick={() => setOpen(true)}>
          <ArrowsRightLeftIcon className="w-5 h-5 text-white" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>
          Move Blood Bag to Inventory
        </DialogHeader>
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
      <Button variant="gradient" color="red" size="sm" onClick={() => setOpen(true)}>
        Move to Stock
      </Button>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>
          Move to Stocks
        </DialogHeader>
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
        <IconButton variant="red" color="red" size="sm" onClick={() => setOpen(true)}>
          <ExclamationTriangleIcon className="w-5 h-5 text-white" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader className="border-b-2">
          Mark as Unsafe
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4 items-center text-center">
          <Typography variant="paragraph" color="gray" className="text-lg text-center">
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
            <Typography variant="paragraph" color="gray" className="text-center">
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
