import {
  Card,
  Input,
  Select,
  Option,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { laravelBaseUrl } from "@/app/variables";
import { Button } from "@mui/material";

export function RegF2() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [sex, setSex] = useState("");
  const [blood_type, setBlood] = useState("");
  const [street, setStreet] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const bloodTypes = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

  const dob = '2002-02-08';
  const occupation = 'jabolero';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${laravelBaseUrl}/api/auth/register-step2`, {
        user_id: 3,
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
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

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
          <input type="hidden" value={occupation} name="occupation"/>
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
                <Select 
                  label="Sex" 
                  required 
                  value={sex} 
                  onChange={(e) => setSex(e?.target?.value ?? "")}
                >
                  <Option value="1">Male</Option>
                  <Option value="2">Female</Option>
                </Select>
                <Select 
                  label="Blood Type" 
                  required
                  value={blood_type}
                  onChange={(e) => setBlood(e?.target?.value ?? "")}
                >
                  {bloodTypes.map((type) => (
                    <Option key={type}>{type}</Option>
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
                        onClick={() => {
                          setSelectedRegion({
                            regionName: region?.regDesc,
                            regCode: region?.regCode,
                          });
                        }}
                        key={region.id} 
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
                      onClick={() => {
                        setSelectedProvince({
                          provinceName: province?.provDesc,
                          provCode: province?.provCode,
                          id: province?.id,
                        });
                      }}
                      key={province.id}
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
                  label="Postal Code"
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
              <Button type="submit">Submit</Button>
          </form>

      </Card>
    );
  }