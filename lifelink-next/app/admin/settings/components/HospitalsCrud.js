import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Typography,
  Tooltip
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { laravelBaseUrl } from "@/app/variables";

import axios from "axios";
const TABLE_HEAD = ["ID", "Venue", "Location"];

export function HospitalCrud() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHospitals = async () => {
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(`${laravelBaseUrl}/api/get-hospital`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHospitals(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredHospitals = hospitals.filter(
    ({ hospital_desc, hospital_address }) =>
      hospital_desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Card id="hospital" className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Hospitals
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are the list of hospitals
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <div className="flex justify-end w-full pr-4">
        <AddHospitalModal refreshData={fetchHospitals} />
      </div>
      <CardBody className="mt-4 p-0 h-96 overflow-y-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead className="sticky top-0 z-10">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Actions
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredHospitals.map(
              ({ hospitals_id, hospital_desc, hospital_address }, index) => (
                <tr
                  key={hospitals_id}
                  className={index % 2 === 0 ? "bg-blue-gray-50/50" : ""}
                >
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold"
                    >
                      {hospitals_id}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {hospital_desc}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {hospital_address || "-"}
                    </Typography>
                  </td>
                  <td className="p-4 flex gap-3">
                    <EditModal
                      hospitalId={hospitals_id}
                      hospitalDesc={hospital_desc}
                      hospitalAddress={hospital_address}
                      refreshData={fetchHospitals}
                    />

                    <DeleteModal
                      hospitalId={hospitals_id}
                      refreshData={fetchHospitals}
                    />
                  
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

export function AddHospitalModal({ refreshData }) {
  const [open, setOpen] = useState(false);
  const [newHospital, setNewHospital] = useState({
    hospital_desc: "",
    hospital_address: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleOpen = () => {
    setOpen(true);
    setFieldErrors({}); // Clear field-specific error messages when opening the modal
  };

  const handleConfirm = async () => {
    try {
      // Make an API call to add a new hospital
      const response = await axios.post(`${laravelBaseUrl}/api/add-hospital`, newHospital, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });

      if (response.data.status === "success") {
        // Notify the parent component that the add operation is complete
        refreshData();

        // Close the modal
        setOpen(false);
      } else {
        if (response.data.errors) {
          // Set field-specific error messages
          setFieldErrors(response.data.errors);
        }
      }
    } catch (error) {
      console.error("Error adding hospital:", error.response.data);

      if (error.response.data.errors) {
        // Set field-specific error messages
        setFieldErrors(error.response.data.errors);
      }
    }
  };

  return (
    <>
      <Tooltip content="Add Hospital">
        <Button
          variant="gradient"
          color="blue"
          size="sm"
          onClick={handleOpen}
          className="flex items-center gap-3"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Hospital</span>
        </Button>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>Add Hospital</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {/* Input field for hospital description */}
            <Input
              label="Hospital Description"
              value={newHospital.hospital_desc}
              onChange={(e) =>
                setNewHospital({ ...newHospital, hospital_desc: e.target.value })
              }
            />

            {/* Display field-specific error message for hospital_desc */}
            {fieldErrors.hospital_desc && (
              <div className="text-red-500">{fieldErrors.hospital_desc[0]}</div>
            )}

            {/* Input field for hospital address */}
            <Input
              label="Hospital Address"
              value={newHospital.hospital_address}
              onChange={(e) =>
                setNewHospital({ ...newHospital, hospital_address: e.target.value })
              }
            />

            {/* Display field-specific error message for hospital_address */}
            {fieldErrors.hospital_address && (
              <div className="text-red-500">{fieldErrors.hospital_address[0]}</div>
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
          <Button variant="gradient" color="green" onClick={handleConfirm}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}




export function EditModal({ hospitalId, hospitalDesc, hospitalAddress, refreshData }) {
  const [open, setOpen] = useState(false);
  const [editedHospital, setEditedHospital] = useState({
    hospital_desc: hospitalDesc,
    hospital_address: hospitalAddress,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleOpen = () => {
    setOpen(true);
    setFieldErrors({}); // Clear field-specific error messages when opening the modal
  };

  const handleConfirm = async () => {
    try {
      // Make an API call to update the hospital
      const response = await axios.post(
        `${laravelBaseUrl}/api/edit-hospital?hospitals_id=${hospitalId}`,
        editedHospital,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        // Notify the parent component that the edit is complete
        refreshData();

        // Close the modal
        setOpen(false);
      } else {
        if (response.data.errors) {
          // Set field-specific error messages
          setFieldErrors(response.data.errors);
        }
      }
    } catch (error) {
      console.error("Error updating hospital:", error.response.data);

      if (error.response.data.errors) {
        // Set field-specific error messages
        setFieldErrors(error.response.data.errors);
      }
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} variant="text">
        <PencilIcon className="h-5 w-5 text-blue-600" />
      </IconButton>
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>Edit Hospital</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {/* Input field for hospital description */}
            <Input
              label="Hospital Description"
              value={editedHospital.hospital_desc}
              onChange={(e) =>
                setEditedHospital({ ...editedHospital, hospital_desc: e.target.value })
              }
            />

            {/* Display field-specific error message for hospital_desc */}
            {fieldErrors.hospital_desc && (
              <div className="text-red-500">{fieldErrors.hospital_desc[0]}</div>
            )}

            {/* Input field for hospital address */}
            <Input
              label="Hospital Address"
              value={editedHospital.hospital_address}
              onChange={(e) =>
                setEditedHospital({
                  ...editedHospital,
                  hospital_address: e.target.value,
                })
              }
            />

            {/* Display field-specific error message for hospital_address */}
            {fieldErrors.hospital_address && (
              <div className="text-red-500">{fieldErrors.hospital_address[0]}</div>
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
          <Button variant="gradient" color="green" onClick={handleConfirm}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export function DeleteModal({ hospitalId, refreshData }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);


  const handleConfirm = async () => {
    try {
      // Make an API call to delete the hospital
      await axios.delete(
        `${laravelBaseUrl}/api/delete-hospital?hospitals_id=${hospitalId}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      // Notify the parent component that the delete is complete
      refreshData();

      // Close the modal
      handleClose();
    } catch (error) {
      console.error("Error deleting hospital:", error);
    }
  };

  return (
    <>
    <IconButton onClick={handleOpen} variant="text">
        <TrashIcon className="h-5 w-5 text-red-600" />
      </IconButton>
      <Dialog open={open} handler={() => setOpen(!open)}>
      <DialogHeader>Delete Hospital</DialogHeader>
      <DialogBody>Are you sure you want to delete this hospital?</DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={() => setOpen(false)}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleConfirm}>
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
