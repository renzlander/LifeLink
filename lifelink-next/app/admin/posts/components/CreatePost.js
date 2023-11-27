import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function CreatePost() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [requestIdNumber, setRequestIdNumber] = useState("");
  const [venue, setVenue] = useState("");
  const [donationDate, setDonationDate] = useState("");
  const [donationTime, setDonationTime] = useState("");
  const [body, setBody] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [requestIdOptions, setRequestIdOptions] = useState([]);

  const bloodTypesOptions = [
    "All",
    "AB+",
    "AB-",
    "A+",
    "A-",
    "B+",
    "B-",
    "O+",
    "O-",
  ];

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  const handleDateChange = (e) => {
    // Assuming e.target.value is in the format YYYY-MM-DD
    setDonationDate(format(new Date(e.target.value), "yyyy-MM-dd"));
  };

  const handleTimeChange = (e) => {
    setDonationTime(e.target.value);
  };

  useEffect(() => {
    const fetchAllRequestIds = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("./login");
          return;
        }

        const response = await axios.get(
          `${laravelBaseUrl}/api/get-request-id`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRequestIdOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchAllRequestIds();
  }, []);

  const createPost = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("./login");
        return;
      }

      const formattedDonationDateTime = format(
        new Date(`${donationDate} ${donationTime}`),
        "yyyy-MM-dd HH:mm:ss"
      );
      console.log(formattedDonationDateTime);

      const response = await axios.post(
        `${laravelBaseUrl}/api/create-network-post`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            blood_request_id: requestIdNumber,
            venue: venue,
            donation_date: formattedDonationDateTime,
            body: body,
            blood_needs: bloodType,
          },
        }
      );

      console.log(response);
      if (response.data.status === "success") {
        toast.success("Post created successfully");
        setOpen(false);
      } else if (response.data.status === "error") {
        setGeneralErrorMessage(response.data.message);
        console.log(response);
        toast.error("Opps! Something went wrong.");
      }
    } catch (error) {
      toast.error("Opps! Something went wrong.");
      setGeneralErrorMessage(error.response.data.message);
      console.error("Error fetching user information:", error);
    }
  };

  const dynamicRequestIdOptions = requestIdOptions.map((item) => ({
    label: item.request_id_number.toString(),
    value: item.blood_request_id.toString(),
  }));

  const handleRequestIdChange = (selectedValue) => {
    setRequestIdNumber(selectedValue);
  };

  const handleBloodChange = (selectedBlood) => {
    setBloodType(selectedBlood);
  };

  return (
    <>
      <Button onClick={handleOpen} variant="gradient" className="rounded-full">
        Create Post
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Create Post</DialogHeader>
        {generalErrorMessage && (
          <div className="mt-2 text-center bg-red-100 p-2 rounded-lg">
            <Typography color="red" className="text-sm font-semibold">
              {generalErrorMessage}
            </Typography>
          </div>
        )}
        <DialogBody className="grid gap-5">
          <InputSelect
            label="Blood Request ID"
            value={requestIdNumber}
            onSelect={handleRequestIdChange}
            options={dynamicRequestIdOptions}
            isSearchable
            required
            placeholder="Hospital"
          />

          <Input label="Venue" onChange={(e) => setVenue(e.target.value)} />

          <div className="flex md:flex-nowrap flex-wrap items-center justify-between w-full gap-3">
            <Input
              label="Date"
              type="date"
              onChange={handleDateChange}
              value={donationDate}
              min={format(new Date(), "yyyy-MM-dd")} // Set the minimum date to the current date
            />

            <Input
              label="Time"
              type="time"
              onChange={handleTimeChange}
              value={donationTime}
            />

            <Select
              onChange={handleBloodChange}
              label="Blood Type"
              value={bloodType}
            >
              {bloodTypesOptions.map((blood) => (
                <Option key={blood} value={blood}>
                  {blood}
                </Option>
              ))}
            </Select>
          </div>

          <Textarea
            size="lg"
            label="Description"
            onChange={handleBodyChange}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="blue" onClick={createPost}>
            <span>Publish Post</span>
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
