import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardHeader,
  CardBody,
  Input,
  Tooltip,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  DocumentIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";


export function AddBloodBagPopup() {
  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);

  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        Open Dialog
      </Button>
      <Dialog open={open} handler={handleOpen} size="lg">
        <DialogHeader className="border-b-2">Dispense Blood</DialogHeader>
        <DialogBody className="flex flex-col gap-5 overscroll-y-auto">
          <div className="flex items-start justify-between">
            <Card className="border-2">
              <CardHeader floated={false} shadow={false} color="red" variant="gradient" className="h-12 flex items-center justify-center">
                <Typography>XXXX-XXXXXX-X</Typography>
              </CardHeader>
              <CardBody>
                <Typography>
                  Name: Ryan Jay Antonio
                </Typography>
                <Typography>
                  Blood Type: AB+
                </Typography>
                <Typography>
                  Sex: Male
                </Typography>
                <Typography>
                  Address: Tongco St., Maysan, Valenzuela
                </Typography>
                <Typography>
                  Mobile No.: 09999999999
                </Typography>
              </CardBody>
            </Card>
            <Card className="border-2">
              <CardBody className="flex flex-col items-center justify-center gap-3">
                <Select label="search">
                  <Option>Ray Reyes</Option>
                </Select>
                <Typography>
                  ----------- OR -----------
                </Typography>
                <Button color="red" variant="gradient" className="flex items-center gap-1">
                  <DocumentIcon className="w-4 h-4" />
                  Manual Form
                </Button>
              </CardBody>
            </Card>
          </div>
          <div>
            <Card className="border-2">
              <CardBody>
                <Typography>
                  Diagnosis for Transfusion:
                </Typography>
                <Input label="e.g. Anemia" containerProps={{ className: "w-[200px]" }}/>
                <Select label="Hospital" containerProps={{ className: "w-[200px] mt-4" }}>
                  <Option>ValGen</Option>
                </Select>
              </CardBody>
            </Card>
          </div>
        </DialogBody>
        <DialogFooter className="border-t">
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

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}