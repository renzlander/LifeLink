import React, { useState } from "react";
import { 
    Typography, 
    Button, 
    Dialog, 
    DialogHeader, 
    DialogBody, 
    DialogFooter, 
    Tooltip, 
    IconButton, 
    Chip,
} from "@material-tailwind/react";
import { EyeIcon } from "@heroicons/react/24/outline";

export function ViewPopUp({ user }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Tooltip content="View User">
                <IconButton variant="text" onClick={() => setOpen(true)}>
                    <EyeIcon className="h-4 w-4" />
                </IconButton>
            </Tooltip>
            <Dialog open={open} handler={() => setOpen(false)}>
                <DialogHeader className="bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] text-white font-semibold">
                    User Details
                </DialogHeader>
                <DialogBody divider className="flex flex-col gap-4">
                    <Chip value="DEFERRED" color="blue-gray" />
                    <div className="flex gap-10 text-gray-900">
                        <Typography>
                            <strong>First Name:</strong>
                            <br />
                            {user.first_name}
                        </Typography>
                        <Typography>
                            <strong>Middle Name:</strong>
                            <br />
                            {user.middle_name ? user.middle_name : "N/A"}
                        </Typography>
                        <Typography>
                            <strong>Last Name:</strong>
                            <br />
                            {user.last_name}
                        </Typography>
                    </div>
                    <Chip value="Donor Info" color="blue-gray" />
                    <div className="flex gap-12 text-gray-900">
                        <Typography>
                            <strong>Number of Donation:</strong> {user.donate_qty}
                        </Typography>
                        <Typography>
                            <strong>Badge:</strong> {user.badge}
                        </Typography>
                    </div>
                    <Chip value="Contact Info" color="blue-gray" />
                    <div className="flex gap-10 text-gray-900">
                        <Typography>
                            <strong>Email:</strong> {user.email}
                        </Typography>
                        <Typography>
                            <strong>Mobile:</strong> {user.mobile}
                        </Typography>
                    </div>
                    <Chip value="Personal Info" color="blue-gray" />
                    <div className="flex gap-10 text-gray-900">
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
                    <Chip value="Address" color="blue-gray" />
                    <Typography className="text-lg text-gray-900 font-medium">
                        {user.street}, {user.barangay}, {user.municipality}, {user.province}, {user.region}
                    </Typography>
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
