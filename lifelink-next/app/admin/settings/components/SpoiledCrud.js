import { laravelBaseUrl } from "@/app/variables";
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
import axios from "axios";
import { useEffect, useState } from "react";

const TABLE_HEAD = ["ID", "Remarks"];

export function SpoiledRemarksCrud() {
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRemarks = async () => {
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${laravelBaseUrl}/api/get-spoiled-remarks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRemarks(response.data.data);
    } catch (error) {
      console.error("Error fetching spoiled remarks:", error);
    } finally {
      setLoading(false); // Set loading to false whether the request was successful or not
    }
  };

  useEffect(() => {
    fetchRemarks();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSpoiledRemarks = remarks.filter(({ spoiled_remarks_desc }) =>
  spoiled_remarks_desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Card id="spoiled-remarks" className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              
              Spoiled Remarks
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are the list of spoiled remarks
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
      <div className="flex justify-end w-full">
          <AddSpoiledRemarksModal refreshData={fetchRemarks} />
        </div>
      <CardBody className="px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
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
            {filteredSpoiledRemarks.map(
              ({ spoiled_remarks_id, spoiled_remarks_desc }, index) => (
                <tr
                  key={spoiled_remarks_id}
                  className={index % 2 === 0 ? "even:bg-blue-gray-50/50" : ""}
                >
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold"
                    >
                      {spoiled_remarks_id}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {spoiled_remarks_desc}
                    </Typography>
                  </td>
                  <td className="p-4 flex gap-3">
                    {/* Pass reactive remarks details to EditModal */}
                    <EditModal
                      remarkId={spoiled_remarks_id}
                      remarkDesc={spoiled_remarks_desc}
                      refreshData={fetchRemarks}
                    />
                    <DeleteModal
                      remarkId={spoiled_remarks_id}
                      refreshData={fetchRemarks}
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


export function AddSpoiledRemarksModal({ refreshData }) {
  const [open, setOpen] = useState(false);
  const [newSpoiledRemarks, setNewSpoiledRemarks] = useState({
    spoiled_remarks_desc: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleOpen = () => {
    setOpen(true);
    setFieldErrors({}); // Clear field-specific error messages when opening the modal
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      // Make an API call to add a new spoiled remarks
      const response = await axios.post(
        `${laravelBaseUrl}/api/add-spoiled-remarks`,
        newSpoiledRemarks,
        {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`,
          },
        }
      );

      if (response.data.status === 'success') {
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
      console.error('Error adding spoiled remarks:', error.response.data);

      if (error.response.data.errors) {
        // Set field-specific error messages
        setFieldErrors(error.response.data.errors);
      }
    }
  };

  return (
    <>
      <Tooltip content="Add Remarks">
        <Button
          size="sm"
          onClick={handleOpen}
          variant="text"
          className="flex items-center gap-2 bg-green-400"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Remarks</span>
        </Button>
      </Tooltip>
      <Dialog open={open} handler={handleClose}>
        <DialogHeader>Add Spoiled Remarks</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {/* Input field for spoiled remarks description */}
            <Input
              label="Spoiled Remarks Description"
              value={newSpoiledRemarks.spoiled_remarks_desc}
              onChange={(e) =>
                setNewSpoiledRemarks({
                  ...newSpoiledRemarks,
                  spoiled_remarks_desc: e.target.value,
                })
              }
            />
            {/* Display field-specific error message for spoiled_remarks_desc */}
            {fieldErrors.spoiled_remarks_desc && (
              <div className="text-red-500">{fieldErrors.spoiled_remarks_desc[0]}</div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleClose}
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


export function EditModal({ remarkId, remarkDesc, refreshData }) {
  const [open, setOpen] = useState(false);
  const [editedSpoiledRemarks, setEditedSpoiledRemarks] = useState({
    spoiled_remarks_desc: remarkDesc,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleOpen = () => {
    setOpen(true);
    setFieldErrors({}); // Clear field-specific error messages when opening the modal
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      // Make an API call to update the spoiled remarks
      const response = await axios.post(
        `${laravelBaseUrl}/api/edit-spoiled-remarks?spoiled_remarks_id=${remarkId}`,
        editedSpoiledRemarks,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      if (response.data.status === 'success') {
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
      console.error('Error updating spoiled remarks:', error.response.data);

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
      <Dialog open={open} handler={handleClose}>
        <DialogHeader>Edit Spoiled Remarks</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {/* Input field for spoiled remarks description */}
            <Input
              label="Spoiled Remarks Description"
              value={editedSpoiledRemarks.spoiled_remarks_desc}
              onChange={(e) =>
                setEditedSpoiledRemarks({
                  ...editedSpoiledRemarks,
                  spoiled_remarks_desc: e.target.value,
                })
              }
            />
            {/* Display field-specific error message for spoiled_remarks_desc */}
            {fieldErrors.spoiled_remarks_desc && (
              <div className="text-red-500">{fieldErrors.spoiled_remarks_desc[0]}</div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleClose}
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



export function DeleteModal({ remarkId, refreshData }) {
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => setOpen(!open);

  const handleConfirm = async () => {
    try {
      // Make an API call to update the venue
      const response = await axios.delete(
        `${laravelBaseUrl}/api/delete-spoiled-remarks?spoiled_remarks_id=${remarkId}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        refreshData();
        setOpen(false);
      } else {
        console.error("Error updating spoiled remarks:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating spoiled remarks:", error);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} variant="text">
        <TrashIcon className="h-5 w-5 text-red-600" />
      </IconButton>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Delete Spoiled Remarks</DialogHeader>
        <DialogBody>Are you sure you want to delete this spoiled remarks?</DialogBody>
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