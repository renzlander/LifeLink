import { laravelBaseUrl } from "@/app/variables";
import { PlusIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Spinner,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function AddUsers({ refreshData }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [sex, setSex] = useState("");
  const [blood_type, setBlood] = useState("");
  const [street, setStreet] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [occupation, setOccupation] = useState("");
  const [dob, setDob] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    dob: [],
    email: [],
    mobile: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const bloodTypes = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validDomains = ["gmail.com", "hotmail.com", "yahoo.com"];

    if (!emailRegex.test(email)) {
      return false; // Invalid email format
    }

    const domain = email.split("@")[1];
    return validDomains.includes(domain);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(isValidEmail(newEmail));
  };

  const [regionList, setRegionList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState({
    regionName: "Region",
  });

  const [provinceList, setProvinceList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState({
    provinceName: "Province",
  });

  const [municipalityList, setMunicipalityList] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState({
    municipalityName: "Municipality",
  });

  const [barangayList, setBarangayList] = useState([]);
  const [selectedBarangay, setSelectedBarangay] = useState({
    barangayName: "Barangay",
  });

  useEffect(() => {
    axios.get(`${laravelBaseUrl}/api/address/get-regions`).then((data) => {
      setRegionList(data.data);
    });
  }, []);

  useEffect(() => {
    if (selectedRegion?.regCode) {
      axios
        .post(
          `${laravelBaseUrl}/api/address/get-provinces?regCode=${selectedRegion?.regCode}`
        )
        .then((data) => {
          setProvinceList(data.data);
        });
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedProvince?.provCode) {
      axios
        .post(
          `${laravelBaseUrl}/api/address/get-municipalities?provCode=${selectedProvince?.provCode}`
        )
        .then((data) => {
          setMunicipalityList(data.data);
        });
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedMunicipality?.citymunCode) {
      axios
        .post(
          `${laravelBaseUrl}/api/address/get-barangays?citymunCode=${selectedMunicipality?.citymunCode}`
        )
        .then((data) => {
          setBarangayList(data.data);
        });
    }
  }, [selectedMunicipality]);

  const handleSexChange = (selectedSex) => {
    setSex(selectedSex);
  };

  const handleBloodChange = (selectedBlood) => {
    setBlood(selectedBlood);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.post(
        `${laravelBaseUrl}/api/add-user`,
        {
          email,
          mobile: `0${mobile}`,
          first_name,
          middle_name,
          last_name,
          sex,
          dob,
          occupation,
          blood_type,
          street,
          region: selectedRegion?.regCode,
          province: selectedProvince?.provCode,
          municipality: selectedMunicipality?.citymunCode,
          barangay: selectedBarangay?.brgyCode,
          postalcode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success(response.data.message);
        setOpen(false);
        setEmail("");
        setMobile("");
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setSex("");
        setDob("");
        setOccupation("");
        setBlood("");
        setStreet("");
        setPostalCode("");
        setSelectedRegion({ regionName: "Region" });
        setSelectedProvince({ provinceName: "Province" });
        setSelectedMunicipality({ municipalityName: "Municipality" });
        setSelectedBarangay({ barangayName: "Barangay" });
        setErrorMessage({
          dob: [],
          email: [],
          mobile: [],
        });
        refreshData();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        const emailErrors = errors.email || [];
        const mobileErrors = errors.mobile || [];
        const dobErrors = errors.dob || [];
        setErrorMessage({
          dob: dobErrors,
          email: emailErrors,
          mobile: mobileErrors,
        });
      } else {
        setErrorMessage({
          dob: [error.message],
          email: [error.message],
          mobile: [error.message],
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    first_name !== "" &&
    middle_name !== "" &&
    last_name !== "" &&
    occupation !== "" &&
    street !== "" &&
    postalcode !== "" &&
    sex !== "" &&
    blood_type !== "" &&
    selectedRegion.regionName !== "Region" &&
    selectedProvince.provinceName !== "Province" &&
    selectedMunicipality.municipalityName !== "Municipality" &&
    selectedBarangay.barangayName !== "Barangay" &&
    dob !== "";

  const handleMobileNumberChange = (e) => {
    let inputValue = e.target.value;

    // Remove non-numeric characters
    inputValue = inputValue.replace(/[^0-9]/g, "");

    // Ensure the first digit is 9 and limit the length to 10 digits
    const sanitizedValue = inputValue.startsWith("9")
      ? inputValue.slice(0, 10)
      : inputValue.slice(0, 9);

    // If the first digit is not 9, reset the input to an empty string
    if (inputValue.length > 0 && inputValue[0] !== "9") {
      setMobile("");
    } else {
      setMobile(sanitizedValue);
    }
  };

  return (
    <>
      <Tooltip content="Add Users">
        <Button
          size="sm"
          onClick={() => setOpen(true)}
          variant="gradient"
          color="red"
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Users</span>
        </Button>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)} size="lg">
        <DialogHeader className="border-b">Register a User</DialogHeader>
        <DialogBody className="flex flex-col gap-6 overscroll-y-auto">
          <form onSubmit={handleSubmit} className="mt-2 mb-2 w-full">
            <input type="hidden" value={dob} name="dob" />
            <div className="mb-4 flex grow gap-6">
              <div className="relative w-full">
                <Input
                  size="lg"
                  label="Email"
                  value={email}
                  onChange={handleEmailChange}
                  maxLength={100}
                  error={!isEmailValid && email.trim() !== ""}
                  success={isEmailValid}
                  required
                />
                {errorMessage.email.length > 0 && (
                  <div className="error-message text-red-600 text-sm">
                    {errorMessage.email[0]}
                  </div>
                )}
                <Typography variant="small" color="red">
                  {!isEmailValid && email.trim() !== "" && "Invalid Email"}
                </Typography>
              </div>
              <div>
                <div className="w-full relative">
                  {inputFocused && (
                    <Typography
                      variant="paragraph"
                      style={{
                        position: "absolute",
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-45%)",
                        zIndex: "2",
                        fontSize: "14px",
                      }}
                    >
                      +63
                    </Typography>
                  )}
                  <Input
                    size="lg"
                    label="Mobile Number"
                    value={mobile}
                    onChange={handleMobileNumberChange}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(mobile.trim() !== "")}
                    required
                    maxLength={10}
                    error={errorMessage.mobile.length > 0 }
                    className={`w-full ${inputFocused ? "pl-12" : ""}`}
                  />
                </div>
                {errorMessage.mobile.length > 0 && (
                  <div
                    key="mobileError"
                    className="error-message text-red-600 text-sm"
                  >
                    {errorMessage.mobile[0]}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4 flex gap-6 lg:flex-row sm:flex-col">
              <Input
                size="lg"
                label="First Name"
                required
                value={first_name}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[A-Za-z\s]*$/.test(newValue)) {
                    return;
                  }
                  setFirstName(newValue);
                }}
              />
              <Input
                size="lg"
                label="Middle Name"
                required
                value={middle_name}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[A-Za-z\s]*$/.test(newValue)) {
                    return;
                  }
                  setMiddleName(newValue);
                }}
              />
              <Input
                size="lg"
                label="Last Name"
                required
                value={last_name}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[A-Za-z\s]*$/.test(newValue)) {
                    return;
                  }
                  setLastName(newValue);
                }}
              />
            </div>
            <div className="mb-4 flex grow gap-6">
              <Input
                size="lg"
                label="Occupation"
                required
                value={occupation}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[A-Za-z0-9\s,.]*$/.test(newValue)) {
                    return;
                  }
                  setOccupation(newValue);
                }}
              />
              <div
                className={`relative ${
                  errorMessage.dob.length > 0 ? "mb-1" : ""
                }`}
              >
                <Input
                  type="date"
                  size="lg"
                  label="Birthdate"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  error={errorMessage.mobile.length > 0 }
                  className="w-full"
                />
                {errorMessage.dob.length > 0 && (
                  <div className="error-message text-red-600 text-sm">
                    {errorMessage.dob[0]}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4 flex grow gap-6">
              <Select
                onChange={handleSexChange}
                label="Sex"
                value={sex}
                required
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>

              <Select
                onChange={handleBloodChange}
                label="Blood Type"
                value={blood_type}
                required
              >
                {bloodTypes.map((blood) => (
                  <Option key={blood} value={blood}>
                    {blood}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="mb-4 flex grow gap-6">
              <Select label="Region" required name={selectedRegion?.regionName}>
                {regionList?.map((region) => (
                  <Option
                    key={region.id} // Add a unique key prop here
                    onClick={() => {
                      setSelectedRegion({
                        regionName: region?.regDesc,
                        regCode: region?.regCode,
                        id: region?.id,
                      });
                    }}
                  >
                    {region?.regDesc}
                  </Option>
                ))}
              </Select>
              <Select
                label="Province"
                required
                noListMessage="Please select a region first"
                name={selectedProvince?.provinceName}
                data={provinceList}
              >
                {provinceList?.map((province) => (
                  <Option
                    key={province.id} // Add a unique key prop here
                    onClick={() => {
                      setSelectedProvince({
                        provinceName: province?.provDesc,
                        provCode: province?.provCode,
                        id: province?.id,
                      });
                    }}
                  >
                    {province?.provDesc}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="mb-4 flex grow gap-6">
              <Select
                label="Municipality"
                required
                name={selectedMunicipality?.municipalityName}
                data={municipalityList}
              >
                {municipalityList?.map((municipality) => (
                  <Option
                    key={`city${municipality?.citymunCode}`} // Add a unique key prop here
                    onClick={() => {
                      setSelectedMunicipality({
                        municipalityName: municipality?.citymunDesc,
                        citymunCode: municipality?.citymunCode,
                        id: municipality?.id,
                      });
                    }}
                  >
                    {municipality?.citymunDesc}
                  </Option>
                ))}
              </Select>
              <Select
                label="Barangay"
                required
                name={selectedBarangay?.barangayName}
                data={barangayList}
              >
                {barangayList
                  ?.sort((a, b) => a.brgyDesc.localeCompare(b.brgyDesc))
                  .map((barangay) => (
                    <Option
                      key={`brngy${barangay.id}`} // Add a unique key prop here
                      onClick={() => {
                        setSelectedBarangay({
                          barangayName: barangay?.brgyDesc,
                          brgyCode: barangay?.brgyCode,
                          id: barangay.id,
                        });
                      }}
                    >
                      {barangay?.brgyDesc}
                    </Option>
                  ))}
              </Select>
            </div>
            <div className="mb-4 flex grow gap-6">
              <Input
                size="lg"
                label="Street"
                required
                value={street}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[A-Za-z0-9\s,.]*$/.test(newValue)) {
                    return;
                  }
                  setStreet(newValue);
                }}
              />
              <Input
                size="lg"
                label="Zip Code"
                maxLength={4}
                required
                value={postalcode}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!/^[0-9]*$/.test(newValue)) {
                    return;
                  }
                  setPostalCode(newValue);
                }}
              />
            </div>
            <div className="flex items-center justify-end">
              <Button
                variant="gradient"
                onClick={() => setOpen(false)}
                className="mr-1"
              >
                <span>Cancel</span>
              </Button>
              <Button
                type="submit"
                variant="gradient"
                color="green"
                className="flex items-center justify-center gap-5"
                disabled={!isFormValid || isSubmitting || !isEmailValid}
              >
                {isSubmitting ? <Spinner className="h-4 w-4" /> : ""}
                Register User
              </Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
