import InputSelect from "@/app/components/InputSelect";
import { laravelBaseUrl } from "@/app/variables";
import {
  ArrowsRightLeftIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Option,
  Select,
  Tooltip,
} from "@material-tailwind/react";
import { Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function MoveToDeferral({
  user_id,
  refreshData,
  temporaryDeferralCategories,
  permanentDeferralCategories,
  venueOptions,
}) {
  const [open, setOpen] = useState(false);
  const [typesDeferral, setTypesDeferral] = useState("1");
  const [category, setCategory] = useState("");
  const [remarks, setRemarks] = useState("");
  const [duration, setDuration] = useState("001");
  const [venue, setVenue] = useState("");
  const [dateDeferred, setDateDeferred] = useState("");
  const [donationType, setDonationType] = useState();
  const [errorMessage, setErrorMessage] = useState({
    category: "",
    specific_reason: "",
    remarks: "",
    duration: "",
  });
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [selectedCategoryRemarks, setSelectedCategoryRemarks] = useState(null); // State to store selected category's remarks

  const handleVenueSelect = (selectedValue) => {
    setVenue(selectedValue);
  };

  const handleDonationTypeSelect = (selectedValue) => {
    setDonationType(selectedValue);
  };

  const donationTypeOptions = [
    { label: "Voluntary Blood Donation", value: "1" },
    { label: "Direct Patient Blood Donation", value: "2" },
  ];

  const dynamicVenueOptions = venueOptions.map((item) => ({
    label: item.venues_desc,
    value: item.venues_id.toString(),
  }));

  const handleIncrement = () => {
    const parsedDuration = parseInt(duration, 10);
    if (parsedDuration < 999) {
      setDuration((parsedDuration + 1).toString().padStart(3, "0"));
    }
  };

  const handleDecrement = () => {
    const parsedDuration = parseInt(duration, 10);
    if (parsedDuration > 0) {
      setDuration((parsedDuration - 1).toString().padStart(3, "0"));
    }
  };

  const handleCategoryChange = (value) => {
    setCategory(value);

    // Find the selected category's remarks
    const selectedCategory = temporaryDeferralCategories.find(
      (category) => category.categories_id === value
    );
    if (selectedCategory) {
      setSelectedCategoryRemarks(selectedCategory.remarks);
    } else {
      setSelectedCategoryRemarks(null); // Reset remarks if the selected category is not found
    }
  };

  const handleTypesChange = (value) => {
    setTypesDeferral(value);
    setCategory(""); // Reset category when changing the type
  };

  const handleRemarksChange = (value) => {
    setRemarks(value);
  };

  const handleMoveToDeferral = async (e) => {
    e.preventDefault();

    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const data = {
        user_id,
        deferral_type_id: typesDeferral,
        categories_id: category,
        remarks: remarks,
        duration: duration,
        venue: venue,
        date_deferred: dateDeferred,
        donation_type: donationType,
      };
      const response = await axios.post(
        `${laravelBaseUrl}/api/move-to-defferal`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        // Handle success
        toast.success("Successfully moved to deferral");
        setOpen(false);
        refreshData();
      } else if (response.data.status === "error") {
        setGeneralErrorMessage(response.data.message);
        handleErrorResponse(response.data);
        toast.error("error");
      }
    } catch (error) {
      setGeneralErrorMessage(error.response.data.message);
    }
  };

  const handleErrorResponse = (errorData) => {
    if (errorData.message) {
      setGeneralErrorMessage(errorData.message);
    } else if (errorData.errors) {
      const { errors } = errorData;
      setErrorMessage({
        category: errors.category || "",
        specific_reason: errors.specific_reason || "",
        remarks: errors.remarks || "",
        duration: errors.duration || "",
      });
    }
  };

  return (
    <>
      <Tooltip content="Move to Deferral">
        <IconButton
          size="sm"
          onClick={() => setOpen(true)}
          variant="gradient"
          color="red"
        >
          <ArrowsRightLeftIcon className="h-5 w-5" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>
          Move to Deferral
        </DialogHeader>
        {generalErrorMessage && (
          <div className="mt-4 text-center bg-red-100 p-2 rounded-lg">
            <Typography color="red" className="text-sm font-semibold">
              {generalErrorMessage}
            </Typography>
          </div>
        )}
        <DialogBody divider className="flex flex-col gap-4">
          <div
            className={`relative flex items-center justify-between gap-5 w-full`}
          >
            <InputSelect
              label="Venue"
              value={venue}
              onSelect={handleVenueSelect}
              options={dynamicVenueOptions}
              isSearchable
              required
              placeholder="Venue"
            />
            <Input
              type="date"
              label="Date"
              value={dateDeferred}
              onChange={(e) => setDateDeferred(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
            {errorMessage.remarks && (
              <div className="error-message text-red-600 text-sm absolute mt-2">
                {errorMessage.remarks}
              </div>
            )}
          </div>
          <div className={`relative`}>
            <Select
              label="Type of Deferral"
              value={typesDeferral}
              onChange={(value) => handleTypesChange(value)}
              required
            >
              <Option value="1">Temporary Deferral</Option>
              <Option value="2">Permanent Deferral</Option>
            </Select>
            {errorMessage.remarks && (
              <div className="error-message text-red-600 text-sm absolute mt-2">
                {errorMessage.remarks}
              </div>
            )}
          </div>
          <div className={`relative ${errorMessage.category ? "mb-4" : ""}`}>
            <Select
              label="Category"
              value={category}
              onChange={handleCategoryChange}
              required
            >
              {typesDeferral === "1"
                ? temporaryDeferralCategories.map((tempCategory) => (
                    <Option
                      key={tempCategory.categories_id}
                      value={tempCategory.categories_id}
                    >
                      {tempCategory.category_desc}
                    </Option>
                  ))
                : typesDeferral === "2"
                ? permanentDeferralCategories.map((permaCategory) => (
                    <Option
                      key={permaCategory.categories_id}
                      value={permaCategory.categories_id}
                    >
                      {permaCategory.category_desc}
                    </Option>
                  ))
                : null}
            </Select>

            {errorMessage.category && (
              <div className="error-message text-red-600 text-sm mt-1">
                {errorMessage.category}
              </div>
            )}
          </div>
          {category && typesDeferral === "1" && (
            <div className={`relative`}>
              <Select
                label="Remarks"
                value={selectedCategoryRemarks}
                onSelect={handleRemarksChange}
              >
                {selectedCategoryRemarks && (
                  <Option value={selectedCategoryRemarks}>
                    {selectedCategoryRemarks}
                  </Option>
                )}
              </Select>
              {errorMessage.specific_reason && (
                <div className="error-message text-red-600 text-sm absolute mt-2">
                  {errorMessage.specific_reason}
                </div>
              )}
            </div>
          )}

          <div className={`relative`}>
            <Select
              onChange={handleDonationTypeSelect}
              label="Donation Type"
              value={donationType}
            >
              {donationTypeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            {errorMessage.specific_reason && (
              <div className="error-message text-red-600 text-sm absolute mt-2">
                {errorMessage.specific_reason}
              </div>
            )}
          </div>

          {typesDeferral === "1" && (
            <div className="flex items-center justify-center text-black w-full">
              <IconButton onClick={handleDecrement} className="rounded-r-none">
                <MinusIcon className="h-5 w-5" />
              </IconButton>
              <input
                type="text"
                label="Days"
                maxLength={3}
                value={duration}
                onChange={(e) => {
                  const inputVal = e.target.value;
                  if (/^[0-9]*$/.test(inputVal)) {
                    setDuration(inputVal !== "" ? inputVal : "000");
                  }
                }}
                className="w-20 h-10 text-center border-2 border-gray-900 appearance-none"
              />
              <IconButton onClick={handleIncrement} className="rounded-l-none">
                <PlusIcon className="h-5 w-5" />
              </IconButton>
              {errorMessage.duration && (
                <div className="error-message text-red-600 text-sm absolute mt-2">
                  {errorMessage.duration}
                </div>
              )}
            </div>
          )}
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
          <Button variant="gradient" color="red" onClick={handleMoveToDeferral}>
            <span>Move</span>
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
