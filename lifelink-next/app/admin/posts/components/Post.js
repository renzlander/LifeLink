import { laravelBaseUrl } from "@/app/variables";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MarkAccomodated, MarkDeclined } from "./Popup";

const TABLE_HEAD = [
  "Name",
  "Blood Type",
  "Email",
  "Mobile Number",
  "isDeferred",
];

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

function formatDateTime(dateTimeString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formattedDateTime = new Date(dateTimeString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDateTime;
}

export function PostCard({ bloodRequests, fetchBloodRequest }) {
  const filters = ["Pending", "Granted", "Referred", "Cancelled"];
  const [checkedStatus, setCheckedStatus] = useState(filters.map(() => true));
  const chipColor = [
    { color: "green", value: "Granted", text: "Granted" },
    { color: "orange", value: "Referred", text: "Referred" },
    { color: "gray", value: "Pending", text: "Pending" },
    { color: "red", value: "Cancelled", text: "Cancelled" },
  ];

  const [openAccordions, setOpenAccordions] = useState({});
  const [interestedDonor, setInterestedDonor] = useState({});
  const [loading, setLoading] = useState(true); // Assuming you want to show a loading state
  const router = useRouter();

  useEffect(() => {
    const fetchInterestedDonor = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("./login");
          return;
        }

        const response = await axios.get(
          `${laravelBaseUrl}/api/get-interested-donor`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Organize interested donors by blood_request_id
        const interestedDonorsMap = {};
        response.data.data.forEach((donor) => {
          const bloodRequestId = donor.blood_request_id;
          if (!interestedDonorsMap[bloodRequestId]) {
            interestedDonorsMap[bloodRequestId] = [];
          }
          interestedDonorsMap[bloodRequestId].push(donor);
        });

        setInterestedDonor(interestedDonorsMap);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchInterestedDonor();
  }, [router]);

  const handleAccordionOpen = (bloodRequestId) => {
    setOpenAccordions((prevOpenAccordions) => ({
      ...prevOpenAccordions,
      [bloodRequestId]: !prevOpenAccordions[bloodRequestId],
    }));
  };

  const renderAccordion = (bloodRequestId) => {
    // Handle the case where interestedDonor[bloodRequestId] is undefined
    const interestedDonorsForRequest = interestedDonor[bloodRequestId] || [];

    return (
      <Accordion
        className="rounded-lg border border-blue-gray-100 px-4"
        open={openAccordions[bloodRequestId]}
        icon={<Icon id={1} open={openAccordions[bloodRequestId]} />}
      >
        <AccordionHeader onClick={() => handleAccordionOpen(bloodRequestId)}>
          Total Interested Donors: {interestedDonorsForRequest.length}
        </AccordionHeader>
        <AccordionBody>
          {interestedDonorsForRequest.length === 0 ? (
            <p>No interested donors at the moment.</p>
          ) : (
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {interestedDonorsForRequest.map(
                  (
                    {
                      first_name,
                      middle_name,
                      last_name,
                      blood_type,
                      email,
                      mobile,
                      remarks,
                    },
                    rowIndex
                  ) => (
                    <tr
                      key={rowIndex}
                      className={
                        rowIndex % 2 === 0 ? "even:bg-blue-gray-50/50" : ""
                      }
                    >
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {`${first_name}, ${middle_name} ${last_name}`}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {blood_type}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {email}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {mobile}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {remarks !== 0 ? "Yes" : "No"}
                        </Typography>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </AccordionBody>
      </Accordion>
    );
  };

  const filterBloodRequests = () => {
    const selectedFilters = filters.filter((_, index) => checkedStatus[index]);
    if (selectedFilters.length === 0) {
      // If no filter is selected, return all blood requests
      return bloodRequests;
    }

    // Filter blood requests based on the selected filters
    return bloodRequests.filter((request) => {
      const status = getStatusFromAccommodated(request.isAccommodated);
      return selectedFilters.includes(status);
    });
  };

  const getStatusFromAccommodated = (accommodated) => {
    switch (accommodated) {
      case 0:
        return "Pending";
      case 1:
        return "Granted";
      case 2:
        return "Referred";
      case 3:
        return "Cancelled";
      default:
        return "";
    }
  };

  const filteredBloodRequests = filterBloodRequests();

  return (
    <>
      <List className="flex-row items-center w-1/3">
        <Typography variant="h5" color="blue-gray" className="ml-4">
          Filters:
        </Typography>
        {filters.map((filter, index) => (
          <ListItem className="p-0" key={filter}>
            <label
              htmlFor={`horizontal-list-${filter.toLowerCase()}`}
              className="flex w-full cursor-pointer items-center px-3 py-2"
            >
              <ListItemPrefix className="mr-3">
                <Checkbox
                  id={`horizontal-list-${filter.toLowerCase()}`}
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
                {filter}
              </Typography>
            </label>
          </ListItem>
        ))}
      </List>
      {filteredBloodRequests.map((request, index) => {
        const isAccommodated = request.isAccommodated || 0;

        return (
          <div
            key={index}
            className="flex items-start justify-center w-full relative px-24"
          >
            <Card
              className={`p-4 w-full shadow-md ${
                isAccommodated === 0 ? "rounded-tr-none" : ""
              }`}
            >
              <CardHeader
                color="transparent"
                floated={false}
                shadow={false}
                className="mx-0 flex items-center gap-4 pt-0 pb-8 relative"
              >
                <Avatar size="lg" variant="circular" src="/next.svg" />
                <div className="flex w-full justify-between gap-0.5">
                  <div className="flex flex-col">
                    <Typography variant="h5" color="blue-gray">
                      {`${request.first_name} ${request.middle_name} ${request.last_name}`}
                    </Typography>
                    <Typography color="blue-gray">
                      {formatDateTime(request.created_at)}
                    </Typography>
                  </div>
                  <div className="flex flex-col">
                    <Chip
                      variant="ghost"
                      size="lg"
                      color={
                        isAccommodated === 0
                          ? chipColor[2].color
                          : isAccommodated === 1
                          ? chipColor[0].color
                          : isAccommodated === 2
                          ? chipColor[1].color
                          : isAccommodated === 3
                          ? chipColor[3].color
                          : chipColor[3].color
                      }
                      value={
                        isAccommodated === 0
                          ? chipColor[2].text
                          : isAccommodated === 1
                          ? chipColor[0].text
                          : isAccommodated === 2
                          ? chipColor[1].text
                          : isAccommodated === 3
                          ? chipColor[3].text
                          : chipColor[3].text
                      }
                    >
                      {isAccommodated === 0
                        ? chipColor[2].text
                        : isAccommodated === 1
                        ? chipColor[0].text
                        : isAccommodated === 2
                        ? chipColor[1].text
                        : isAccommodated === 3
                        ? chipColor[3].text
                        : chipColor[3].text}
                    </Chip>

                    <Typography color="blue-gray">{`Request ID: ${request.request_id_number}`}</Typography>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="mb-2 p-0 grid grid-cols-3">
                <div className="col-span-1">
                  <Typography variant="h6" color="blue-gray">
                    Contact Details:
                  </Typography>
                  <Typography
                    variant="paragraph"
                    color="blue-gray"
                  >{`Email: ${request.email}`}</Typography>
                  <Typography
                    variant="paragraph"
                    color="blue-gray"
                  >{`Mobile: ${request.mobile}`}</Typography>
                </div>
                <div className="col-span-1">
                  <Typography
                    variant="paragraph"
                    color="blue-gray"
                  >{`Blood Type: ${request.blood_type}`}</Typography>
                  <Typography
                    variant="paragraph"
                    color="blue-gray"
                  >{`Number of Units Needed: ${request.blood_units}`}</Typography>
                  <Typography
                    variant="paragraph"
                    color="blue-gray"
                  >{`Blood Component Need: ${request.blood_component_desc}`}</Typography>
                </div>
                <div className="col-span-1">
                  <Typography
                    variant="paragraph"
                    color="blue-gray"
                  >{`Diagnosis: ${request.diagnosis}`}</Typography>
                  <Typography
                    variant="paragraph"
                    color="blue-gray"
                  >{`Hospital: ${request.hospital}`}</Typography>
                  <Typography
                    variant="paragraph"
                    color="blue-gray"
                  >{`Schedule: ${formatDateTime(
                    request.schedule
                  )}`}</Typography>
                </div>
                <div className="col-span-1">
                  {request.cancel_reason && (
                    <Typography variant="h5" color="blue-gray" className="my-4">
                      Reason of Cancellation: {request.cancel_reason}
                    </Typography>
                  )}
                  {request.remarks && (
                    <Typography variant="h5" color="blue-gray" className="my-4">
                      Remarks: {request.remarks}
                    </Typography>
                  )}
                </div>
              </CardBody>
              <CardFooter className="px-0">
                {renderAccordion(request.blood_request_id)}
              </CardFooter>
            </Card>
            <div className="absolute top-0 right-14 flex flex-col items-start gap-5">
              {isAccommodated === 0 && (
                <>
                  <MarkAccomodated
                    bloodRequestId={request.blood_request_id}
                    fetchBloodRequest={fetchBloodRequest}
                  />
                  <MarkDeclined
                    bloodRequestId={request.blood_request_id}
                    fetchBloodRequest={fetchBloodRequest}
                  />
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
