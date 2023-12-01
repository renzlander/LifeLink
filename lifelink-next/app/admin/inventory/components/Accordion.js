import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

function Icon({ id, open }) {
  return (
    <ChevronDownIcon
      className={`${
        id === open ? "rotate-180" : ""
      } w-5 h-5 transition-transform`}
    />
  );
}

export function AccordionDispense({ user }) {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
      <Accordion
        open={open === 0}
        icon={<Icon id={1} open={open} />}
        className="mb-2 rounded-lg border border-blue-gray-100 px-4"
      >
        <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0">
          {user.serial_no}
        </AccordionHeader>
        <AccordionBody className="pt-0 text-base font-normal">
          <Typography>Donor No.: {user.donor_no}</Typography>
          <Typography>
            Name: {user.firt_name} {user.middle_name} {user.last_name}
          </Typography>
          <Typography>Blood Type: {user.blood_type}</Typography>
          <Typography>Date Donated: {user.date_donated}</Typography>
        </AccordionBody>
      </Accordion>
    </>
  );
}

export function AccordionMultipleDispense({ user }) {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
      <Accordion
        open={open === 1}
        icon={<Icon id={1} open={open} />}
        className="mb-2 rounded-lg border border-blue-gray-100 px-4"
      >
        <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0">
          {user.serial_no}
        </AccordionHeader>
        <AccordionBody className="pt-0 text-base font-normal">
          <Typography>Donor No.: {user.donor_no}</Typography>
          <Typography>
            Name: {user.first_name} {user.last_name}
          </Typography>
          <Typography>Blood Type: {user.blood_type}</Typography>
          <Typography>Date Donated: {user.date_donated}</Typography>
        </AccordionBody>
      </Accordion>
    </>
  );
}
