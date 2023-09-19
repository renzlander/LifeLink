import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
 
export function AddBloodBag() {
  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);
 
  return (
    <>
      <Button size="sm" onClick={handleOpen} variant="gradient" color="red">
        + Add Blood Bag
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Add Blood Bag</DialogHeader>
        <DialogBody divider className="flex flex-col gap-6">
            <Input label="Serial Number" />
            <Input label="Bled by" />
            <Input type="date" label="Date" />
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
          <Button variant="gradient" color="red" onClick={handleOpen}>
            <span>Add</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}