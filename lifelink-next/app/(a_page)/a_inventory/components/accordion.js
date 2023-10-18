import React, { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
} from "@material-tailwind/react";
 
export function AccordionDispense() {
  const [openStates, setOpenStates] = useState([false, false, false]);

  const toggleOpenState = (index) => {
    const newOpenStates = [...openStates];
    newOpenStates[index] = !newOpenStates[index];
    setOpenStates(newOpenStates);
  };

  return (
    <div className="w-1/3 flex flex-col">
      <Accordion open={openStates[0]}>
        <AccordionHeader onClick={() => toggleOpenState(0)}>Blood Bag #1</AccordionHeader>
        <AccordionBody>
        <Typography className="text-black font-medium">
                    Serial: xxxxxxxxxxxx
            </Typography>
            <Typography className="text-black font-medium">
                    Blood Type: O+
            </Typography>
            <Typography className="text-black font-medium">
                    Date Donated: October 13, 2023
            </Typography>
            <Typography className="text-black font-medium">
                    Expiration Date: November 19, 2023
            </Typography>
        </AccordionBody>
      </Accordion>
      <Accordion open={openStates[1]}>
        <AccordionHeader onClick={() => toggleOpenState(1)}>Blood Bag #2</AccordionHeader>
        <AccordionBody>
        <Typography className="text-black font-medium">
                    Serial: xxxxxxxxxxxx
            </Typography>
            <Typography className="text-black font-medium">
                    Blood Type: O+
            </Typography>
            <Typography className="text-black font-medium">
                    Date Donated: October 13, 2023
            </Typography>
            <Typography className="text-black font-medium">
                    Expiration Date: November 19, 2023
            </Typography>
        </AccordionBody>
      </Accordion>
      <Accordion open={openStates[2]}>
        <AccordionHeader onClick={() => toggleOpenState(2)}>Blood Bag #3</AccordionHeader>
        <AccordionBody>
        <Typography className="text-black font-medium">
                    Serial: xxxxxxxxxxxx
            </Typography>
            <Typography className="text-black font-medium">
                    Blood Type: O+
            </Typography>
            <Typography className="text-black font-medium">
                    Date Donated: October 13, 2023
            </Typography>
            <Typography className="text-black font-medium">
                    Expiration Date: November 19, 2023
            </Typography>
        </AccordionBody>
      </Accordion>
    </div>
  );
}
