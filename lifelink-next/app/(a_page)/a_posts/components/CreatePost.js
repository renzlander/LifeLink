import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import InputSelect from "@/app/components/InputSelect";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { toast } from "react-toastify";

export function CreatePost() {
  const [open, setOpen] = useState(false);
 
  const handleOpen = () => setOpen(!open);
 
  const [requestIdNumber, setRequestIdNumber] = useState("");
  const [venue, setVenue] = useState("");
  const [donationDate, setDonationDate] = useState("");
  const [body, setBody] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [requestIdOptions, setRequestIdOptions] = useState([]);

  const bloodTypesOptions = ["All", "AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

  const handleBodyChange = (e) => {
      setBody(e.target.value);
  };

  const handleDateChange = (date) => {
      setDonationDate(date);
  };

  useEffect(() => {
      const fetchAllRequestIds = async () => {
          try {
              const token = getCookie("token");
              if (!token) {
                  router.push("./login");
                  return;
              }

              const response = await axios.get(`${laravelBaseUrl}/api/get-request-id`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });

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

          const formattedDonationDate = format(donationDate, 'yyyy-MM-dd HH:mm:ss');

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
                      donation_date: formattedDonationDate,
                      body: body,
                      blood_needs: bloodType,
                  },
              }
          );

          if (response.data.status === "success") {
              toast.success("Blood bag added successfully");
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
        <DialogBody className="grid gap-5">
          <InputSelect label="Blood Request ID" 
            value={requestIdNumber} 
            onSelect={handleRequestIdChange} 
            options={dynamicRequestIdOptions} 
            isSearchable 
            required 
            placeholder="Hospital" 
          />
          
          <Input label="Venue" onChange={(e) => setVenue(e.target.value)} />

          <div className="flex md:flex-nowrap flex-wrap items-center justify-between w-full gap-3">
            <Input label="Date" type="date" />

            <Input label="Time" type="time" />

            <Select onChange={handleBloodChange} label="Blood Type" value={bloodType}>
                {bloodTypesOptions.map((blood) => (
                    <Option key={blood} value={blood}>
                        {blood}
                    </Option>
                ))}
            </Select>
          </div>

          <Textarea size="lg" label="Textarea Large" onChange={handleBodyChange} />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
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