import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import { PencilIcon } from "@heroicons/react/24/solid";
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
  Tooltip,
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function EditPopUp({ user, refreshData }) {
  const [open, setOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const bloodTypes = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];
  const [errorMessage, setErrorMessage] = useState({
    email: [],
    mobile: [],
    first_name: [],
    last_name: [],
    sex: [],
    blood_type: [],
    dob: [],
  });
  const router = useRouter();
  // Region
  const [selectedRegionCode, setSelectedRegionCode] = useState(user.region);
  const [regionOption, setRegionOption] = useState([]);

  // Province
  const [selectedProvinceCode, setSelectedProvinceCode] = useState(
    user.province
  );
  const [provinceOption, setProvinceOption] = useState([]);

  // Municipality
  const [selectedMunicipalityCode, setSelectedMunicipalityCode] = useState(
    user.municipality
  );
  const [municipalityOption, setMunicipalityOption] = useState([]);

  // Barangay
  const [selectedBarangayCode, setSelectedBarangayCode] = useState(
    user.barangay
  );
  const [barangayOption, setBarangayOption] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regionsResponse = await axios.get(
          `${laravelBaseUrl}/api/address/get-regions`
        );
        const regions = regionsResponse.data;
        setRegionOption(regions);

        // Find the default selected region
        const defaultSelectedRegion = regions.find(
          (item) => item.regDesc === user.region
        );

        if (defaultSelectedRegion) {
          setSelectedRegionCode(defaultSelectedRegion.regCode.toString());

          const provincesResponse = await axios.post(
            `${laravelBaseUrl}/api/address/get-provinces`,
            {
              regCode: defaultSelectedRegion.regCode.toString(),
            }
          );
          const provinces = provincesResponse.data;
          setProvinceOption(provinces);

          // Find the default selected province
          const defaultSelectedProvince = provinces.find(
            (province) => province.provDesc === user.province
          );

          if (defaultSelectedProvince) {
            setSelectedProvinceCode(
              defaultSelectedProvince.provCode.toString()
            );

            const municipalitiesResponse = await axios.post(
              `${laravelBaseUrl}/api/address/get-municipalities`,
              {
                provCode: defaultSelectedProvince.provCode.toString(),
              }
            );
            const municipalities = municipalitiesResponse.data;
            setMunicipalityOption(municipalities);

            // Find the default selected municipality
            const defaultSelectedMunicipality = municipalities.find(
              (municipality) => municipality.citymunDesc === user.municipality
            );

            if (defaultSelectedMunicipality) {
              setSelectedMunicipalityCode(
                defaultSelectedMunicipality.citymunCode.toString()
              );

              const barangaysResponse = await axios.post(
                `${laravelBaseUrl}/api/address/get-barangays`,
                {
                  citymunCode:
                    defaultSelectedMunicipality.citymunCode.toString(),
                }
              );
              const barangays = barangaysResponse.data;
              setBarangayOption(barangays);

              // Find the default selected barangay
              const defaultSelectedBarangay = barangays.find(
                (barangay) => barangay.brgyDesc === user.barangay
              );

              if (defaultSelectedBarangay) {
                setSelectedBarangayCode(
                  defaultSelectedBarangay.brgyCode.toString()
                );
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user.region, user.province, user.municipality, user.barangay]);

  const dynamicRegionOptions = regionOption.map((item) => ({
    label: item.regDesc,
    value: item.regCode.toString(),
  }));

  const handleRegionSelect = (selectedValue) => {
    setSelectedRegionCode(selectedValue);
    // Reset the selected province, municipality, and barangay when region changes
    setSelectedProvinceCode(null);
    setSelectedMunicipalityCode(null);
    setSelectedBarangayCode(null);
  };

  useEffect(() => {
    if (selectedRegionCode) {
      axios
        .post(`${laravelBaseUrl}/api/address/get-provinces`, {
          regCode: selectedRegionCode,
        })
        .then((response) => {
          const provinces = response.data;
          setProvinceOption(provinces);
        })
        .catch((error) => {
          console.error("Error fetching provinces:", error);
        });
    }
  }, [selectedRegionCode]);

  const dynamicProvinceOptions = provinceOption.map((item) => ({
    label: item.provDesc,
    value: item.provCode.toString(),
  }));

  useEffect(() => {
    if (selectedProvinceCode) {
      axios
        .post(`${laravelBaseUrl}/api/address/get-municipalities`, {
          provCode: selectedProvinceCode,
        })
        .then((response) => {
          const municipalities = response.data;
          setMunicipalityOption(municipalities);
        })
        .catch((error) => {
          console.error("Error fetching municipalities:", error);
        });
    }
  }, [selectedProvinceCode]);

  const dynamicMunicipalityOptions = municipalityOption.map((item) => ({
    label: item.citymunDesc,
    value: item.citymunCode.toString(),
  }));

  useEffect(() => {
    if (selectedMunicipalityCode) {
      axios
        .post(`${laravelBaseUrl}/api/address/get-barangays`, {
          citymunCode: selectedMunicipalityCode,
        })
        .then((response) => {
          const barangays = response.data;
          setBarangayOption(barangays);
        })
        .catch((error) => {
          console.error("Error fetching barangays:", error);
        });
    }
  }, [selectedMunicipalityCode]);

  const dynamicBarangayOptions = barangayOption.map((item) => ({
    label: item.brgyDesc,
    value: item.brgyCode.toString(),
  }));

  const handleProvinceSelect = (selectedValue) => {
    setSelectedProvinceCode(selectedValue);
    // Reset the selected municipality and barangay when province changes
    setSelectedMunicipalityCode(null);
    setSelectedBarangayCode(null);
  };

  const handleMunicipalitySelect = (selectedValue) => {
    setSelectedMunicipalityCode(selectedValue);
    // Reset the selected barangay when municipality changes
    setSelectedBarangayCode(null);
  };

  const handleBarangaySelect = (selectedValue) => {
    setSelectedBarangayCode(selectedValue);
  };

  const validateEmail = (email) => {
    // Simple email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleEditUser = async () => {
    try {
      // Prepare data for the PUT request
      const data = {
        ...editedUser,
        user_id: user.user_id,
        region: selectedRegionCode,
        province: selectedProvinceCode,
        municipality: selectedMunicipalityCode,
        barangay: selectedBarangayCode,
      };
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const isEmailValid = validateEmail(editedUser.email);
      if (!isEmailValid) {
        setErrorMessage({ ...errorMessage, email: ["Invalid email address."] });
        return; // Stop execution if email is not valid
      }
      // Send PUT request to update-user API
      const response = await axios.put(
        `${laravelBaseUrl}/api/edit-user-details`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === "success") {
        // User data updated successfully
        refreshData();
        toast.success("User data updated successfully");
        // Notify the parent component about the update
        // Close the dialog
        setOpen(false);
        router.refresh();
      } else {
        console.error("Error updating user data:", response.data.message);
        toast.error("Error updating user details");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        const emailErrors = errors.email || [];
        const mobileErrors = errors.mobile || [];
        const first_nameErrors = errors.first_name || [];
        const last_nameErrors = errors.last_name || [];
        const sexErrors = errors.sex || [];
        const blood_typeErrors = errors.blood_type || [];
        const dobErrors = errors.dob || [];
        setErrorMessage({
          email: emailErrors,
          mobile: mobileErrors,
          first_name: first_nameErrors,
          last_name: last_nameErrors,
          sex: sexErrors,
          blood_type: blood_typeErrors,
          dob: dobErrors,
        });
      } else {
        setErrorMessage({ email: [error.message], mobile: [error.message] });
      }
      console.error("Error updating user data:", error);
      toast.error(error);
      console.error("Unknown error occurred:", error);
    }
  };
  return (
    <>
      <Tooltip content="Edit User">
        <IconButton variant="text" onClick={() => setOpen(true)}>
          <PencilIcon className="h-4 w-4" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)} size="lg">
        <DialogHeader>Edit User</DialogHeader>
        <DialogBody divider className="flex flex-col gap-6 overscroll-y-auto">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              label="First Name"
              value={editedUser.first_name}
              onChange={(e) =>
                setEditedUser({ ...editedUser, first_name: e.target.value })
              }
              containerProps={{ className: "min-w-[50px]" }}
            />
            {errorMessage.first_name?.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.first_name[0]}
              </div>
            )}

            <Input
              type="text"
              label="Middle Name"
              value={editedUser.middle_name}
              onChange={(e) =>
                setEditedUser({ ...editedUser, middle_name: e.target.value })
              }
              containerProps={{ className: "min-w-[50px]" }}
            />
            <Input
              type="text"
              label="Last Name"
              value={editedUser.last_name}
              onChange={(e) =>
                setEditedUser({ ...editedUser, last_name: e.target.value })
              }
              containerProps={{ className: "min-w-[50px]" }}
              error={errorMessage.last_name?.length > 0}
              required
            />
            {/* {errorMessage.last_name.length > 0 && <Typography variant="small" color="gray" className="mt-2 flex items-center gap-1 font-normal">{errorMessage.last_name[0]}</Typography>} */}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              label="Email"
              value={editedUser.email}
              onChange={(e) =>
                setEditedUser({ ...editedUser, email: e.target.value })
              }
            />
            {errorMessage.email.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.email[0]}
              </div>
            )}
            <Input
              type="text"
              label="Mobile"
              value={editedUser.mobile}
              onChange={(e) =>
                setEditedUser({ ...editedUser, mobile: e.target.value })
              }
            />
            {errorMessage.mobile.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.mobile[0]}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select
              label="Sex"
              value={editedUser.sex}
              onChange={(value) => setEditedUser({ ...editedUser, sex: value })}
              containerProps={{ className: "min-w-[50px]" }}
            >
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
            {errorMessage.sex?.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.sex[0]}
              </div>
            )}
            <Input
              type="date"
              label="Date of Birth"
              value={editedUser.dob}
              onChange={(e) =>
                setEditedUser({ ...editedUser, dob: e.target.value })
              }
              containerProps={{ className: "min-w-[50px]" }}
            />
            {errorMessage.dob?.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.dob[0]}
              </div>
            )}

            <Select
              label="Blood Type"
              value={editedUser.blood_type}
              onChange={(value) =>
                setEditedUser({ ...editedUser, blood_type: value })
              }
              containerProps={{ className: "min-w-[50px]" }}
            >
              {bloodTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
            {errorMessage.blood_type?.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {/*  */}
                {errorMessage.blood_type[0]}
              </div>
            )}
          </div>
          <Input
            type="text"
            label="Street"
            value={editedUser.street}
            onChange={(e) =>
              setEditedUser({ ...editedUser, street: e.target.value })
            }
          />
          <div className="flex items-center gap-2">
            <InputSelect
              label="Region"
              value={selectedRegionCode || user.region}
              options={dynamicRegionOptions}
              onSelect={handleRegionSelect}
              isSearchable
              required
              placeholder="Region"
            />
          </div>

          <div className="flex items-center gap-2">
            <InputSelect
              label="Province"
              value={selectedProvinceCode || user.province}
              options={dynamicProvinceOptions}
              onSelect={handleProvinceSelect}
              isSearchable
              required
              placeholder="Province"
            />
          </div>

          <div className="flex items-center gap-2">
            <InputSelect
              label="Municipality"
              value={selectedMunicipalityCode || user.municipality}
              options={dynamicMunicipalityOptions}
              onSelect={handleMunicipalitySelect}
              isSearchable
              required
              placeholder="Municipality"
            />
          </div>

          <div className="flex items-center gap-2">
            <InputSelect
              label="Barangay"
              value={selectedBarangayCode || user.barangay}
              options={dynamicBarangayOptions}
              onSelect={handleBarangaySelect}
              isSearchable
              required
              placeholder="Barangay"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            onClick={() => setOpen(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red"  onClick={handleEditUser}>
            <span>Done</span>
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