import React from "react";
import {
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import InputSelect from "@/app/components/InputSelect";
 
export function CreateRequest() {
  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);
 
  return (
    <>
      <Button onClick={handleOpen} color="gray" variant="gradient" className="rounded-full">
        Make Request
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Make a Blood Request</DialogHeader>
        <DialogBody className="grid gap-4">
          <Input label="No. of Blood Units" />
          {/* <InputSelect /> */}
          <Input label="Diagnosis" />
          <Input label="Hospital" />
          <div className="flex items-center justify-between gap-4 w-full">
            <Input type="date" label="Date" />
            <Input type="time" label="Time" />
          </div>
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
            <span>Submit Request</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}