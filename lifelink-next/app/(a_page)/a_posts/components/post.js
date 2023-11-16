import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Chip, Accordion, AccordionHeader, AccordionBody, Typography } from "@material-tailwind/react";
import { laravelBaseUrl } from "@/app/variables";
import { MarkAccomodated, MarkDeclined } from "./popup";

const TABLE_HEAD = ["Name", "Blood Type", "Email", "Mobile Number"];

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}

function formatDateTime(dateTimeString) {
  const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
  const formattedDateTime = new Date(dateTimeString).toLocaleDateString(undefined, options);
  return formattedDateTime;
}

export function PostCard({ bloodRequests, fetchBloodRequest }) {
  const chipColor = [
    { color: "gray", value: "Pending", text: "Pending" },
    { color: "green", value: "Accommodated", text: "Accommodated" },
    { color: "red", value: "Declined", text: "Declined" },
  ];

  const [openAccordions, setOpenAccordions] = useState([]);
  const [interestedDonor, setInterestedDonor] = useState([]);
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

        const response = await axios.get(`${laravelBaseUrl}/api/get-interested-donor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInterestedDonor(response.data.data);
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
      [bloodRequestId]: prevOpenAccordions[bloodRequestId] === 0 ? 1 : 0,
    }));
  };

  return (
    <>
      {bloodRequests.map((request, index) => {
        const isAccommodated = request.isAccommodated || 0; // Assuming that isAccommodated is a boolean property

        return (
          <div key={index} className="flex items-start justify-center w-full relative px-16">
            <Card className={`p-4 w-full shadow-md ${isAccommodated === 0 ? "rounded-tr-none" : ""}`}>
              <CardHeader color="transparent" floated={false} shadow={false} className="mx-0 flex items-center gap-4 pt-0 pb-8 relative">
                <Avatar size="lg" variant="circular" src="/next.svg" />
                <div className="flex w-full justify-between gap-0.5">
                  <div className="flex flex-col">
                    <Typography variant="h5" color="blue-gray">
                      {`${request.first_name} ${request.middle_name} ${request.last_name}`}
                    </Typography>
                    <Typography color="blue-gray">{formatDateTime(request.created_at)}</Typography>
                  </div>
                  <div className="flex flex-col">
                    <Chip variant="ghost" color={chipColor[isAccommodated].color} value={chipColor[isAccommodated].text}>
                      {chipColor[isAccommodated].text}
                    </Chip>
                    <Typography color="blue-gray">{`Request ID: ${request.request_id_number}`}</Typography>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="mb-2 p-0 grid grid-cols-3">
                <div className="col-span-1">
                  <Typography variant="h6" color="blue-gray">Contact Details:</Typography>
                  <Typography variant="paragraph" color="blue-gray">{`Email: ${request.email}`}</Typography>
                  <Typography variant="paragraph" color="blue-gray">{`Mobile: ${request.mobile}`}</Typography>
                </div>
                <div className="col-span-1">
                  <Typography variant="paragraph" color="blue-gray">{`Blood Type: ${request.blood_type}`}</Typography>
                  <Typography variant="paragraph" color="blue-gray">{`Number of Units Needed: ${request.blood_units}`}</Typography>
                  <Typography variant="paragraph" color="blue-gray">{`Blood Component Need: ${request.blood_component_desc}`}</Typography>
                </div>
                <div className="col-span-1">
                  <Typography variant="paragraph" color="blue-gray">{`Diagnosis: ${request.diagnosis}`}</Typography>
                  <Typography variant="paragraph" color="blue-gray">{`Hospital: ${request.hospital}`}</Typography>
                  <Typography variant="paragraph" color="blue-gray">{`Schedule: ${formatDateTime(request.schedule)}`}</Typography>
                </div>
              </CardBody>
              <CardFooter className="px-0">
                <Accordion
                  className="rounded-lg border border-blue-gray-100 px-4"
                  key={request.blood_request_id}
                  open={openAccordions[request.blood_request_id]}
                  icon={<Icon id={1} open={openAccordions[request.blood_request_id]} />}
                >
                  <AccordionHeader onClick={() => handleAccordionOpen(request.blood_request_id)}>
                    Total Interested Donors: {interestedDonor.length}
                  </AccordionHeader>
                  <AccordionBody>
                    {interestedDonor.length === 0 ? (
                      <p>No interested donors at the moment.</p>
                    ) : (
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
                          {interestedDonor.map(({ first_name, middle_name, last_name, blood_type, email, mobile }, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "even:bg-blue-gray-50/50" : ""}>
                              <td className="p-4">
                                <Typography variant="small" color="blue-gray" className="font-bold">
                                  {`${first_name}, ${middle_name} ${last_name}`}
                                </Typography>
                              </td>
                              <td className="p-4">
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                  {blood_type}
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
                    )}
                  </AccordionBody>
                </Accordion>
              </CardFooter>
            </Card>
            <div className="absolute top-0 right-6 flex flex-col items-start gap-5">
              {isAccommodated === 0 && (
                <>
                  <MarkAccomodated bloodRequestId={request.blood_request_id} fetchBloodRequest={fetchBloodRequest} />
                  <MarkDeclined bloodRequestId={request.blood_request_id} fetchBloodRequest={fetchBloodRequest} />
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
