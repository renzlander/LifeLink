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
    <Card className="w-full">
      <CardBody className="h-screen">
        <div className="mb-8">
          <Typography variant="subtitle2" className="font-bold text-lg mb-4">
            Blood Request History
          </Typography>
          <div className="overflow-x-auto">
            {myRequests.length > 0 ? ( // Check if there are records
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Request ID</th>
                    <th className="px-4 py-2">Date Requested</th>
                    <th className="px-4 py-2">Blood Type</th>
                    <th className="px-4 py-2">Units Requested</th>
                    <th className="px-4 py-2">Blood Components</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map((request) => (
                    <tr key={request.blood_request_id} className="bg-gray-100 hover:bg-gray-200">
                      <td className="px-4 py-2">{request.request_id_number}</td>
                      <td className="px-4 py-2">{formatDateTime(request.created_at)}</td>
                      <td className="px-4 py-2">{request.blood_type}</td>
                      <td className="px-4 py-2">{request.blood_units}</td>
                      <td className="px-4 py-2">{request.blood_component_desc}</td>
                      <td className={`px-4 py-2 ${getStatusStyle(request)}`}>
                        {getStatusText(request)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography variant="body2" className="text-gray-600">
                No blood request records found.
              </Typography>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
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