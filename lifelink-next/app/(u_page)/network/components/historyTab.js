import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

function formatDateTime(dateTimeString) {
  const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
  const formattedDateTime = new Date(dateTimeString).toLocaleDateString(undefined, options);
  return formattedDateTime;
}
const TABLE_HEAD = ["Request ID", "Date Requested", "Blood Type", "Units Requested", "Blood Components", "Status"]; 

export default function History() {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMyAllRequests = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("./login");
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/get-requested-blood`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMyRequests(response.data.data || []); // Use an empty array if data is null
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchMyAllRequests();
  }, []);

  return (
    <div className="mb-8">
      <Typography variant="subtitle2" className="font-bold text-lg mb-4 ml-4">
        Blood Request History
      </Typography>
      <div className="overflow-x-auto">
        {myRequests.length > 0 ? ( // Check if there are records
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={index}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <div className="flex items-center">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myRequests.map((request) => (
                <tr key={request.blood_request_id} className="bg-gray-100 hover:bg-gray-200">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {request.request_id_number}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {formatDateTime(request.created_at)}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {request.blood_type}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {request.blood_units}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {request.blood_component_desc}
                      </Typography>
                    </div>
                  </td>
                  <td className={`p-4 ${getStatusStyle(request)}`}>
                    <div className="flex items-center gap-3">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {getStatusText(request)}
                      </Typography>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Typography variant="h6" className="text-gray-600">
            No blood request records found.
          </Typography>
        )}
      </div>
    </div>
  );
}

function getStatusText(request) {
  if (request.status === 1) return "Cancelled";
  if (request.isAccommodated === 0) return "Pending";
  if (request.isAccommodated === 1) return "Granted";
  if (request.isAccommodated === 2) return "Declined";
  return "";
}

function getStatusStyle(request) {
  if (request.status === 1) return "text-red-500"; // Cancelled
  return "";
}


function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}