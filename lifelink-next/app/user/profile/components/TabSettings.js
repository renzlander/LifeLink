import InputSelect from "@/app/components/InputSelect";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
  Avatar,
  Chip,
  Input,
  Button,
} from "@material-tailwind/react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function TabSettings({ userDetails, refreshData }) {
  const [editedUser, setEditedUser] = useState({ ...userDetails });
  const [email, setEmail] = useState(userDetails.email);
  const [mobile, setMobile] = useState(userDetails.mobile);
  const [occupation, setOccupation] = useState(userDetails.occupation);
  const [street, setStreet] = useState(userDetails.street);
  const [errorMessage, setErrorMessage] = useState({
    email: [],
    mobile: [],
  });
  const router = useRouter();


  // Region
  const [selectedRegionCode, setSelectedRegionCode] = useState(
    userDetails.region
  );
  const [regionOption, setRegionOption] = useState([]);

  // Province
  const [selectedProvinceCode, setSelectedProvinceCode] = useState(
    userDetails.province
  );
  const [provinceOption, setProvinceOption] = useState([]);

  // Municipality
  const [selectedMunicipalityCode, setSelectedMunicipalityCode] = useState(
    userDetails.municipality
  );
  const [municipalityOption, setMunicipalityOption] = useState([]);

  // Barangay
  const [selectedBarangayCode, setSelectedBarangayCode] = useState(
    userDetails.barangay
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
          (item) => item.regDesc === userDetails.region
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
            (province) => province.provDesc === userDetails.province
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
              (municipality) =>
                municipality.citymunDesc === userDetails.municipality
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
                (barangay) => barangay.brgyDesc === userDetails.barangay
              );

              if (defaultSelectedBarangay) {
                setSelectedBarangayCode(
                  defaultSelectedBarangay.brgyCode.toString()
                );
              }
            }
          }
        }
      } catch (error) {}
    };

    fetchData();
  }, [
    userDetails.region,
    userDetails.province,
    userDetails.municipality,
    userDetails.barangay,
  ]);

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
        .catch((error) => {});
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
        .catch((error) => {});
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
        .catch((error) => {});
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
  };

  const handleEditUser = async () => {
    try {
      // Prepare data for the PUT request
      const data = {
        ...editedUser,
        user_id: userDetails.user_id,
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
      // Send PUT request to update-userDetails API
      const response = await axios.put(
        `${laravelBaseUrl}/api/edit-profile`,
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
        toast.success("Profile updated successfully");
        // Notify the parent component about the update
        // Close the dialog
        router.refresh();
      } else {
        toast.error("Error updating userDetails details");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        const emailErrors = errors.email || [];
        const mobileErrors = errors.mobile || [];
        setErrorMessage({
          email: emailErrors,
          mobile: mobileErrors,
        });
      } else {
        setErrorMessage({ email: [error.message], mobile: [error.message] });
      }
      toast.error(error);
    }
  };

  return (
    <Card className="px-2">
      <CardBody>
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4 gap-y-4">
          <div className="col-span-1 md:border-r md:border-b-0 border-b pb-4">
            <div className="flex flex-col items-start justify-between w-full gap-6">
              <Typography
                variant="h6"
                className="font-sans text-lg text-blue-gray-700 mb-2"
              >
                Change Photo
              </Typography>
              <Typography
                variant="small"
                className="font-medium text-base text-blue-gray-700"
              >
                Profile Picture:
              </Typography>
              <Button variant="outlined" color="blue-gray" size="sm">
                Upload Photo
              </Button>
              <Typography
                variant="small"
                className="font-medium text-base text-blue-gray-700"
              >
                Cover Photo:
              </Typography>
              <Button variant="outlined" color="blue-gray" size="sm">
                Upload Photo
              </Button>
            </div>
          </div>
          <div className="col-span-3 pb-4">
            <div className="flex flex-col items-start justify-between w-full gap-6">
              <Typography
                variant="h6"
                className="font-sans text-lg text-blue-gray-700 mb-2"
              >
                Request Change Info
              </Typography>
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
              <Input
                type="text"
                label="Occupation"
                value={editedUser.occupation}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, occupation: e.target.value })
                }
              />

              <Input label="Street" value={street} />
              <div className="flex items-center gap-2">
                <InputSelect
                  label="Region"
                  value={selectedRegionCode || userDetails.region}
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
                  value={selectedProvinceCode || userDetails.province}
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
                  value={selectedMunicipalityCode || userDetails.municipality}
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
                  value={selectedBarangayCode || userDetails.barangay}
                  options={dynamicBarangayOptions}
                  onSelect={handleBarangaySelect}
                  isSearchable
                  required
                  placeholder="Barangay"
                />
              </div>
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter>
        <Button variant="gradient" color="red" onClick={handleEditUser}>
          <span>Update</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
