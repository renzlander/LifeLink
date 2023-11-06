import React, { use, useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Typography, List, ListItem, Chip, Avatar, Button, Input } from "@material-tailwind/react";
import InputSelect from "@/app/components/InputSelect";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";

export function SideBar() {
    const chipColor = [
        {color: "green", value: "Approved", text: "Approved"},
        {color: "red", value: "Disapproved", text: "Disapproved"},
        {color: "gray", value: "Pending", text: "Pending"},
      ];
    return (
        <Card shadow={false} className="p-4 w-full h-auto shadow-md">
            <CardHeader color="gray-200" className="mx-0 flex items-center gap-4 pt-4 pb-2">
                <Avatar size="lg" variant="circular" src="/next.svg" />
                <div className="flex flex-col">
                    <Typography variant="h5" color="gray-700">
                        My Ongoing Request
                    </Typography>
                </div>
            </CardHeader>
            <CardBody className="p-4">
                <Typography>No. of units: 2</Typography>
                <Typography>Blood Component: Whole Blood</Typography>
                <Typography>Hospital: Valenzuela City Emergency Hospital</Typography>
                <Typography>Diagnosis: Anemia</Typography>
                <Typography>Schedule of Transfusion/Operation: November 16, 2023 7:45 AM</Typography>
                <Chip 
                  className="mt-4"
                  variant="ghost" 
                  color={chipColor[2].color} 
                  value={chipColor[2].text}
                >
                  {chipColor[2].text}
                </Chip>
            </CardBody>
        </Card>
    );
}

export function MakeRequest({userDetails}) {
    const [bloodComponentOptions, setBloodComponentOptions] = useState([]);
    const [bloodUnits, setBloodUnits] = useState("");
    const [component, setComponent] = useState("");
    const [hospital, setHospital] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [transfusionSchedule, setTransfusionSchedule] = useState("");
    const [errorMessage, setErrorMessage] = useState({ blood_units: [], blood_component_id: [], diagnosis: [], bled_by: [], hospital: [], schedule: [],});
    const [generalErrorMessage, setGeneralErrorMessage] = useState("");

    console.log("schedule", transfusionSchedule);

    const dynamicBloodComponents = bloodComponentOptions.map((item) => ({
        label: item.blood_component_desc,
        value: item.blood_component_id,
    }));

    const handleMakeRequest = async () => {
      try {
          const token = getCookie("token");
          if (!token) {
              router.push("/login");
              return;
          }

          // Prepare data for the POST request
          const data = {
              user_id:userDetails.user_id,
              blood_units: bloodUnits,
              blood_component_id: component,
              hospital: hospital,
              diagnosis: diagnosis,
              schedule: transfusionSchedule,
          };

          // Send POST request to add-bloodbag API
          const response = await axios
              .post(`${laravelBaseUrl}/api/request-blood`, data, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              })
              .catch((error) => {
                  console.error("Unknown error occurred:", error);
                  if (error.response && error.response.data && error.response.data.errors) {
                     toast.error("Opps! Something went wrong.");
                      const { errors } = error.response.data;
                      const bloodUnitsError = errors.blood_units || [];
                      const componentError = errors.blood_component_id || [];
                      const diagnosisError = errors.diagnosis || [];
                      const hospitalError = errors.hospital || [];
                      const transfusionScheduleError = errors.schedule || [];
                      setErrorMessage({ blood_units: bloodUnitsError, blood_component_id: componentError, diagnosis: diagnosisError, hospital: hospitalError, schedule: transfusionScheduleError });
                  } else {
                      setGeneralErrorMessage(error.response.data.message);
                      toast.error("Opps! Something went wrong.");
                      setErrorMessage({ blood_units: [], blood_component_id: [], diagnosis: [], hospital: [], schedule: [] });
                    }
              });

          if (response.data.status === "success") {
              toast.success("Blood request successfully created");
          } else if (response.data.status === "error") {
              if (response.data.message) {
                  setGeneralErrorMessage(response.data.message);
              } else {
                  console.error("Unknown error occurred:", response.data);
              }
          }

      } catch (error) {
          toast.error(error);
          console.error("Unknown error occurred:", error);
      }
  };

    const handleComponentSelect = (selectedValue) => {
        setComponent(selectedValue);
    };

    const handleDateChange = (date) => {
        setTransfusionSchedule(date);
    };


    const fetchBledByAndVenueLists = async () => {
        try {
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const response = await axios.get(`${laravelBaseUrl}/api/get-blood-components`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === "success") {
                setBloodComponentOptions(response.data.data);
            } else {
                console.error("Oops! Something went wrong.");
            }
        } catch (error) {
            console.error("Error fetching bled_by and venues lists:", error);
        }
    };

    useEffect(() => {
        fetchBledByAndVenueLists();
    }, []);

    return (
        <Card shadow={false} className="p-4 w-full h-auto shadow-md mt-6">
          <CardHeader className="mx-0 flex items-center gap-4 pt-4 pb-2">
            <Avatar size="lg" variant="circular" src="/next.svg" />
            <div className="flex flex-col">
              <Typography variant="h5" color="gray-700">
                Make A Blood Request
              </Typography>
            </div>
          </CardHeader>
          {generalErrorMessage && (
            <div className="mt-4 text-center bg-red-100 p-2 rounded-lg">
              <Typography color="red" className="text-sm font-semibold">
                {generalErrorMessage}
              </Typography>
            </div>
          )}
          <CardBody className="p-4">
            <div className="relative flex flex-col gap-3 items-center py-2">
              <div className="input-container w-full">
                <Input
                  label="No. of Units"
                  maxLength={2}
                  onChange={(e) => setBloodUnits(e.target.value)}
                />
                {errorMessage.blood_units.length > 0 && (
                  <div className="error-message text-red-600 text-sm">
                    {errorMessage.blood_units[0]}
                  </div>
                )}
              </div>
              <div className="input-container w-full">
                <InputSelect
                  label="Blood Component Need"
                  value={component}
                  onSelect={handleComponentSelect}
                  options={dynamicBloodComponents}
                  isSearchable
                  required
                  placeholder="Blood Component Need"
                  onChange={(value) => setComponent(value)}
                />
                {errorMessage.blood_component_id.length > 0 && (
                  <div className="error-message text-red-600 text-sm">
                    {errorMessage.blood_component_id[0]}
                  </div>
                )}
              </div>
              <div className="input-container w-full">
                <Input label="Diagnosis" onChange={(e) => setDiagnosis(e.target.value)} />
                {errorMessage.diagnosis.length > 0 && (
                  <div className="error-message text-red-600 text-sm">
                    {errorMessage.diagnosis[0]}
                  </div>
                )}
              </div>
              <div className="input-container w-full">
                <Input label="Hospital" onChange={(e) => setHospital(e.target.value)} />
                {errorMessage.hospital.length > 0 && (
                  <div className="error-message text-red-600 text-sm">
                    {errorMessage.hospital[0]}
                  </div>
                )}
              </div>
              <div className="input-container w-full">
                <DatePicker
                  selected={transfusionSchedule}
                  onChange={handleDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholderText="Select Date and Time"
                />
                {errorMessage.schedule.length > 0 && (
                  <div className="error-message text-red-600 text-sm">
                    {errorMessage.schedule[0]}
                  </div>
                )}
              </div>
              <Button variant="gradient" color="red" className="w-full mt-8" onClick={handleMakeRequest}>
                <span>Make Request</span>
              </Button>
            </div>
          </CardBody>
        </Card>
      );
      
      
}


function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
}
