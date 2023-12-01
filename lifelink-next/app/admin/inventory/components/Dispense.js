import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import PointRightBlood from "@/public/PointRightBlood";
import { TruckIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Option,
  Radio,
  Select,
  Tooltip,
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AccordionDispense } from "./Accordion";

export function Dispense({
  user,
  refreshData,
  blood_bags_id,
  registeredUser,
  hospitalOptions,
}) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [patientBloodType, setPatientBloodType] = useState("");
  const [sex, setSex] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [hospital, setHospital] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const bloodType = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  console.log("hospitalOptions", hospitalOptions);
  const dynamicHospitalOptions = hospitalOptions.map((item) => ({
    label: item.hospital_desc,
    value: item.hospitals_id.toString(),
  }));

  const handleOpen = () => setOpen(!open);

  const handleSelect = (value) => {
    if (value === selectedValue) {
      setSelectedValue(null);
      setSelectedUserDetails(null);
      setPatientBloodType(""); // Clear the blood type when user is deselected
    } else {
      const selectedUser = registeredUser.find(
        (user) => user.user_id === value
      );
      setSelectedValue(value);
      setSelectedUserDetails(selectedUser);
      if (selectedUser) {
        setFirstName(selectedUser.first_name);
        setMiddleName(selectedUser.middle_name);
        setLastName(selectedUser.last_name);
        setDob(selectedUser.dob);
        setPatientBloodType(selectedUser.blood_type); // Set blood type here
        setSex(selectedUser.sex);
      }
    }
  };

  const handleClear = () => {
    handleSelect(null);
    setSelectedValue(null);
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setDob("");
    setPatientBloodType("");
    setSex("");
  };

  const handleHospital = (selectedHospital) => {
    setHospital(selectedHospital);
  };

  const handleDispensedBlood = async () => {
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!Array.isArray(blood_bags_id)) {
      blood_bags_id = [blood_bags_id];
    }

    const data = {
      user_id: selectedValue,
      blood_bags_id: blood_bags_id,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      dob: dob,
      blood_type: patientBloodType,
      sex: sex,
      diagnosis: diagnosis,
      hospital: hospital,
      payment: paymentType,
    };

    try {
      const response = await axios.post(
        `${laravelBaseUrl}/api/dispensed-blood`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);

      if (response.data.status === "success") {
        toast.success("Blood dispensed successfully");
        refreshData();
      } else if (response.data.status === "error") {
        if (response.data.message) {
          setGeneralErrorMessage(response.data.message);
          toast.error("Oops! Something went wrong.");
        } else {
          console.error("Unknown error occurred:", response.data);
        }
      }
      // Close the dialog
      setOpen(false);
    } catch (error) {
      toast.error("An error occurred while making the request.");
      console.error("Unknown error occurred:", error);
    }
  };

  useEffect(() => {
    if (selectedValue !== null) {
      console.log("User selected. Setting patientBloodType.");
      setPatientBloodType(selectedUserDetails?.blood_type);
      setSex(selectedUserDetails?.sex);
    } else {
      console.log("No user selected. Setting default patientBloodType.");
      setPatientBloodType(""); // or any other default value
      setSex(""); // or any other default value
    }
  }, [selectedValue, selectedUserDetails]);

  return (
    <>
      <Tooltip content="Dispense">
        <IconButton
          variant="gradient"
          color="red"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <TruckIcon className="w-5 h-5 text-white" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={handleOpen} size="xl">
        <DialogHeader className="border-b-2">Dispense Blood</DialogHeader>
        <DialogBody className="h-96 3xl:h-fit flex flex-col gap-5 overflow-y-auto">
          <div className="flex items-start justify-between">
            <Card className="w-1/3 border-2 p-3">
              <AccordionDispense user={user} />
            </Card>
            <PointRightBlood height={125} width={125} />
            <Card className="w-1/2 border-2">
              <CardBody className="flex flex-col items-center justify-center gap-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-center gap-3">
                    {/* InputSelect component */}
                    <InputSelect
                      label="Search"
                      value={selectedValue}
                      onSelect={handleSelect}
                      options={registeredUser.map((user) => ({
                        label: `${user.first_name} ${user.middle_name} ${user.last_name}`,
                        value: user.user_id,
                      }))}
                      isSearchable
                      required
                      placeholder="Select a user"
                    />
                  </div>
                  <Button variant="text" onClick={handleClear}>
                    Clear
                  </Button>
                </div>
                <Chip value="Manual" size="sm" className="w-full mt-4 pl-4" />
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-center gap-3">
                    <Input
                      label="First Name"
                      value={
                        selectedValue !== null
                          ? selectedUserDetails?.first_name
                          : firstName
                      }
                      disabled={selectedValue !== null}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                      label="Middle Name"
                      value={
                        selectedValue !== null
                          ? selectedUserDetails?.middle_name
                          : middleName
                      }
                      disabled={selectedValue !== null}
                      onChange={(e) => setMiddleName(e.target.value)}
                    />
                    <Input
                      label="Last Name"
                      value={
                        selectedValue !== null
                          ? selectedUserDetails?.last_name
                          : lastName
                      }
                      disabled={selectedValue !== null}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <Input
                      type="date"
                      label="Date of Birth"
                      value={
                        selectedValue !== null ? selectedUserDetails?.dob : dob
                      }
                      disabled={selectedValue !== null}
                      onChange={(e) => setDob(e.target.value)}
                    />
                    <Select
                      label="Blood Type"
                      value={patientBloodType}
                      onChange={(selectedBloodType) =>
                        setPatientBloodType(selectedBloodType)
                      }
                      disabled={selectedValue !== null}
                    >
                      {bloodType.map((bloodTypes) => (
                        <Option key={bloodTypes} value={bloodTypes}>
                          {bloodTypes}
                        </Option>
                      ))}
                    </Select>
                    <Select
                      label="Sex"
                      value={
                        selectedValue !== null ? selectedUserDetails?.sex : sex
                      }
                      disabled={selectedValue !== null}
                      onChange={(selectedSex) => setSex(selectedSex)}
                    >
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                    </Select>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="w-1/2 flex flex-col items-center gap-5 place-self-center">
            <Input
              label="Diagnosis for transfusion"
              containerProps={{ className: "w-[50%]" }}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
            <InputSelect
              label="Hospital"
              containerProps={{ className: "w-[50%]" }}
              value={hospital}
              onSelect={handleHospital}
              options={dynamicHospitalOptions}
              isSearchable
              required
              placeholder="Hospital"
            />
            <div className="flex gap-10">
              <Radio
                name="type"
                label="Free"
                checked={paymentType === "free"}
                onChange={() => setPaymentType("free")}
              />
              <Radio
                name="type"
                label="Discounted"
                checked={paymentType === "discounted"}
                onChange={() => setPaymentType("discounted")}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="border-t-2">
          <Button
            variant="text"
            color="red"
            onClick={() => setOpen(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red" onClick={handleDispensedBlood}>
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
