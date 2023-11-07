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
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function SearchDonor() {
  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);
 
  return (
    <>
      <IconButton color="gray" variant="gradient" className="rounded-l-none" onClick={handleOpen}>
        <MagnifyingGlassIcon className="h-5 w-5" />
      </IconButton>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Search donor for this request</DialogHeader>
        <DialogBody>
          Are you sure you want to search donor for this request?
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
export function ApprovePost() {
  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);
 
  return (
    <>
      <IconButton color="green" variant="gradient" className="rounded-l-none" onClick={handleOpen}>
        <CheckIcon className="h-5 w-5" />
      </IconButton>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Mark as Accomodated</DialogHeader>
        <DialogBody>
          Are you sure you want to mark this request as accomodated? 
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
        <DialogHeader>Marks as Declined</DialogHeader>
        <DialogBody>
          Are you sure you want to mark this request as declined?
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