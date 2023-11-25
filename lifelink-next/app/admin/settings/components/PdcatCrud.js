import { laravelBaseUrl } from "@/app/variables";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon,PlusIcon } from "@heroicons/react/24/solid";
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

const TABLE_HEAD = ["ID", "Categiry"];

export function PDCatCrud() {
  const [permanentCategory, setPermanentCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPermanentCategory = async () => {
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${laravelBaseUrl}/api/get-permanent-deferral-category`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPermanentCategory(response.data.data);
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.error("Error fetching permanent categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermanentCategory();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCategories = permanentCategory.filter(({ category_desc }) =>
    category_desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Card id="pdcat" className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Permanent Deferral Category
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
        <div className="flex justify-end w-full">
          <AddPermanentCategoryModal refreshData={fetchPermanentCategory} />
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
            {filteredCategories.map(
              ({ categories_id, category_desc }, index) => (
                <tr
                  key={categories_id}
                  className={index % 2 === 0 ? "even:bg-blue-gray-50/50" : ""}
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
                  <td className="p-4 flex gap-3">
                    {/* Pass category details to EditModal */}
                    <EditModal
                      categoryId={categories_id}
                      categoryDesc={category_desc}
                      refreshData={fetchPermanentCategory}
                    />
                    <DeleteModal
                      categoryId={categories_id}
                      refreshData={fetchPermanentCategory}
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

export function AddPermanentCategoryModal({ refreshData }) {
  const [open, setOpen] = useState(false);
  const [newPermaCategory, setNewPermaCategory] = useState({
    category_desc: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleOpen = () => {
    setOpen(true);
    setFieldErrors({}); // Clear field-specific error messages when opening the modal
  };

  const handleConfirm = async () => {
    try {
      // Make an API call to add a new permanent deferral category
      const response = await axios.post(
        `${laravelBaseUrl}/api/add-permanent-deferral-category`,
        newPermaCategory,
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
      console.error('Error adding permanent deferral category:', error.response.data);

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
          size="sm"
          onClick={handleOpen}
          variant="text"
          className="flex items-center gap-2 bg-green-400"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Category</span>
        </Button>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>Add Permanent Deferral Category</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {/* Input field for category description */}
            <Input
              label="Category Description"
              value={newPermaCategory.category_desc}
              onChange={(e) =>
                setNewPermaCategory({
                  ...newPermaCategory,
                  category_desc: e.target.value,
                })
              }
            />
            {/* Display field-specific error message for category_desc */}
            {fieldErrors.category_desc && (
              <div className="text-red-500">{fieldErrors.category_desc[0]}</div>
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


export function EditModal({ categoryId, categoryDesc, refreshData }) {
  const [open, setOpen] = useState(false);
  const [editedPermaCategory, setEditedPermaCategory] = useState({
    category_desc: categoryDesc,
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
        `${laravelBaseUrl}/api/edit-permanent-deferral-category?categories_id=${categoryId}`,
        editedPermaCategory,
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
        <DialogHeader>Edit Permanent Deferral Category</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {/* Input field for category description */}
            <Input
              label="Category Description"
              value={editedPermaCategory.category_desc}
              onChange={(e) =>
                setEditedPermaCategory({
                  ...editedPermaCategory,
                  category_desc: e.target.value,
                })
              }
            />
            {/* Display field-specific error message for category_desc */}
            {fieldErrors.category_desc && (
              <div className="text-red-500">{fieldErrors.category_desc[0]}</div>
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
        `${laravelBaseUrl}/api/delete-permanent-deferral-category?categories_id=${categoryId}`,
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
        <DialogHeader>Delete Permanent Deferral Category</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this permanent deferral category?
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
