import { laravelBaseUrl } from "@/app/variables";
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function MarkAccomodated({ bloodRequestId, fetchBloodRequest }) {
  const [open, setOpen] = React.useState(false);

  const MarkAccomodated = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("./login");
        return;
      }

      const response = await axios.post(
        `${laravelBaseUrl}/api/mark-as-accomodated`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            blood_request_id: bloodRequestId,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Blood request mark as accomodated successfully");
        fetchBloodRequest();
        setOpen(false);
      } else if (response.data.status === "error") {
        if (response.data.message) {
          setGeneralErrorMessage(response.data.message);
          toast.error("Opps! Something went wrong.");
        } else {
          console.error("Unknown error occurred:", response.data);
        }
      }
    } catch (error) {
      toast.error("Opps! Something went wrong.");
      console.error("Error fetching user information:", error);
    }
  };

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <IconButton
        color="green"
        variant="gradient"
        className="rounded-l-none"
        onClick={handleOpen}
      >
        <CheckIcon className="h-5 w-5" />
      </IconButton>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Mark as Accomodated</DialogHeader>
        <DialogBody>
          Are you sure you want to mark this request as accomodated?
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
          <Button variant="gradient" color="green" onClick={MarkAccomodated}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export function MarkDeclined({ bloodRequestId, fetchBloodRequest }) {
  const [open, setOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const handleOpen = () => setOpen(!open);

  const MarkDeclined = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("./login");
        return;
      }

      const response = await axios.post(
        `${laravelBaseUrl}/api/mark-as-referred`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            blood_request_id: bloodRequestId,
            remarks: remarks,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Blood request marked as referred successfully");
        fetchBloodRequest();
        setOpen(false);
      } else if (response.data.status === "error") {
        if (response.data.message) {
          setGeneralErrorMessage(response.data.message);
          toast.error("Oops! Something went wrong.");
        } else {
          console.error("Unknown error occurred:", response.data);
        }
      }
    } catch (error) {
      toast.error("Oops! Something went wrong.");
      console.error("Error fetching user information:", error);
    }
  };

  return (
    <>
      <IconButton
        color="red"
        variant="gradient"
        className="rounded-l-none"
        onClick={handleOpen}
      >
        <XMarkIcon className="h-5 w-5" />
      </IconButton>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Marks as Referred</DialogHeader>
        <DialogBody className="flex flex-col gap-4 p-4">
          <Textarea
            label="Remarks"
            className="w-full border border-black rounded-md p-2 resize-none"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <Typography variant="small" color="blue-gray">
            Are you sure you want to mark this request as declined?
          </Typography>
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
          <Button variant="gradient" color="green" onClick={MarkDeclined}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export function EditPost({ bloodRequestId, refreshData, post }) {
  const [open, setOpen] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [requestIdNumber, setRequestIdNumber] = useState("");
  const [venue, setVenue] = useState("");
  const [donationDate, setDonationDate] = useState("");
  const [donationTime, setDonationTime] = useState("");
  const [body, setBody] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [requestIdOptions, setRequestIdOptions] = useState([]);
  const router = useRouter(); // Replace with your router logic
  const handleOpen = () => setOpen(!open);

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
    setDonationDate(format(new Date(e.target.value), "yyyy-MM-dd"));
  };

  const handleTimeChange = (e) => {
    setDonationTime(e.target.value);
  };

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

      const response = await axios.post(
        `${laravelBaseUrl}/api/edit-created-posts`,
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

      if (response.data.status === "success") {
        toast.success("Post updated successfully");
        refreshData();
        setOpen(false);
      } else if (response.data.status === "error") {
        setGeneralErrorMessage(response.data.message);
        toast.error("Oops! Something went wrong.");
      }
    } catch (error) {
      toast.error("Oops! Something went wrong.");
      setGeneralErrorMessage(error.response?.data?.message || "Unknown error");
      console.error("Error editing post:", error);
    }
  };

  const handleRequestIdChange = (selectedValue) => {
    setRequestIdNumber(selectedValue);
  };

  const handleBloodChange = (selectedBlood) => {
    setBloodType(selectedBlood);
  };

  // If post is an array, use the first element; otherwise, use the object directly
  const currentPost = Array.isArray(post)
    ? post[0]
    : post || {};

  // Set initial values based on the current post
  useEffect(() => {
    setRequestIdNumber(currentPost.blood_request_id || "");
    setVenue(currentPost.venue || "");
    setDonationDate(currentPost.donation_date?.split(" ")[0] || "");
    setDonationTime(currentPost.donation_date?.split(" ")[1] || "");
    setBody(currentPost.body || "");
    setBloodType(currentPost.blood_needs || "");
  }, [currentPost]);

  return (
    <>
      <IconButton
        color="gray"
        variant="gradient"
        className="rounded-l-none"
        onClick={handleOpen}
      >
        <PencilIcon className="h-5 w-5" />
      </IconButton>
      <Dialog size="lg" open={open} handler={handleOpen}>
        <DialogHeader>Edit Post</DialogHeader>
        {generalErrorMessage && (
          <div className="mt-2 text-center bg-red-100 p-2 rounded-lg">
            <Typography color="red" className="text-sm font-semibold">
              {generalErrorMessage}
            </Typography>
          </div>
        )}
        <DialogBody className="flex flex-col gap-5">
          <Input
            label="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
          <div className="flex md:flex-nowrap flex-wrap items-center justify-between w-full gap-3">
            <Input
              label="Date"
              type="date"
              value={donationDate}
              onChange={handleDateChange}
              min={format(new Date(), "yyyy-MM-dd")}
            />
            <Input
              label="Time"
              type="time"
              value={donationTime}
              onChange={handleTimeChange}
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
            value={body}
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
            <span>Edit Post</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export function DeletePost({ bloodRequestId, refreshData }) {
  const [open, setOpen] = React.useState(false);
  const handleDelete = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("./login");
        return;
      }

      const response = await axios.post(
        `${laravelBaseUrl}/api/delete-created-posts`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            blood_request_id: bloodRequestId,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Blood request mark as deleted successfully");
        refreshData();
        setOpen(false);
      } else if (response.data.status === "error") {
        if (response.data.message) {
          setGeneralErrorMessage(response.data.message);
          toast.error("Opps! Something went wrong.");
        } else {
          console.error("Unknown error occurred:", response.data);
        }
      }
    } catch (error) {
      toast.error("Opps! Something went wrong.");
      console.error("Error fetching user information:", error);
    }
  };

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <IconButton
        color="red"
        variant="gradient"
        className="rounded-l-none"
        onClick={handleOpen}
      >
        <TrashIcon className="h-5 w-5" />
      </IconButton>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Delete Post</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this post?
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
          <Button variant="gradient" color="green" onClick={handleDelete}>
            <span>Confirm</span>
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
