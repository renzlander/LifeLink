import React, { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Select,
  Option,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

export function RegF2({onNextStep}) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [sex, setSex] = useState("");
  const [blood_type, setBlood] = useState("");
  const [street, setStreet] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [occupation, setOccupation] = useState("");
  const [dob, setDob] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ dob: []});

  const bloodTypes = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

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
    axios.get(`${laravelBaseUrl}/api/address/get-regions`)
      .then((data) => {
        console.log(data.data);
        setRegionList(data.data);
      });
  }, []);
  
  useEffect(() => {
    if (selectedRegion?.regCode) {
     
        axios.post(`${laravelBaseUrl}/api/address/get-provinces?regCode=${selectedRegion?.regCode}`,)
          .then((data) => {
            console.log(data.data);
            setProvinceList(data.data);
          });
  
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedProvince?.provCode) {
      axios.post(`${laravelBaseUrl}/api/address/get-municipalities?provCode=${selectedProvince?.provCode}`)
        .then((data) => {
          console.log(data.data);
          setMunicipalityList(data.data);
        });
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedMunicipality?.citymunCode) {
      axios.post(`${laravelBaseUrl}/api/address/get-barangays?citymunCode=${selectedMunicipality?.citymunCode}`)
        .then((data) => {
          console.log(data.data);
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
    console.log('sex',sex);
    try {
      const user_id = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_id='))
        .split('=')[1];
  
      const response = await axios.post(`${laravelBaseUrl}/api/auth/register-step2`, {
        user_id,
        first_name,
        middle_name,
        last_name,
        sex,
        dob,
        occupation,
        blood_type,
        street,
        region: selectedRegion?.regionName,
        province: selectedProvince?.provinceName,
        municipality: selectedMunicipality?.municipalityName,
        barangay: selectedBarangay?.barangayName,
        postalcode,
      });
      
      if (response.data.status === 'success') {
        document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        onNextStep();

      }
      console.log(response);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        const dobErrors = errors.dob || [];
        setErrorMessage({ dob: dobErrors });
      } else {
        setErrorMessage({ dob: [error.message] });
      }
    }
  };

  const isFormValid =
  first_name !== "" &&
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


    return (
      <Card className='mt-6 flex justify-center items-center' color="transparent" shadow={false}>
          <Typography variant="h4" className="mt-2" color="blue-gray">
              Enter your personal details
          </Typography>
          <Typography variant="paragraph" className="mt-2" color="blue-gray">
              Some details will not be displayed in your profile.
          </Typography>

          <form 
            onSubmit={handleSubmit}
            className="mt-8 mb-2 max-w-screen-lg sm:w-full"
          >
          <input type="hidden" value={dob} name="dob"/>
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
              <div className={`relative ${errorMessage.dob.length > 0 ? "mb-1" : ""}`}>
                <Input 
                  type='date'
                  size="lg"
                  label="Birthdate" 
                  required 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)} 
                  className={`w-full ${errorMessage.dob.length > 0 ? "border-red-500" : ""}`}
                />
                {errorMessage.dob.length > 0 && (
                  <div className="error-message text-red-600 text-sm">
                    {errorMessage.dob[0]}
                  </div>
                )}
                </div>
              </div>
              <div className="mb-4 flex grow gap-6">
              <Select onChange={handleSexChange} label="Sex" value={sex} required>
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
                
               <Select onChange={handleBloodChange} label="Blood Type" value={blood_type} required>
                {bloodTypes.map((blood) => (
                  <Option key={blood} value={blood}>
                    {blood}
                  </Option>
                ))}
              </Select>
              </div>
              
              <div className="mb-4 flex grow gap-6">
                <Select 
                  label="Region" 
                  required
                  name={selectedRegion?.regionName}
                  >
                    {regionList?.map((region) => (
  <Option
    key={region.id} // Add a unique key prop here
    onClick={() => {
      setSelectedRegion({
        regionName: region?.regDesc,
        regCode: region?.regCode,
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
                      onClick={() => {
                        setSelectedMunicipality({
                          municipalityName: municipality?.citymunDesc,
                          citymunCode: municipality?.citymunCode,
                        });
                      }}
                      key={`city${municipality?.citymunCode}`}
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
                      onClick={() => {
                        setSelectedBarangay({
                          barangayName: barangay?.brgyDesc,
                        });
                      }}
                      key={`brngy${barangay.id}`}
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
              <div className="mb-4 flex justify-center grow gap-6">
              <Checkbox
                label={
                  <Typography variant="body2" color="textSecondary">
                    I agree to the{" "}
                    <a href="#" className="font-medium text-red-600 hover:text-red-800">
                      Terms and Conditions
                    </a>
                  </Typography>
                }
                checked={isChecked}
                onChange={(event) => setIsChecked(event.target.checked)}
              />
              </div>
              <div className="flex justify-center">
                <Button type="submit" variant="contained" className='w-full' disabled={!isChecked || !isFormValid} >NEXT</Button>
              </div>
          </form>

      </Card>
    );
  }