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

export function AccordionDispense() {
  const [open, setOpen] = React.useState(0);
 
  const handleOpen = (value) => setOpen(open === value ? 0 : value);
 
  return (
    <>
			<Accordion
				open={open === 1}
				icon={<Icon id={1} open={open} />}
				className="mb-2 rounded-lg border border-blue-gray-100 px-4"
			>
        <AccordionHeader
          onClick={() => handleOpen(1)}
          className="border-b-0"
        >
          XXXX-XXXXXX-X
        </AccordionHeader>
        <AccordionBody className="pt-0 text-base font-normal">
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
        </AccordionBody>
      </Accordion>
    </>
  );
}