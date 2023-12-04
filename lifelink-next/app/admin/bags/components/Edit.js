import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Spinner,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  let firstPart = "";
  let secondPart = "";
  let thirdPart = "";
  if (serialFormat) {
    firstPart = serialFormat[1];
    secondPart = serialFormat[2];
    thirdPart = serialFormat[3];
  }
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
      setIsSubmitting(true);
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
        window.location.reload();
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
    } finally {
      setIsSubmitting(false);
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
        <DialogHeader>Edit Blood Bag</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-4">
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
            <Typography variant="h6" color="blue-gray">
              Serial Number: {user.serial_no}
            </Typography>
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
            className="mr-1"
            onClick={() => setOpen(false)}
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="red"
            className="flex items-center justify-center gap-5"
            onClick={handleEditSerialNumber}
            disabled={countdownEnd < new Date() || isSubmitting}
          >
            {isSubmitting ? <Spinner className="h-4 w-4" /> : ""}
            Done
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
