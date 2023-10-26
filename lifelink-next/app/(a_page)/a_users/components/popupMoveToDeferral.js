import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Tooltip, IconButton, Select, Option } from "@material-tailwind/react";
import { ArrowsRightLeftIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function MoveToDeferral({ user_id, refreshData, temporaryDeferralCategories, permanentDeferralCategories }) {
    const [open, setOpen] = useState(false);
    const [typesDeferral, setTypesDeferral] = useState("1");
    const [category, setCategory] = useState("");
    const [remarks, setRemarks] = useState("");
    const [duration, setDuration] = useState("001");

    const [errorMessage, setErrorMessage] = useState({ category: "", specific_reason: "", remarks: "", duration: "" });
    const [generalErrorMessage, setGeneralErrorMessage] = useState("");
    const [selectedCategoryRemarks, setSelectedCategoryRemarks] = useState(null); // State to store selected category's remarks

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
        const selectedCategory = temporaryDeferralCategories.find((category) => category.categories_id === value);
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
                deferral_type_id:typesDeferral,
                categories_id: category,
                remarks: remarks,
                duration: duration,
            };
            console.log(user_id);
            console.log('deferral_type_id',typesDeferral);
            console.log(category);
            console.log(remarks);
            console.log(duration);
            const response = await axios.post(`${laravelBaseUrl}/api/move-to-defferal`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === "success") {
                // Handle success
                toast.success("Successfully moved to deferral");
                setOpen(false);
                refreshData();
            } else if (response.data.status === "error") {
                handleErrorResponse(response.data);
                toast.error("error");

            }
        } catch (error) {
            console.error("Unknown error occurred:", error);
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
                <IconButton size="sm" onClick={() => setOpen(true)} variant="gradient" color="red">
                    <ArrowsRightLeftIcon className="h-5 w-5" />
                </IconButton>
            </Tooltip>
            <Dialog open={open} handler={() => setOpen(false)}>
                    <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] rounded-t-md text-white font-semibold">
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
                    <div className={`relative flex items-center justify-between gap-5 w-full`}>
                        <Select label="Venue" required>
                            <Option>ValGen</Option>
                            <Option>Dalandanan Hospital</Option>
                        </Select>
                        <Input type="date" label="Date" />
                        {errorMessage.remarks && <div className="error-message text-red-600 text-sm absolute mt-2">{errorMessage.remarks}</div>}
                    </div>
                    <div className={`relative`}>
                        <Select label="Type of Deferral" value={typesDeferral} onChange={(value) => handleTypesChange(value)} required>
                            <Option value="1">Temporary Deferral</Option>
                            <Option value="2">Permanent Deferral</Option>
                        </Select>
                        {errorMessage.remarks && <div className="error-message text-red-600 text-sm absolute mt-2">{errorMessage.remarks}</div>}
                    </div>
                    <div className={`relative ${errorMessage.category ? "mb-4" : ""}`}>
                        <Select label="Category" value={category} onChange={handleCategoryChange} required>
                            {typesDeferral === "1"
                                ? temporaryDeferralCategories.map((tempCategory) => (
                                      <Option key={tempCategory.categories_id} value={tempCategory.categories_id}>
                                          {tempCategory.category_desc}
                                      </Option>
                                  ))
                                : typesDeferral === "2"
                                ? permanentDeferralCategories.map((permaCategory) => (
                                      <Option key={permaCategory.categories_id} value={permaCategory.categories_id}>
                                          {permaCategory.category_desc}
                                      </Option>
                                  ))
                                : null}
                        </Select>

                        {errorMessage.category && <div className="error-message text-red-600 text-sm mt-1">{errorMessage.category}</div>}
                    </div>
                    {category && typesDeferral === "1" && (
                        <div className={`relative`}>
                            <Select label="Remarks" value={selectedCategoryRemarks} onChange={(value) => handleRemarksChange(value)}>
                                {selectedCategoryRemarks && (
                                    <Option value={selectedCategoryRemarks}>
                                        {selectedCategoryRemarks}
                                    </Option>
                                )}
                            </Select>
                            {errorMessage.specific_reason && <div className="error-message text-red-600 text-sm absolute mt-2">{errorMessage.specific_reason}</div>}
                        </div>
                    )}

                    {typesDeferral === "1" && (
                        <div className="flex items-center justify-center text-black w-full">
                            <IconButton onClick={handleDecrement} className="rounded-r-none">
                                <MinusIcon className="h-5 w-5" />
                            </IconButton>
                            <Input
                                type="text"
                                label="Days"
                                maxLength={3}
                                value={duration}
                                onChange={(e) => {
                                    const inputVal = e.target.value;
                                    if (/^[0-9]*$/.test(inputVal)) {
                                        setDuration(inputVal.padStart(3, "0"));
                                    }
                                }}
                                className="text-center rounded-none appearance-none"
                                containerProps={{ className: "max-w-[50px]" }}
                            />
                            <IconButton onClick={handleIncrement} className="rounded-l-none">
                                <PlusIcon className="h-5 w-5" />
                            </IconButton>
                            {errorMessage.duration && <div className="error-message text-red-600 text-sm absolute mt-2">{errorMessage.duration}</div>}
                        </div>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setOpen(false)} className="mr-1">
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
