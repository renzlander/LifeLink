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
        <DialogBody className="flex flex-col gap-4">
          <Input label="No. of Blood Units" />
          {/* <InputSelect /> */}
          <Input label="Diagnosis" />
          <Input label="Hospital" />
          <div className="flex flex-wrap 2xl:flex-nowrap items-center justify-between gap-4 w-full">
            <Input type="date" label="Date"/>
            <Input type="time" label="Time"/>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="outlined"
            color="gray"
            onClick={handleOpen}
            className="mr-3"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red" onClick={handleOpen}>
            <span>Submit Request</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}