import { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
} from "@material-tailwind/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

const LIST = [
  {
    name: "CALOOCAN CITY",
    address: "7th Ave. Grace Park, Caloocan City",
    tel: "02-3660380",
    mobile: "0917-148-9419",
    fax: "3645752",
    email: "caloocan@redcross.org.ph",
    category: "Blood Collecting Unit/Blood Station",
  },
  {
    name: "MAKATI",
    address: "Johnny Air Building 55 B Dian St. Cor Gil Puyat Ave. Brgy. Palanan Makati",
    tel: "403-6267",
    mobile: "0917-838-7672",
    fax: "403-5826",
    email: "rizalmakati@redcross.org.ph",
    category: "Blood Collecting Unit/Blood Station",
  },
  {
    name: "MUNTINLUPA",
    address: "Red Cross Center Centennial Lane FILINVEST, Alabang",
    tel: "850-6813",
    mobile: "0917-838-7672",
    fax: null,
    email: "rizalmuntinlupa@redcross.org.ph",
    category: "Blood Collecting Unit/Blood Station",
  },
  {
    name: "PASAY",
    address: "2354 CAA Compound, Aurora Blvd. (old Tramo), Pasay City",
    tel: "854-2748",
    mobile: "Staff Agnes: 0918-917-1181, 0917-815-1178",
    fax: "854-2748",
    email: "pasay@redcross.org.ph",
    category: "Blood Collecting Unit/Blood Station",
  },
  {
    name: "QUEZON CITY",
    address: "Quezon City Hall Compound, Kalayaan Avenue, Diliman, Quezon City",
    tel: "433-6568, 433-2152, 433-2151, 435-0238, 434-3751",
    mobile: null,
    fax: "426-9627",
    email: "quezoncity@redcross.org.ph",
    category: "Blood Collecting Unit/Blood Station",
  },
  {
    name: "RIZAL-MAIN",
    address: "Shaw Blvd., Pasig City",
    tel: "631-3993",
    mobile: null,
    fax: "631-3592, 635-2825; MG: 635 -0922, 637-5691, 634-7824",
    email: "rizal@redcross.org.ph",
    category: "Blood Collecting Unit/Blood Station",
  },
  {
    name: "RIZAL-EAST",
    address: "2nd Floor Multipurpose Bldg, Brgy Muzon, Taytay Rizal",
    tel: "998-4867",
    mobile: "0917-837-3805",
    fax: null,
    email: "prcrizalprovince@redcross.org.ph",
    category: "Blood Collecting Unit/Blood Station",
  },
  {
    name: "VALENZUELA CITY",
    address: "Dahlia Street, Villa Teresa Subdivision, Marulas, Valenzuela City",
    tel: "432-0273, 293-8375, 456-7767",
    mobile: "Staff- Emy: 0919-466-8799",
    fax: null,
    email: "valenzuela2@redcross.org.ph",
    category: "Blood Collecting Unit/Blood Station",
  },
]

export function BankAccordion() {
  const [open, setOpen] = useState(null);

  const handleOpen = (value) => setOpen(open === value ? null : value);

  return (
    <>
      {LIST.map((item, index) => (
        <Accordion
          key={index}
          open={open === index}
          className="mb-2 rounded-lg border border-blue-gray-100 px-4"
          icon={<ChevronUpIcon className={`w-5 h-5 transition-transform ${open === index ? "rotate-180" : ""}`} />}
        >
          <AccordionHeader
            onClick={() => handleOpen(index)}
            className={`border-b-0 transition-colors ${
              open === index ? "text-blue-500 hover:!text-blue-700" : ""
            }`}
          >
            {item.name}
          </AccordionHeader>
          <AccordionBody className="pt-0 text-base font-normal">
            <Typography color="blue-gray" className="font-medium">Address: {item.address}</Typography>
            <Typography color="blue-gray" className="font-medium">Tel: {item.tel}</Typography>
            <Typography color="blue-gray" className={`font-medium ${item.mobile === null ? "hidden" : ""}`}>Mobile: {item.mobile}</Typography>
            <Typography color="blue-gray" className={`font-medium ${item.fax === null ? "hidden" : ""}`}>Fax: {item.fax}</Typography>
            <Typography color="blue-gray" className="font-medium">Email: {item.email}</Typography>
            <Typography color="blue-gray" className="font-medium">Category: {item.category}</Typography>
          </AccordionBody>
        </Accordion>
      ))}
    </>
  );
}
