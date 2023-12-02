import { laravelBaseUrl } from "@/app/variables";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
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
  Tooltip,
  Typography
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";

const TABLE_HEAD = ["ID", "Venue", "Location"];

export function VenueCrud() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchVenues = async () => {
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(`${laravelBaseUrl}/api/get-venue`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        setVenues(response.data.data);
        setLoading(false);
      }else{
        setErrorMessage(response.data.message);
      }
     
    } catch (error) {
      console.error("Error fetching venues:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredVenues = venues.filter(
    ({ venues_desc, venue_address }) =>
      venues_desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Card id="venue" className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Venues
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are the list of venues
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
          <AddModal refreshData={fetchVenues} />
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
            {filteredVenues.map(
              ({ venues_id, venues_desc, venue_address }, index) => (
                <tr
                  key={venues_id}
                  className={index % 2 === 0 ? "bg-blue-gray-50/50" : ""}
                >
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold"
                    >
                      {venues_id}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {venues_desc}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {venue_address || "-"}
                    </Typography>
                  </td>
                  <td className="p-4 flex gap-3">
                    {/* Pass venue details to EditModal */}
                    <EditModal
                      venueId={venues_id}
                      venueDesc={venues_desc}
                      venueAddress={venue_address}
                      refreshData={fetchVenues}
                    />
                    <DeleteModal
                      venueId={venues_id}
                      refreshData={fetchVenues}
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

export function AddModal({ refreshData }) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [newVenue, setNewVenue] = useState({
    venues_desc: "",
    venue_address: "",
  });

  const handleOpen = () => {
    setOpen(true);
    setErrorMessage(""); // Clear general error messages when opening the modal
    setFieldErrors({}); // Clear field-specific error messages
  };

  const handleConfirm = async () => {
    try {
      // Make an API call to add a new venue
      const response = await axios.post(
        `${laravelBaseUrl}/api/add-venue`,
        newVenue,
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
        setErrorMessage(response.data.message || "An error occurred.");

        if (response.data.errors) {
          // Set field-specific error messages
          setFieldErrors(response.data.errors);
        }
      }
    } catch (error) {
      console.error("Error adding venue:", error.response.data);
      setErrorMessage("An error occurred while adding the venue.");

      if (error.response.data.errors) {
        // Set field-specific error messages
        setFieldErrors(error.response.data.errors);
      }
    }
  };

  return (
    <>
      <Tooltip content="Add Users">
        <Button
          variant="gradient"
          color="blue"
          size="sm"
          onClick={handleOpen}
          className="flex items-center gap-3"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Venue</span>
        </Button>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>Add Venue</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {/* Input field for venue description */}
            <Input
              label="Venue Description"
              value={newVenue.venues_desc}
              onChange={(e) =>
                setNewVenue({ ...newVenue, venues_desc: e.target.value })
              }
            />

            {/* Display field-specific error message for venues_desc */}
            {fieldErrors.venues_desc && (
              <div className="text-red-500">{fieldErrors.venues_desc[0]}</div>
            )}

            {/* Input field for venue address */}
            <Input
              label="Venue Address"
              value={newVenue.venue_address}
              onChange={(e) =>
                setNewVenue({ ...newVenue, venue_address: e.target.value })
              }
            />

            {/* Display field-specific error message for venue_address */}
            {fieldErrors.venue_address && (
              <div className="text-red-500">{fieldErrors.venue_address[0]}</div>
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




export function EditModal({ venueId, venueDesc, venueAddress, refreshData }) {
  const [open, setOpen] = useState(false);
  const [editedVenue, setEditedVenue] = useState({
    venues_desc: venueDesc,
    venue_address: venueAddress,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleOpen = () => {
    setOpen(true);
    setFieldErrors({}); // Clear field-specific error messages when opening the modal
  };

  const handleConfirm = async () => {
    try {
      // Make an API call to update the venue
      const response = await axios.post(
        `${laravelBaseUrl}/api/edit-venue?venues_id=${venueId}`,
        editedVenue,
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
      console.error("Error updating venue:", error.response.data);

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
        <DialogHeader>Edit Venue</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {/* Input field for venue description */}
            <Input
              label="Venue Description"
              value={editedVenue.venues_desc}
              onChange={(e) =>
                setEditedVenue({ ...editedVenue, venues_desc: e.target.value })
              }
            />

            {/* Display field-specific error message for venues_desc */}
            {fieldErrors.venues_desc && (
              <div className="text-red-500">{fieldErrors.venues_desc[0]}</div>
            )}

            {/* Input field for venue address */}
            <Input
              label="Venue Address"
              value={editedVenue.venue_address}
              onChange={(e) =>
                setEditedVenue({
                  ...editedVenue,
                  venue_address: e.target.value,
                })
              }
            />

            {/* Display field-specific error message for venue_address */}
            {fieldErrors.venue_address && (
              <div className="text-red-500">{fieldErrors.venue_address[0]}</div>
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


export function DeleteModal({ venueId, refreshData }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleConfirm = async () => {
    try {
      // Make an API call to update the venue
      const response = await axios.delete(
        `${laravelBaseUrl}/api/delete-venue?venues_id=${venueId}`,
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
        console.error("Error updating venue:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating venue:", error);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} variant="text">
        <TrashIcon className="h-5 w-5 text-red-600" />
      </IconButton>
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>Delete Venue</DialogHeader>
        <DialogBody>Are you sure you want to delete this venue?</DialogBody>
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
