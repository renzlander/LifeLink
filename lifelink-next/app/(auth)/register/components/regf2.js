import {
  Card,
  Input,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { laravelBaseUrl } from "@/app/variables";

export function RegF2() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [address, setAddress] = useState("");
  const [street, setStreet] = useState("");
  const [subdivision, setSubdivision] = useState("");

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

    return (
      <Card className='mt-6 flex justify-center items-center' color="transparent" shadow={false}>
          <Typography variant="h4" className="mt-2" color="blue-gray">
              Enter your personal details
          </Typography>
          <Typography variant="paragraph" className="mt-2" color="blue-gray">
              Some details will not be displayed in your profile.
          </Typography>

          <form className="mt-8 mb-2 max-w-screen-lg sm:w-full">
              <div className="mb-4 flex gap-6 lg:flex-row sm:flex-col">
                <Input size="lg" label="First Name" required />
                <Input size="lg" label="Middle Name" required />
                <Input size="lg" label="Last Name" required />
              </div>
              <div className="mb-4 flex grow gap-6">
                <Select label="Sex" required>
                  <Option>Male</Option>
                  <Option>Female</Option>
                </Select>
                <Select label="Blood Type" required>
                  <Option>AB+</Option>
                  <Option>AB-</Option>
                  <Option>A+</Option>
                  <Option>A-</Option>
                  <Option>B+</Option>
                  <Option>B-</Option>
                  <Option>O+</Option>
                  <Option>O-</Option>
                </Select>
              </div>
              <div className="mb-4 w-full flex flex-wrap gap-6">
                <Input size="lg" label="Street" required />
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
                <Select label="Barangay" required>
                  <Option>Parada</Option>
                </Select>
              </div>
          </form>

      </Card>
    );
  }