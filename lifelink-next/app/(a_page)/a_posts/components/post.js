import React, {  useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Checkbox, Typography, List, ListItem, ListItemPrefix, Avatar, Chip, Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { ApprovePost, DisapprovePost, SearchDonor } from "./popup";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

function Icon({ id, open }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}

function formatDateTime(dateTimeString) {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
    const formattedDateTime = new Date(dateTimeString).toLocaleDateString(undefined, options);
    return formattedDateTime;
}
export function PostCard() {
    const [open, setOpen] = React.useState(0);
    const [bloodRequests, setLatestBloodRequests] = useState([]);
    const [openAccordions, setOpenAccordions] = React.useState([]);

    console.log("asdsa",bloodRequests);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    const chipColor = [
        { color: "gray", value: "Pending", text: "Pending" },
        { color: "green", value: "Accomodated", text: "Accomodated" },
        { color: "red", value: "Declined", text: "Declined" },
    ];

    const TABLE_HEAD = ["Name", "Address", "Email", "Mobile Number"];

    const TABLE_ROWS = [
        {
            name: "Ryan Jay Dela Peña Antonio",
            address: "1209 Tutut St. Malinta Valenzuela City",
            email: "ryanjayantonio304@gmail.com",
            mobile: "09683104353",
        },
        {
            name: "Ryan Jay Dela Peña Antonio",
            address: "1209 Tutut St. Malinta Valenzuela City",
            email: "ryanjayantonio304@gmail.com",
            mobile: "09683104353",
        },
        {
            name: "Ryan Jay Dela Peña Antonio",
            address: "1209 Tutut St. Malinta Valenzuela City",
            email: "ryanjayantonio304@gmail.com",
            mobile: "09683104353",
        },
    ];

    useEffect(() => {

      const fetchBloodRequest = async () => {
        try {
          const token = getCookie("token");
          if (!token) {
            router.push("./login");
            return;
          }
  
          const response = await axios.get(`${laravelBaseUrl}/api/get-blood-request`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log(response);
          setLatestBloodRequests(response.data.data);
  
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      };
  
      fetchBloodRequest();
    }, []);

    const handleAccordionOpen = (index) => {
      const updatedOpenAccordions = [...openAccordions];
      updatedOpenAccordions[index] = !openAccordions[index];
      setOpenAccordions(updatedOpenAccordions);
  };

    const renderBloodRequests = () => {
      return bloodRequests.map((request, index) => (
          <div key={index} className="flex items-start">
              <Card shadow={false} className="p-4 w-full shadow-md relative rounded-tr-none">
                  <CardHeader color="transparent" floated={false} shadow={false} className="mx-0 flex items-center gap-4 pt-0 pb-8">
                      <Avatar size="lg" variant="circular" src="/next.svg" />
                      <div className="flex w-full justify-between gap-0.5">
                          <div className="flex flex-col">
                              <Typography variant="h5" color="blue-gray">
                                  {`${request.first_name} ${request.middle_name} ${request.last_name}`}
                              </Typography>
                              <Typography color="blue-gray">{formatDateTime(request.created_at)}</Typography>
                          </div>
                          <div className="flex flex-col">
                              <Chip variant="ghost" color={chipColor[request.isAccommodated].color} value={chipColor[request.isAccommodated].text}>
                                  {chipColor[request.isAccommodated].text}
                              </Chip>
                              <Typography color="blue-gray">{`Request ID: ${request.request_id_number}`}</Typography>
                          </div>
                      </div>
                  </CardHeader>
                  <CardBody className="mb-6 p-0">
                      <Typography>{`Email: ${request.email}`}</Typography>
                      <Typography>{`Mobile: ${request.mobile}`}</Typography>
                      <Typography>{`Blood Type: ${request.blood_type}`}</Typography>
                      <Typography>{`Number of Units Needed: ${request.blood_units}`}</Typography>
                      <Typography>{`Blood Component Need: ${request.blood_component_desc}`}</Typography>
                      <Typography>{`Diagnosis: ${request.diagnosis}`}</Typography>
                      <Typography>{`Hospital: ${request.hospital}`}</Typography>
                      <Typography>{`Schedule: ${formatDateTime(request.schedule)}`}</Typography>
                      <Accordion open={openAccordions[index]} icon={<Icon id={1} open={openAccordions[index]} />}>
                        <AccordionHeader onClick={() => handleAccordionOpen(index)}>Total Interested Donors: 3</AccordionHeader>
                          <AccordionBody>
                              <table className="w-full min-w-max table-auto text-left">
                                  <thead>
                                      <tr>
                                          {TABLE_HEAD.map((head) => (
                                              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                                      {head}
                                                  </Typography>
                                              </th>
                                          ))}
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {TABLE_ROWS.map(({ name, address, email, mobile }, rowIndex) => (
                                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "even:bg-blue-gray-50/50" : ""}>
                                              <td className="p-4">
                                                  <Typography variant="small" color="blue-gray" className="font-bold">
                                                      {name}
                                                  </Typography>
                                              </td>
                                              <td className="p-4">
                                                  <Typography variant="small" color="blue-gray" className="font-normal">
                                                      {address}
                                                  </Typography>
                                              </td>
                                              <td className="p-4">
                                                  <Typography variant="small" color="blue-gray" className="font-normal">
                                                      {email}
                                                  </Typography>
                                              </td>
                                              <td className="p-4">
                                                  <Typography variant="small" color="blue-gray" className="font-normal">
                                                      {mobile}
                                                  </Typography>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </AccordionBody>
                      </Accordion>
                  </CardBody>
              </Card>
              <div className="flex flex-col items-start gap-5">
                  <SearchDonor />
                  <ApprovePost />
                  <DisapprovePost />
              </div>
          </div>
      ));
  };

  return (
      <>
          <div className="w-full mb-6 px-8">
              <FilterCheckBox />
          </div>
          {renderBloodRequests()}
      </>
  );
}

export function FilterCheckBox() {
    const filters = ["Accomodated", "Pending", "Declined"];
    const [checkedStatus, setCheckedStatus] = useState(filters.map(() => true));

    return (
        <Card className="w-full max-w-md">
            <Typography variant="h5" color="blue-gray" className="ml-4 mt-4">
                Filters
            </Typography>
            <List className="flex-row">
                {filters.map((filters, index) => (
                    <ListItem className="p-0" key={filters}>
                        <label htmlFor={`horizontal-list-${filters.toLowerCase()}`} className="flex w-full cursor-pointer items-center px-3 py-2">
                            <ListItemPrefix className="mr-3">
                                <Checkbox
                                    id={`horizontal-list-${filters.toLowerCase()}`}
                                    ripple={false}
                                    className="hover:before:opacity-0"
                                    containerProps={{
                                        className: "p-0",
                                    }}
                                    checked={checkedStatus[index]}
                                    onChange={(event) => {
                                        const updatedCheckedStatus = [...checkedStatus];
                                        updatedCheckedStatus[index] = event.target.checked;
                                        setCheckedStatus(updatedCheckedStatus);
                                    }}
                                />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="font-medium">
                                {filters}
                            </Typography>
                        </label>
                    </ListItem>
                ))}
            </List>
        </Card>
    );
}

export function CreatePost() {
    const [open, setOpen] = React.useState(0);

    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    const chipColor = [
        { color: "green", value: "Accomodated", text: "Accomodated" },
        { color: "red", value: "Declined", text: "Declined" },
        { color: "gray", value: "Pending", text: "Pending" },
    ];

    const TABLE_HEAD = ["Name", "Address", "Email", "Mobile Number"];

    const TABLE_ROWS = [
        {
            name: "Ryan Jay Dela Peña Antonio",
            address: "1209 Tutut St. Malinta Valenzuela City",
            email: "ryanjayantonio304@gmail.com",
            mobile: "09683104353",
        },
        {
            name: "Ryan Jay Dela Peña Antonio",
            address: "1209 Tutut St. Malinta Valenzuela City",
            email: "ryanjayantonio304@gmail.com",
            mobile: "09683104353",
        },
        {
            name: "Ryan Jay Dela Peña Antonio",
            address: "1209 Tutut St. Malinta Valenzuela City",
            email: "ryanjayantonio304@gmail.com",
            mobile: "09683104353",
        },
    ];

    return (
        <div className="flex items-start">
            <Card shadow={false} className="p-4 w-full shadow-md relative rounded-tr-none">
                <CardHeader color="transparent" floated={false} shadow={false} className="mx-0 flex items-center gap-4 pt-0 pb-8">
                    <Avatar size="lg" variant="circular" src="/next.svg" />
                    <div className="flex w-full justify-between gap-0.5">
                        <div className="flex flex-col">
                            <Typography variant="h5" color="blue-gray">
                                Tania Andrew
                            </Typography>
                            <Typography color="blue-gray">April 08, 2023 - 10:23 PM</Typography>
                        </div>
                        <div className="flex flex-col">
                            <Chip variant="ghost" color={chipColor[0].color} value={chipColor[0].text}>
                                {chipColor[0].text}
                            </Chip>
                            <Typography color="blue-gray">No. of Donations : 2</Typography>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="mb-6 p-0">
                    <Typography>&quot;I found solution to all my design needs from Creative Tim. I use them as a freelancer in my hobby projects for fun! And its really affordable, very humble guys !!!&quot;</Typography>
                    <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
                        <AccordionHeader onClick={() => handleOpen(1)}>Total Interested Donors: 3</AccordionHeader>
                        <AccordionBody>
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {TABLE_ROWS.map(({ name, address, email, mobile }, index) => (
                                        <tr key={index} className={index % 2 === 0 ? "even:bg-blue-gray-50/50" : ""}>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-bold">
                                                    {name}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {address}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {email}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {mobile}
                                                </Typography>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </AccordionBody>
                    </Accordion>
                </CardBody>
            </Card>
            <div className="flex flex-col items-start gap-5">
                <ApprovePost />
                <DisapprovePost />
            </div>
        </div>
    );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
