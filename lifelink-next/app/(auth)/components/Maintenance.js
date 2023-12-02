"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

export function MaintenanceMode({ updateOpenState, open }) {
  const [opens, setOpen] = useState(open);

  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleOpen = useCallback(() => {
    setOpen((prevOpens) => !prevOpens);
    updateOpenState((prevOpen) => !prevOpen); // Update the state in the parent component
  }, [updateOpenState]);

  return (
    <>
      <Dialog open={opens} handler={handleOpen} size="xxl">
        <DialogBody className="flex flex-col items-center gap-4 px-8 py-24 h-max">
          <WrenchScrewdriverIcon className="w-56 h-56 text-orange-500" />
          <Typography variant="h3" color="amber">
            We'll be right back!
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg text-center"
          >
            We're sorry for the inconvenience. We are currently undergoing
            scheduled maintenance for website enhancements. We will be back
            shortly!
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Close</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
