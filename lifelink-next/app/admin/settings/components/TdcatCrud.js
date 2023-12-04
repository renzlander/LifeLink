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
import { laravelBaseUrl } from "@/app/variables";

const TABLE_HEAD = ["ID", "Category", "Remarks"];


export function TDCatCrud() {
  const [temporaryCategory, setTemporaryCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTemporaryCategory = async () => {
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${laravelBaseUrl}/api/get-temporary-deferral-category`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTemporaryCategory(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching permanent categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemporaryCategory();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCategories = temporaryCategory.filter(({ category_desc, remarks }) =>
    category_desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    remarks.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Card id="tdcat" className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Temporary Deferral Category
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are the list of categories
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
        <AddTempoCategoriesModal refreshData={fetchTemporaryCategory} />
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
                  className="font-normal leading-none opacity-70 text-center"
                >
                  Actions
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map(
              ({ categories_id, category_desc, remarks }, index) => (
                <tr
                  key={categories_id}
                  className={index % 2 === 0 ? "bg-blue-gray-50/50" : ""}
                >
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold"
                    >
                      {categories_id}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {category_desc}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {remarks}
                    </Typography>
                  </td>
                  <td className="p-4 flex justify-center gap-3">
                    <EditModal
                      categoryId={categories_id}
                      categoryDesc={category_desc}
                      remarks={remarks}
                      refreshData={fetchTemporaryCategory}
                    />
                    <DeleteModal
                      categoryId={categories_id}
                      refreshData={fetchTemporaryCategory}
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

export function AddTempoCategoriesModal({ refreshData }) {
  const [open, setOpen] = useState(false);
  const [newTempCategory, setNewTempCategory] = useState({
    category_desc: '',
    remarks: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleOpen = () => {
    setOpen(true);
    setFieldErrors({}); // Clear field-specific error messages when opening the modal
  };

  const handleConfirm = async () => {
    try {
      // Make an API call to add a new temporary deferral category
      const response = await axios.post(
        `${laravelBaseUrl}/api/add-temporary-deferral-category`,
        newTempCategory,
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
      console.error('Error adding temporary deferral category:', error.response.data);

      if (error.response.data.errors) {
        // Set field-specific error messages
        setFieldErrors(error.response.data.errors);
      }
    }
  };

  return (
    <>
      <Tooltip content="Add Category">
        <Button
          variant="gradient"
          color="blue"
          size="sm"
          onClick={handleOpen}
          className="flex items-center gap-3"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Category</span>
        </Button>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>Add Temporary Deferral Category</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {/* Input field for category description */}
            <Input
              label="Category Description"
              value={newTempCategory.category_desc}
              onChange={(e) =>
                setNewTempCategory({
                  ...newTempCategory,
                  category_desc: e.target.value,
                })
              }
            />
            {/* Display field-specific error message for category_desc */}
            {fieldErrors.category_desc && (
              <div className="text-red-500">{fieldErrors.category_desc[0]}</div>
            )}

            {/* Input field for remarks */}
            <Input
              label="Remarks"
              value={newTempCategory.remarks}
              onChange={(e) =>
                setNewTempCategory({
                  ...newTempCategory,
                  remarks: e.target.value,
                })
              }
            />
            {/* Display field-specific error message for remarks */}
            {fieldErrors.remarks && (
              <div className="text-red-500">{fieldErrors.remarks[0]}</div>
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


export function EditModal({ categoryId, categoryDesc, remarks, refreshData }) {
  const [open, setOpen] = useState(false);
  const [editedTempCategory, setEditedTempCategory] = useState({
    category_desc: categoryDesc,
    remarks: remarks,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleOpen = () => {
    setOpen(true);
    setFieldErrors({}); // Clear field-specific error messages when opening the modal
  };

  const handleConfirm = async () => {
    try {
      // Make an API call to update the permanent deferral category
      const response = await axios.post(
        `${laravelBaseUrl}/api/edit-temporary-deferral-category?categories_id=${categoryId}`,
        editedTempCategory,
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
      console.error("Error updating permanent deferral category:", error.response.data);

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
        <DialogHeader>Edit Temporary Deferral Category</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {/* Input field for category description */}
            <Input
              label="Category Description"
              value={editedTempCategory.category_desc}
              onChange={(e) =>
                setEditedTempCategory({
                  ...editedTempCategory,
                  category_desc: e.target.value,
                })
              }
            />
            {/* Display field-specific error message for category_desc */}
            {fieldErrors.category_desc && (
              <div className="text-red-500">{fieldErrors.category_desc[0]}</div>
            )}

            {/* Input field for remarks */}
            <Input
              label="Remarks"
              value={editedTempCategory.remarks}
              onChange={(e) =>
                setEditedTempCategory({
                  ...editedTempCategory,
                  remarks: e.target.value,
                })
              }
            />
            {/* Display field-specific error message for remarks */}
            {fieldErrors.remarks && (
              <div className="text-red-500">{fieldErrors.remarks[0]}</div>
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


export function DeleteModal({ categoryId, refreshData }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleConfirm = async () => {
    try {
      // Make an API call to delete the permanent deferral category
      const response = await axios.delete(
        `${laravelBaseUrl}/api/delete-temporary-deferral-category?categories_id=${categoryId}`,
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
        console.error("Error deleting permanent deferral category:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting permanent deferral category:", error);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} variant="text">
        <TrashIcon className="h-5 w-5 text-red-600" />
      </IconButton>
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>Delete Temporary Deferral Category</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this temporary deferral category?
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

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
