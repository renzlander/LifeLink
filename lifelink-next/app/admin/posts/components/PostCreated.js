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
} from "@material-tailwind/react";

import { laravelBaseUrl } from "@/app/variables";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditPost, DeletePost } from "./Popup";

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
export function PostCreated() {
  const router = useRouter();
  const [createdPosts, setCreatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(false);

  const fetchCreatedPosts = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("./login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-created-posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("dasdsad", response);
      setCreatedPosts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching created posts:", error);
    }
  };

  useEffect(() => {
    fetchCreatedPosts();
  }, [router]);

  return (
    <div>
      {createdPosts.map((post) => (
        <div
          key={post.blood_request_id}
          className="flex items-start justify-center w-full relative px-24 my-4"
        >
          <Card shadow={false} className="p-4 w-full shadow-md rounded-tr-none">
            <CardHeader
              color="transparent"
              floated={false}
              shadow={false}
              className="w-full m-0 flex 2xl:flex-row flex-col items-center justify-between"
            >
              <div className="flex gap-4">
                <Avatar size="md" variant="circular" src="/prc_logo.png" />
                <div className="flex flex-col items-start">
                  <Typography variant="h5" color="blue-gray">
                    Philippine Red Cross Valenzuela City Chapter
                  </Typography>
                  <Typography color="blue-gray" variant="small">
                    {formatDateTime(post.created_at)}
                  </Typography>
                </div>
              </div>
            </CardHeader>
            <CardBody className="mt-6 p-0">
              <div className="w-full flex flex-col 2xl:flex-row items-start justify-between">
                <Typography variant="h6" color="blue-gray">
                  Blood Type Need : <span>{post.blood_needs}</span>
                </Typography>
                <div className="flex flex-col items-start">
                  <Typography
                    color="blue-gray"
                    variant="h6"
                    className="text-base"
                  >
                    Donation Date:
                    <span className="font-medium">
                      {" "}
                      {formatDateTime(post.donation_date)}
                    </span>
                  </Typography>
                  <Typography
                    color="blue-gray"
                    variant="h6"
                    className="text-base"
                  >
                    Venue : <span className="font-medium"> {post.venue}</span>
                  </Typography>
                </div>
              </div>

              <Typography color="blue-gray" className="mt-2 p-">
                {post.body}
              </Typography>

              {post.interested_donors && post.interested_donors.length > 0 ? (
                <Accordion
                  className="rounded-lg border border-blue-gray-100 px-4"
                  open={openAccordion}
                  icon={<Icon id={1} open={openAccordion} />}
                >
                  <AccordionHeader
                    onClick={() => setOpenAccordion(!openAccordion)}
                  >
                    <Typography variant="h6" color="blue-gray">
                      Interested Donors
                    </Typography>
                  </AccordionHeader>
                  <AccordionBody>
                    <table className="w-full min-w-max table-auto text-left mt-4">
                      <thead>
                        <tr>
                          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal leading-none opacity-70"
                            >
                              Name
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal leading-none opacity-70"
                            >
                              Blood Type
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal leading-none opacity-70"
                            >
                              Email
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal leading-none opacity-70"
                            >
                              Mobile
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal leading-none opacity-70"
                            >
                              isDeferred
                            </Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {post.interested_donors.map((donor, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "even:bg-blue-gray-50/50" : ""
                            }
                          >
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-bold"
                              >
                                {`${donor.first_name} ${donor.middle_name} ${donor.last_name}`}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {donor.blood_type}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {donor.email}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {donor.mobile}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {donor.remarks !== 0 ? "Yes" : "No"}
                              </Typography>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </AccordionBody>
                </Accordion>
              ) : (
                <Typography
                  variant="paragraph"
                  color="blue-gray"
                  className="mt-4"
                >
                  No interested donors at the moment.
                </Typography>
              )}
            </CardBody>
          </Card>
          <div className="absolute top-0 right-14 flex flex-col items-start gap-5">
            <EditPost
              bloodRequestId={post.blood_request_id}
              post={post}
              refreshData={fetchCreatedPosts}
            />
            <DeletePost
              bloodRequestId={post.blood_request_id}
              refreshData={fetchCreatedPosts}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
