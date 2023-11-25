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
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";

const TABLE_HEAD = ["ID", "First Name", "Middle Name", "Last Name"];

export function BledByCrud() {
  const [bledBy, setBledBy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBledBy = async () => {
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(`${laravelBaseUrl}/api/get-bled-by`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBledBy(response.data.data);
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.error("Error fetching bledby:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBledBy();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBledBy = bledBy.filter(
    ({ first_name, middle_name, last_name }) =>
      first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      middle_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Card id="bled" className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Bled By
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are the list of bled by
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
        <div className="flex justify-end w-full">
          <AddBledByModal refreshData={fetchBledBy} />
        </div>
      </CardHeader>
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
            {filteredBledBy.map(
              ({ bled_by_id, first_name, middle_name, last_name }, index) => (
                <tr
                  key={bled_by_id}
                  className={index % 2 === 0 ? "even:bg-blue-gray-50/50" : ""}
                >
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold"
                    >
                      {bled_by_id}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {first_name}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {middle_name}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {last_name}
                    </Typography>
                  </td>
                  <td className="p-4 flex gap-3">
                    <EditModal
                      bledById={bled_by_id}
                      firstName={first_name}
                      middleName={middle_name}
                      lastName={last_name}
                      refreshData={fetchBledBy}
                    />
                    <DeleteModal
                      bledById={bled_by_id}
                      refreshData={fetchBledBy}
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

export function AddBledByModal({ refreshData }) {
  const [open, setOpen] = useState(false);
  const [newBledBy, setNewBledBy] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleConfirm = async () => {
    try {
      // Make an API call to add a new BledBy
      const response = await axios.post(
        `${laravelBaseUrl}/api/add-bled-by`,
        newBledBy,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      if (response == "success") {
        // Notify the parent component that the add operation is complete
        refreshData();
        setOpen(false);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error adding BledBy:", error);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
      <Tooltip content="Add Bled By">
        <Button
          size="sm"
          onClick={handleOpen}
          variant="text"
          className="flex items-center gap-2 bg-green-400"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Bled By</span>
        </Button>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>Add BledBy</DialogHeader>
        {errorMessage && (
          <div className="bg-red-100 border text-center border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        <DialogBody>
          <div className="space-y-4">
            {/* Input field for first name */}
            <Input
              label="First Name"
              value={newBledBy.first_name}
              onChange={(e) =>
                setNewBledBy({ ...newBledBy, first_name: e.target.value })
              }
            />

            {/* Input field for middle name */}
            <Input
              label="Middle Name"
              value={newBledBy.middle_name}
              onChange={(e) =>
                setNewBledBy({ ...newBledBy, middle_name: e.target.value })
              }
            />

            {/* Input field for last name */}
            <Input
              label="Last Name"
              value={newBledBy.last_name}
              onChange={(e) =>
                setNewBledBy({ ...newBledBy, last_name: e.target.value })
              }
            />
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

export function EditModal({
  bledById,
  firstName,
  middleName,
  lastName,
  refreshData,
}) {
  const [open, setOpen] = useState(false);
  const [editedBledBy, setEditedBledBy] = useState({
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleConfirm = async () => {
    try {
      // Make an API call to update the bledBy
      const response = await axios.post(
        `${laravelBaseUrl}/api/edit-bled-by?bled_by_id=${bledById}`,
        editedBledBy, // Fix: Change from `editedVenue` to `editedBledBy`
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      if (response.data.status == "success") {
        // Notify the parent component that the edit is complete
        refreshData();

        // Close the modal
        setOpen(false);
      } else {
        setErrorMessage(response.data.message);
      }

    } catch (error) {
      console.error("Error updating bledBy:", error);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} variant="text">
        <PencilIcon className="h-5 w-5 text-blue-600" />
      </IconButton>
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>Edit BledBy</DialogHeader>
        {errorMessage && (
          <div className="bg-red-100 border text-center border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        <DialogBody>
          <div className="space-y-4">
            {/* Input field for first name */}
            <Input
              label="First Name"
              value={editedBledBy.first_name}
              onChange={(e) =>
                setEditedBledBy({ ...editedBledBy, first_name: e.target.value })
              }
            />

            {/* Input field for middle name */}
            <Input
              label="Middle Name"
              value={editedBledBy.middle_name}
              onChange={(e) =>
                setEditedBledBy({
                  ...editedBledBy,
                  middle_name: e.target.value,
                })
              }
            />

            {/* Input field for last name */}
            <Input
              label="Last Name"
              value={editedBledBy.last_name}
              onChange={(e) =>
                setEditedBledBy({ ...editedBledBy, last_name: e.target.value })
              }
            />
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

export function DeleteModal({ bledById, refreshData }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleConfirm = async () => {
    try {
      // Make an API call to delete the hospital
      await axios.delete(
        `${laravelBaseUrl}/api/delete-bled-by?bled_by_id=${bledById}`,
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
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Delete Bled By</DialogHeader>
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
