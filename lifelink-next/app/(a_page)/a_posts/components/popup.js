import React from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
 
export function ApprovePost() {
  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);
 
  return (
    <>
      <IconButton color="green" variant="gradient" className="rounded-l-none" onClick={handleOpen}>
        <CheckIcon className="h-5 w-5" />
      </IconButton>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Approve Post</DialogHeader>
        <DialogBody>
          Are you sure you want to approve this post?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export function DisapprovePost() {
  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);
 
  return (
    <>
      <IconButton color="red" variant="gradient" className="rounded-l-none" onClick={handleOpen}>
        <XMarkIcon className="h-5 w-5" />
      </IconButton>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Disapprove Post</DialogHeader>
        <DialogBody>
          Are you sure you want to disapprove this post?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}