import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import PointRightBlood from "@/public/PointRightBlood";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Radio,
  Select,
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AccordionMultipleDispense } from "./Accordion";

export function MultipleDispensed({
  selectedRows,
  user,
  refreshData,
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
  const [hospital, setHospital] = useState("ValGen");
  const [paymentType, setPaymentType] = useState("");
  const bloodType = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const dynamicHospitalOptions = hospitalOptions.map((item) => ({
    label: item.hospital_desc,
    value: item.hospitals_id.toString(),
  }));
  const handleOpen = () => setOpen(!open);

  const blood_bags_ids = [];

  user.forEach((userData) => {
    blood_bags_ids.push(userData.blood_bags_id);
  });

  const handleSelect = (value) => {
    if (value === selectedValue) {
      setSelectedValue(null);
      setSelectedUserDetails(null);
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
        setPatientBloodType(selectedUser.blood_type);
        setSex(selectedUser.sex);
      }
    }
  };

  const handleClear = () => {
    setSelectedValue(null);
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setDob("");
    setPatientBloodType("");
    setSex("");
  };

  const handleBloodType = (selectedBloodType) => {
    console.log("Blood Type selected:", selectedBloodType);
    setPatientBloodType(selectedBloodType);
  };

  const handleSex = (selectedSex) => {
    console.log("Sex selected:", selectedSex);
    setSex(selectedSex);
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

    const data = {
      user_id: selectedValue,
      blood_bags_id: blood_bags_ids,
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

  useEffect(() => {});

  return (
    <>
      <Button onClick={handleOpen} size="sm" color="red" variant="gradient">
        Dispense
      </Button>
      <Dialog open={open} handler={handleOpen} size="xl">
        <DialogHeader className="border-b-2">Dispense Blood</DialogHeader>
        <DialogBody className="h-96 3xl:h-fit flex flex-col gap-5 overflow-y-auto">
          <div className="flex items-start justify-between">
            <Card className="w-1/3 h-72 p-2 border-2">
              <CardBody className="p-2 overflow-y-auto">
                {user.map((userData, index) => (
                  <AccordionMultipleDispense key={index} user={userData} />
                ))}
              </CardBody>
            </Card>
            <PointRightBlood height={150} width={150} />
            <Card className="w-1/2 border-2">
              <CardBody className="flex flex-col items-center justify-center gap-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-center gap-3">
                    {/* InputSelect component */}
                    <InputSelect
                      label="search"
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
                  <div>
                    {/* Clear button */}
                    <Button variant="text" onClick={handleClear}>
                      Clear
                    </Button>
                  </div>
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
                      value={
                        selectedValue !== ""
                          ? selectedUserDetails?.blood_type
                          : patientBloodType
                      }
                      disabled={selectedValue !== null}
                      onSelect={handleBloodType}
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
                        selectedValue !== "" ? selectedUserDetails?.sex : sex
                      }
                      disabled={selectedValue !== null}
                      onSelect={handleSex}
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
              value={hospital} // The selected value will be stored in the 'hospital' variable
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
                color="red"
                checked={paymentType === "free"}
                onChange={() => setPaymentType("free")}
              />
              <Radio
                name="type"
                label="Discounted"
                color="red"
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
