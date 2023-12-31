import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import { PlusIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Option,
  Select,
  Spinner,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function AddBloodBagPopup({
  user_id,
  bledByOptions,
  venueOptions,
  refreshData,
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [bledBy, setBledBy] = useState("");
  const [venue, setVenue] = useState("");
  const [donationType, setDonationType] = useState();
  const [dateDonated, setDateDonated] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    serial_no: [],
    date_donated: [],
    bled_by: [],
    venue: [],
    donationType: [],
  });
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [part3, setPart3] = useState("");
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const srNumber = `${part1}-${part2}-${part3}`;
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleBledBySelect = (selectedValue) => {
    setBledBy(selectedValue);
  };

  const handleVenueSelect = (selectedValue) => {
    setVenue(selectedValue);
  };

  const handleDonationTypeSelect = (selectedValue) => {
    setDonationType(selectedValue);
  };

  const dynamicBledByOptions = bledByOptions.map((item) => ({
    label: item.full_name,
    value: item.bled_by_id.toString(),
  }));

  const dynamicVenueOptions = venueOptions.map((item) => ({
    label: item.venues_desc,
    value: item.venues_id.toString(),
  }));

  const donationTypeOptions = [
    { label: "Voluntary Blood Donation", value: "1" },
    { label: "Direct Patient Blood Donation", value: "2" },
  ];

  const handleAddBloodBag = async () => {
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
      // Prepare data for the POST request
      const data = {
        user_id,
        serial_no: srNumber,
        bled_by: bledBy,
        venue: venue,
        date_donated: dateDonated,
        donation_type: donationType,
      };

      // Send POST request to add-bloodbag API
      const response = await axios
        .post(`${laravelBaseUrl}/api/add-bloodbag`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => {
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
            const donationTypeError = errors.donation_type || [];
            setErrorMessage({
              serial_no: serialNumberError,
              date_donated: dateError,
              bled_by: bledByError,
              venue: venueError,
              donationType: donationTypeError,
            });
          } else {
            setGeneralErrorMessage(error.response.data.message);
            toast.error("Opps! Something went wrong.");
            setErrorMessage({
              serial_no: [],
              date_donated: [],
              bled_by: [],
              venue: [],
              donationType: [],
            });
          }
        });

      if (response.data.status === "success") {
        toast.success("Blood bag added successfully");
        refreshData();
        setOpen(false);
      } else if (response.data.status === "error") {
        if (response.data.message) {
          setGeneralErrorMessage(response.data.message);
          toast.error("Opps! Something went wrong.");
        } else {
        }
      }
      // Close the dialog
      setOpen(false);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (part1.length === 4 && inputRef2.current) {
      inputRef2.current.focus();
    }
  }, [part1]);

  useEffect(() => {
    if (part2.length === 6 && inputRef3.current) {
      inputRef3.current.focus();
    }
  }, [part2]);

  return (
    <>
      <Tooltip content="Add Blood Bag">
        <IconButton
          size="sm"
          onClick={() => setOpen(true)}
          variant="gradient"
          color="red"
        >
          <PlusIcon className="h-5 w-5" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Add Blood Bag</DialogHeader>
        {generalErrorMessage && (
          <div className="mt-4 text-center bg-red-100 p-2 rounded-lg">
            <Typography color="red" className="text-sm font-semibold">
              {generalErrorMessage}
            </Typography>
          </div>
        )}
        <DialogBody divider className="flex flex-col gap-6">
          <div>
            <Typography variant="h6" color="blue-gray" className="text-md mb-2">
              Serial Number: {srNumber}
            </Typography>
            <div className="relative flex gap-3 items-center">
              <Input
                label="XXXX"
                maxLength={4}
                value={part1}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[0-9]*$/.test(newValue)) {
                    return;
                  }
                  setPart1(newValue);
                }}
                containerProps={{ className: "min-w-[75px]" }}
                inputRef={inputRef1}
              />
              <Typography>-</Typography>
              <Input
                label="XXXXXX"
                maxLength={6}
                value={part2}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[0-9]*$/.test(newValue)) {
                    return;
                  }
                  setPart2(newValue);
                }}
                containerProps={{ className: "min-w-[100px]" }}
                inputRef={inputRef2}
              />
              <Typography>-</Typography>
              <Input
                label="X"
                maxLength={1}
                value={part3}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[0-9]*$/.test(newValue)) {
                    return;
                  }
                  setPart3(newValue);
                }}
                containerProps={{ className: "min-w-[25px]" }}
                inputRef={inputRef3}
              />
            </div>
            {errorMessage.serial_no.length > 0 && (
              <div className="error-message text-red-600 text-sm mt-1">
                {errorMessage.serial_no[0]}
              </div>
            )}
          </div>

          <div
            className={`relative ${
              errorMessage.bled_by.length > 0 ? "mb-1" : ""
            }`}
          >
            <InputSelect
              label="Bled by"
              value={bledBy}
              onSelect={handleBledBySelect}
              options={dynamicBledByOptions}
              isSearchable
              required
              placeholder="Bled By"
            />
            {errorMessage.bled_by.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.bled_by[0]}
              </div>
            )}
          </div>

          <div
            className={`relative ${
              errorMessage.venue.length > 0 ? "mb-1" : ""
            }`}
          >
            <InputSelect
              label="Venue"
              value={venue}
              onSelect={handleVenueSelect}
              options={dynamicVenueOptions}
              isSearchable
              required
              placeholder="Venue"
            />
            {errorMessage.venue.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.venue[0]}
              </div>
            )}
          </div>
          <div
            className={`relative ${
              errorMessage.date_donated.length > 0 ? "mb-1" : ""
            }`}
          >
            <Input
              type="date"
              label="Date"
              value={dateDonated}
              onChange={(e) => setDateDonated(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
            {errorMessage.date_donated.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.date_donated[0]}
              </div>
            )}
          </div>
          <div
            className={`relative ${
              errorMessage.donationType.length > 0 ? "mb-1" : ""
            }`}
          >
            <Select
              onChange={handleDonationTypeSelect}
              label="Donation Type"
              value={donationType}
            >
              {donationTypeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            {errorMessage.donationType.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.donationType[0]}
              </div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpen(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="red"
            className="flex items-center justify-center gap-5"
            onClick={handleAddBloodBag}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner className="h-4 w-4" /> : ""}
            Add
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
