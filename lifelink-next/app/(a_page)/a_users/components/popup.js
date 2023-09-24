import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Tooltip,
  IconButton,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  TrashIcon,
  PencilIcon, 
} from "@heroicons/react/24/solid";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { Typography } from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";

export function AddBloodBagPopup({ user_id, handleOpen }) {
  const [open, setOpen] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [bledBy, setBledBy] = useState("");
  const [venue, setVenue] = useState("");
  const [dateDonated, setDateDonated] = useState("");
  const [errorMessage, setErrorMessage] = useState({ serial_no: [], date_donated: [], bled_by: [],  venue: [] });
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");

  const handleAddBloodBag = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }
  
      // Prepare data for the POST request
      const data = {
        user_id,
        serial_no: serialNumber,
        venue: venue,
        date_donated: dateDonated,
        bled_by: bledBy,
      };
      console.log("Before Axios POST request");

      // Send POST request to add-bloodbag API
      const response = await axios.post(
        `${laravelBaseUrl}/api/add-bloodbag`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).catch((error) => {
        setGeneralErrorMessage(error.response.data.message);
      });
    
      if (response.data.status === "success") {
        // Blood bag added successfully, you can handle this accordingly
        console.log("Blood bag added successfully");
      }  else if (response.data.status === "error") {
        if (response.data.message) {
          setGeneralErrorMessage(response.data.message);
        } else {
          console.error("Unknown error occurred:", response.data);
        }
      }
      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error("Unknown error occurred:", error);
    }
  };
  

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} variant="gradient" color="red">
        + Add Blood Bag
      </Button>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Add Blood Bag</DialogHeader>
        {generalErrorMessage && (
          <div className="mt-4 text-center bg-red-100 p-2 rounded-lg">
            <Typography color="red" className="text-sm font-semibold">
              {generalErrorMessage}
            </Typography>
          </div>
        )}

        <DialogBody divider className="flex flex-col gap-6">
          <div className={`relative ${errorMessage.serial_no.length > 0 ? "mb-1" : ""}`}>
            <Input
              label="Serial Number"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
            {errorMessage.serial_no.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.serial_no[0]}
              </div>
            )}
        </div>
          <div className={`relative ${errorMessage.bled_by.length > 0 ? "mb-1" : ""}`}>
            <Input
              label="Bled by"
              value={bledBy}
              onChange={(e) => setBledBy(e.target.value)}
            />
            {errorMessage.bled_by.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.bled_by[0]}
              </div>
            )}
        </div>
          <div className={`relative ${errorMessage.venue.length > 0 ? "mb-1" : ""}`}>
            <Input
              label="Venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
            {errorMessage.venue.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.venue[0]}
              </div>
            )}
        </div>
          <div className={`relative ${errorMessage.date_donated.length > 0 ? "mb-1" : ""}`}>
            <Input
              type="date"
              label="Date"
              value={dateDonated}
              onChange={(e) => setDateDonated(e.target.value)}
            />
            {errorMessage.date_donated.length > 0 && (
              <div className="error-message text-red-600 text-sm">
                {errorMessage.date_donated[0]}
              </div>
            )}
        </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpen(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red" onClick={handleAddBloodBag}>
            <span>Add</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export function EditPopUp({ user, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const bloodTypes = ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'];
  const [errorMessage, setErrorMessage] = useState('');

  const [regionList, setRegionList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [provinceList, setProvinceList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [municipalityList, setMunicipalityList] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [barangayList, setBarangayList] = useState([]);
  const [selectedBarangay, setSelectedBarangay] = useState('');

  useEffect(() => {
    // Fetch region data
    axios.get(`${laravelBaseUrl}/api/address/get-regions`)
      .then((response) => {
        setRegionList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching regions:', error);
      });
  }, []);

  useEffect(() => {
    setSelectedRegion(user.region || '');
    setSelectedProvince(user.province || '');
    setSelectedMunicipality(user.municipality || '');
    setSelectedBarangay(user.barangay || '');
  }, [user]);

  useEffect(() => {
    // Fetch province data based on the selected region
    if (selectedRegion) {
      const apiUrl = `${laravelBaseUrl}/api/address/get-provinces?regCode=${selectedRegion}`;
      
      axios.post(apiUrl)
        .then((response) => {
          setProvinceList(response.data);
        })
        .catch((error) => {
          console.error('Error fetching provinces:', error);
        });
    }
  }, [selectedRegion]);

  useEffect(() => {
    // Fetch municipality data based on the selected province
    if (selectedProvince) {
      axios.post(`${laravelBaseUrl}/api/address/get-municipalities?provCode=${selectedProvince}`)
        .then((response) => {
          setMunicipalityList(response.data);
        })
        .catch((error) => {
          console.error('Error fetching municipalities:', error);
        });
    }
  }, [selectedProvince]);

  useEffect(() => {
    // Fetch barangay data based on the selected municipality
    if (selectedMunicipality) {
      axios.post(`${laravelBaseUrl}/api/address/get-barangays?citymunCode=${selectedMunicipality}`)
        .then((response) => {
          setBarangayList(response.data);
        })
        .catch((error) => {
          console.error('Error fetching barangays:', error);
        });
    }
  }, [selectedMunicipality]);

  useEffect(() => {
    // Initialize the selected values with user data when the component mounts
    setSelectedRegion(editedUser.region);
    setSelectedProvince(editedUser.province);
    setSelectedMunicipality(editedUser.municipality);
    setSelectedBarangay(editedUser.barangay);
  }, [editedUser]);

  const handleEditUser = async () => {
    try {
      // Prepare data for the PUT request
      const data = {
        ...editedUser,
        user_id: user.user_id, 
        region: selectedRegion,
        province: selectedProvince,
        municipality: selectedMunicipality,
        barangay: selectedBarangay,
      };
  
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }
      // Send PUT request to update-user API
      const response = await axios.put(`${laravelBaseUrl}/api/edit-profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        // User data updated successfully
        window.location.reload();
        console.log('User data updated successfully');

        // Notify the parent component about the update
        onUpdate({ ...editedUser, ...data }); // Merge the edited data with the response data

        // Close the dialog
        setOpen(false);
      } else {
        console.error('Error updating user data:', response.data.message);
        // Display an error message to the user
        // You can set up a state variable to manage error messages and display them in your UI
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      // Display an error message to the user
      // You can set up a state variable to manage error messages and display them in your UI
    }
  };
  
  return (
    <>
      <Tooltip content="Edit User">
        <IconButton variant="text" onClick={() => setOpen(true)}>
          <PencilIcon className="h-4 w-4" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Edit User</DialogHeader>
        <DialogBody divider className="flex flex-col gap-6">
          <Input
            type="text"
            label="First Name"
            value={editedUser.first_name}
            onChange={(e) => setEditedUser({ ...editedUser, first_name: e.target.value })}
          />
          <Input
            type="text"
            label="Middle Name"
            value={editedUser.middle_name}
            onChange={(e) => setEditedUser({ ...editedUser, middle_name: e.target.value })}
          />
          <Input
            type="text"
            label="Last Name"
            value={editedUser.last_name}
            onChange={(e) => setEditedUser({ ...editedUser, last_name: e.target.value })}
          />
          <Input
            type="text"
            label="Email"
            value={editedUser.email}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
          />
          <Input
            type="text"
            label="Mobile"
            value={editedUser.mobile}
            onChange={(e) => setEditedUser({ ...editedUser, mobile: e.target.value })}
          />
          <Select
            label="Sex"
            value={editedUser.sex} // Assuming `editedUser.sex` contains the user's sex
            onChange={(value) => setEditedUser({ ...editedUser, sex: value })}
          >
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
          <Input
            type="date"
            label="Date of Birth"
            value={editedUser.dob}
            onChange={(e) => setEditedUser({ ...editedUser, dob: e.target.value })}
          />
          <Select
            label="Blood Type"
            value={editedUser.blood_type}
            onChange={(value) => setEditedUser({ ...editedUser, blood_type: value })}
            >
              {bloodTypes.map(type => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
            <Input
              type="text"
              label="Street"
              value={editedUser.street}
              onChange={(e) => setEditedUser({ ...editedUser, street: e.target.value })}
            />
            <Select
              label="Region"
              value={selectedRegion}
              onChange={(value) => setSelectedRegion(value)}
            >
              {regionList.map((region) => (
                <Option
                  key={region.regCode}
                  value={region.regCode}
                >
                  {region.regDesc}
                </Option>
              ))}
            </Select>
            <Select
              label="Province"
              value={selectedProvince}
              onChange={(value) => setSelectedProvince(value)}
            >
              {provinceList.map((province) => (
                <Option
                  key={province.provCode}
                  value={province.provCode}
                >
                  {province.provDesc}
                </Option>
              ))}
            </Select>
            <Select
              label="Municipality"
              value={selectedMunicipality}
              onChange={(value) => setSelectedMunicipality(value)}
            >
              {municipalityList.map((municipality) => (
                <Option
                  key={municipality.citymunCode}
                  value={municipality.citymunCode}
                >
                  {municipality.citymunDesc}
                </Option>
              ))}
            </Select>
            <Select
              label="Barangay"
              value={selectedBarangay}
              onChange={(value) => setSelectedBarangay(value)}
            >
              {barangayList.map((barangay) => (
                <Option
                  key={barangay.brgyCode}
                  value={barangay.brgyCode}
                >
                  {barangay.brgyDesc}
                </Option>
              ))}
            </Select>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="gradient"
              onClick={() => setOpen(false)}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="red" onClick={handleEditUser}>
              <span>Done</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  }
  

export function ViewPopUp({user}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip content="View User">
        <IconButton variant="text" onClick={() => setOpen(true)}>
          <EyeIcon className="h-4 w-4" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>View User</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4">
          <Typography className="font-bold">
            NAME:
          </Typography>
          <div className="flex gap-10">
            <Typography>
              <strong>First Name:</strong> {user.first_name}
            </Typography>
            <Typography>
              <strong>Last Name:</strong> {user.last_name}
            </Typography>
          </div>
          <Typography className="font-bold">
            DONOR INFO:
          </Typography>
          <div className="flex gap-10">
            <Typography>
              <strong>Number of Donation:</strong> {user.donate_qty}
            </Typography>
            <Typography>
              <strong>Badge:</strong> {user.badge}
            </Typography>
          </div>
          <Typography className="font-bold">
            CONTACT INFO:
          </Typography>
          <div className="flex gap-10">
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography>
              <strong>Mobile:</strong> {user.mobile}
            </Typography>
          </div>
          <Typography className="font-bold">
            OTHER INFO:
          </Typography>
          <div className="flex gap-10">
            <Typography>
              <strong>Sex:</strong> {user.sex}
            </Typography>
            <Typography>
              <strong>Date of Birth:</strong> {user.dob}
            </Typography>
            <Typography>
              <strong>Blood Type:</strong> {user.blood_type}
            </Typography>
          </div>
          <Typography className="font-bold">
            ADDRESS:
          </Typography>
          <div className="flex gap-10">
            <Typography>
              <strong>Street:</strong> {user.street}
            </Typography>
            <Typography>
              <strong>Barangay:</strong> {user.barangay}
            </Typography>
            <Typography>
              <strong>Municipality:</strong> {user.municipality}
            </Typography>
          </div>
          <div className="flex gap-10">
            <Typography>
              <strong>Region:</strong> {user.region}
            </Typography>
            <Typography>
              <strong>Province:</strong> {user.province}
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" onClick={() => setOpen(false)}>
            <span>Close</span>
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