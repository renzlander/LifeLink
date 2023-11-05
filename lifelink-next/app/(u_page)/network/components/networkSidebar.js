import React, { use, useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Typography, List, ListItem, Chip, Avatar, Button, Input } from "@material-tailwind/react";
import InputSelect from "@/app/components/InputSelect";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

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

export function MakeRequest() {
    const [bloodComponentOptions, setBloodComponentOptions] = useState([]);
    const [components, setComponents] = useState("");
    const [selectedDate, setSelectedDate] = useState(null); // State for date and time

    const dynamicBloodComponents = bloodComponentOptions.map((item) => ({
        label: item.blood_component_desc,
        value: item.blood_component_id,
    }));
    const handleComponentSelect = (selectedValue) => {
        setComponents(selectedValue);
    };
    const handleDateChange = (date) => {
        setSelectedDate(date);
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

            console.log(response);

            if (response.data.status === "success") {
                // Update the state variables with the data from the API response
                setBloodComponentOptions(response.data.data);
            } else {
                // Handle the case when the API request fails
                console.error("Oops! Something went wrong.");
            }
        } catch (error) {
            console.error("Error fetching bled_by and venues lists:", error);
            // You can handle the error here, e.g., by displaying a message to the user
        }
    };

    useEffect(() => {
        fetchBledByAndVenueLists();
    }, []); // Add the empty dependency array
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
            <CardBody className="p-4">
                <div className="relative flex flex-col gap-3 items-center py-2">
                    <Input label="No. of Units" maxLength={4} />
                    <InputSelect label="Blood Component Need" value={components} onSelect={handleComponentSelect} options={dynamicBloodComponents} isSearchable required placeholder="Venue" />
                    <Input label="Diagnosis" maxLength={4} />
                    <Input label="Hospital" maxLength={4} />
                    <div className="date-picker-container">
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            placeholderText="Select Date and Time"
                            className="custom-date-picker"
                        />
                    </div>
                </div>
                <Button variant="gradient" color="red" className="w-full mt-8">
                        <span>Make Request</span>
                </Button>
            </CardBody>
        </Card>
    );
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
}
