import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
} from "@material-tailwind/react";
 
export function AccordionDispense() {
  const [open, setOpen] = React.useState(0);
  const [alwaysOpen, setAlwaysOpen] = React.useState(true);
 
  const handleAlwaysOpen = () => setAlwaysOpen((cur) => !cur);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);
 
  return (
    <div className="w-1/3 flex flex-col">
      <Accordion open={alwaysOpen}>
        <AccordionHeader onClick={handleAlwaysOpen}>BLOOD BAG INFO</AccordionHeader>
        <AccordionBody>
            <Typography className="text-black font-medium">
                    Serial: xxxxxxxxxxxx
            </Typography>
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 1}>
        <AccordionHeader onClick={() => handleOpen(1)}>
          DONOR INFO
        </AccordionHeader>
        <AccordionBody>
            <Typography className="text-black font-medium">
                Name: Leng Leng
            </Typography>
            <Typography className="text-black font-medium">
                Donor Number: xxxxxxxxx
            </Typography>
            <Typography className="text-black font-medium">
                Blood Type: A+
            </Typography>
            <Typography className="text-black font-medium">
                Date Donated: mm/dd/yyyy   
            </Typography>
        </AccordionBody>
      </Accordion>
	</div>
  );
}