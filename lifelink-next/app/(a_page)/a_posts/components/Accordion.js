import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Accordion, AccordionHeader, AccordionBody, Typography } from "@material-tailwind/react";
import { laravelBaseUrl } from "@/app/variables";

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

export function InterestAccordion() {
  const [openAccordions, setOpenAccordions] = React.useState([]);
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
    <div>
      {interestedDonor.map(({ blood_request_id }) => (
        <Accordion key={blood_request_id} open={openAccordions[blood_request_id]} icon={<Icon id={1} open={openAccordions[blood_request_id]} />}>
          <AccordionHeader onClick={() => handleAccordionOpen(blood_request_id)}>
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
      ))}
    </div>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}