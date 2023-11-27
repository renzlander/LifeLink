import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function CreateRequest() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [componentsOptions, setComponentOptions] = useState([]);
  const [unit, setUnit] = useState("");
  const [components, setComponents] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [hospital, setHospital] = useState("");
  const [schedule, setSchedule] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setFieldErrors({});
  };
  const handleClose = () => {
    setOpen(false);
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.post(
        `${laravelBaseUrl}/api/request-blood`,
        {
          blood_units: unit,
          blood_component_id: components,
          hospital: hospital,
          diagnosis: diagnosis,
          schedule: schedule,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === "success") {
        toast.success("Blood request created successfully");
        setOpen(false);
        window.location.reload();
      } else {
        setErrorMessage(response.data.message);

        if (response.data.errors) {
          setFieldErrors(response.data.errors);
        }
      }
    } catch (error) {
      console.error("Error making blood request:", error);
      setErrorMessage(error.response.data.message);
      if (error.response.data.errors) {
        // Set field-specific error messages
        setFieldErrors(error.response.data.errors);
      }
      toast.error("Oppps! Something went wrong.");
    }
  };

  useEffect(() => {
    const fetchBloodComponents = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `${laravelBaseUrl}/api/get-blood-components`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          setComponentOptions(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
    fetchBloodComponents();
  }, []);

  const dynamicBloodComponent = componentsOptions.map((item) => ({
    label: item.blood_component_desc,
    value: item.blood_component_id.toString(),
  }));

  const handleComponents = (selectedValue) => {
    setComponents(selectedValue);
  };

  return (
    <>
      <Button
        color="gray"
        variant="gradient"
        className="rounded-full"
        onClick={handleOpen}
      >
        Make Request
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Make a Blood Request</DialogHeader>
        {errorMessage && (
          <div className="bg-red-100 border text-center border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        <DialogBody className="flex flex-col gap-4">
          <Input
            label="No. of Blood Units"
            type="text"
            value={unit}
            pattern="\d*"
            maxLength={2}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              if (e.target.value <= 99) {
                setUnit(e.target.value);
              }
            }}
          />
          {fieldErrors.blood_units && (
            <div className="text-red-500">{fieldErrors.blood_units[0]}</div>
          )}
          <InputSelect
            label="Blood Component Need"
            value={components}
            options={dynamicBloodComponent}
            onSelect={handleComponents}
            required
            placeholder="Select Blood Component"
          />
          {fieldErrors.blood_component_id && (
            <div className="text-red-500">
              {fieldErrors.blood_component_id[0]}
            </div>
          )}
          <Input
            label="Diagnosis"
            value={diagnosis}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
            }}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
          {fieldErrors.diagnosis && (
            <div className="text-red-500">{fieldErrors.diagnosis[0]}</div>
          )}
          <Input
            label="Hospital"
            value={hospital}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
            }}
            onChange={(e) => setHospital(e.target.value)}
          />
          {fieldErrors.hospital && (
            <div className="text-red-500">{fieldErrors.hospital[0]}</div>
          )}
          <div className="flex flex-wrap 2xl:flex-nowrap items-center justify-between gap-4 w-full">
            <Input
              type="date"
              label="Date"
              value={schedule}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSchedule(e.target.value)}
            />
          </div>
          {fieldErrors.schedule && (
            <div className="text-red-500">{fieldErrors.schedule[0]}</div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="outlined"
            color="gray"
            onClick={handleClose}
            className="mr-3"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red" onClick={handleSubmit}>
            <span>Submit Request</span>
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
