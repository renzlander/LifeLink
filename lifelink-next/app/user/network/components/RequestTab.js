import { laravelBaseUrl } from "@/app/variables";
import { CheckIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Interested } from "./Popup";
import { PostCard } from "./Post";
import { CancelRequest } from "./Popup";

const chipColor = [
  { color: "green", value: "Granted", text: "Granted" },
  { color: "orange", value: "Referred", text: "Referred" },
  { color: "gray", value: "Pending", text: "Pending" },
  { color: "red", value: "Cancelled", text: "Cancelled" },
];

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

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

function hideMiddleCharacters(text) {
  if (text && text.length && text.length > 2) {
    const hiddenPart = "*".repeat(text.length - 2);
    return text[0] + hiddenPart + text.slice(-1);
  } else {
    return text;
  }
}

export default function Request() {
  const router = useRouter();
  const status = ["All", "Approved", "Pending", "Referred"];
  const [userDetails, setUserDetails] = useState(null);
  const [latestBloodRequest, setLatestBloodRequest] = useState([]);
  const [adminPosts, setAdminPosts] = useState([]);
  const [interestedBloodRequests, setInterestedBloodRequests] = useState([]);
  const [mySchedule, setMySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestId, setRequestId] = useState([]);

  const fetchAllRequestIds = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("./login");
        return;
      }

      const response = await axios.get(`${laravelBaseUrl}/api/get-admin-post`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdminPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const fetchAllMyInterest = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("./login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-my-interest`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setInterestedBloodRequests(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const fetchMySchedule = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("./login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-my-schedule-donation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setMySchedule(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("./login");
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserDetails(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    const fetchLatestBloodRequest = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("./login");
          return;
        }

        const response = await axios.get(
          `${laravelBaseUrl}/api/get-latest-blood-request`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          setLatestBloodRequest(response.data.data);
          setLoading(false);
        } else {
          console.error("Error fetching latest-blood-request:", error);
        }
      } catch (error) {
        console.error("Error fetching latest-blood-request:", error);
      }
    };

    fetchUserInfo();
    fetchLatestBloodRequest();
    fetchAllRequestIds();
    fetchMySchedule();
    fetchAllMyInterest();
  }, []);

  const handleInterestedClick = (bloodRequestId) => {
    setRequestId(bloodRequestId);
  };

  const isInterested = (bloodRequestId) => {
    return interestedBloodRequests.includes(bloodRequestId);
  };

  const updateInterestedBloodRequests = (bloodRequestId) => {
    setInterestedBloodRequests([...interestedBloodRequests, bloodRequestId]);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen max-w-full flex-col py-2 justify-center items-center">
        <Spinner color="red" className="h-16 w-16" />
        <p className="mb-[180px] text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-4 flex flex-col lg:flex-row md:flex-col sm:flex-col gap-4">
        <div className="mb-4 p-4 bg-gray-300  text-black rounded-lg w-full">
          {/* START of ongoing request of the user */}
          <div className="flex justify-between items-center">
            <Typography
              className="text-xl font-bold"
              variant="h6"
              color="black"
            >
              My Recent Blood Request
            </Typography>
            {latestBloodRequest && (
              <Chip
                variant="ghost"
                size="lg"
                className="lg:w-1/6"
                color={
                  latestBloodRequest.isAccommodated === 0
                    ? chipColor[2].color // Pending color
                    : latestBloodRequest.isAccommodated === 1
                    ? chipColor[0].color // Granted color
                    : latestBloodRequest.isAccommodated === 2
                    ? chipColor[1].color // Referred color
                    : latestBloodRequest.isAccommodated === 3
                    ? chipColor[3].color // Cancelled color
                    : chipColor[3].color // Default to 'Cancelled' color for unknown cases
                }
                value={
                  latestBloodRequest.isAccommodated === 0
                    ? chipColor[2].text // Pending text
                    : latestBloodRequest.isAccommodated === 1
                    ? chipColor[0].text // Granted text
                    : latestBloodRequest.isAccommodated === 2
                    ? chipColor[1].text // Referred text
                    : latestBloodRequest.isAccommodated === 3
                    ? chipColor[3].text // Cancelled text
                    : chipColor[3].text // Default to 'Cancelled' text for unknown cases
                }
              />
            )}
          </div>

          <hr className="my-2 p-[1.0px] m-2 bg-black"></hr>

          {latestBloodRequest ? (
            <div className="flex flex-col items-center w-full">
              <div className="border w-full p-4 mb-4 bg-gray-100 rounded-lg">
                <Typography variant="h6" className="font-bold mb-2">
                  Request Information
                </Typography>
                <div className="flex flex-col p-2">
                  <Typography variant="h6">
                    No. of Units:
                    <span className="font-normal ml-3">
                      {latestBloodRequest.blood_units}
                    </span>
                  </Typography>
                  <Typography variant="h6">
                    Blood Component:
                    <span className="font-normal ml-3">
                      {latestBloodRequest.blood_component_desc}
                    </span>
                  </Typography>
                </div>
                <div className="flex flex-col p-2">
                  <Typography variant="h6">
                    Hospital:
                    <span className="font-normal ml-3">
                      {latestBloodRequest.hospital}
                    </span>
                  </Typography>
                  <Typography variant="h6">
                    Diagnosis:
                    <span className="font-normal ml-3">
                      {hideMiddleCharacters(latestBloodRequest.diagnosis)}
                    </span>
                  </Typography>
                </div>
                <div className="flex flex-col p-2">
                  <Typography variant="h6">
                    Schedule of Transfusion/Operation:
                    <span className="font-normal ml-3">
                      {formatDate(latestBloodRequest.schedule)}
                    </span>
                  </Typography>
                </div>
                <div className="flex flex-col p-2">
                  {latestBloodRequest &&
                    latestBloodRequest.isAccommodated === 0 && (
                      <CancelRequest />
                    )}
                </div>
              </div>
            </div>
          ) : (
            <Typography
              color="textSecondary"
              variant="h6"
              className="p-4 text-center w-full"
            >
              No Ongoing Requests
            </Typography>
          )}
        </div>
        {/* END of ongoing request of the user */}

        {/* START of the schedule of the donor */}
        <div className="w-full mb-4 p-4 bg-gradient-to-r from-[rgba(40,40,40,1)] to-[rgba(160,12,8,1)] text-white rounded-lg">
          {mySchedule ? (
            <>
              <Typography variant="h6" color="white">
                Donation Schedule Reminder
              </Typography>
              <div className="flex flex-col mt-2">
                <Typography color="white">
                  You have a scheduled donation on
                </Typography>
                <Typography variant="h6" color="white">
                  {formatDate(mySchedule.donation_date)}, on {mySchedule.venue}
                </Typography>
                <Typography color="white">
                  Thank you for your commitment to this life-saving cause.
                </Typography>
              </div>
            </>
          ) : (
            <>
              <Typography variant="h6" color="white">
                Donation Schedule Reminder
              </Typography>
              <div className="flex flex-col mt-2">
                <Typography color="white">
                  You currently don't have any upcoming scheduled donations.
                  Thank you for considering to contribute to this life-saving
                  cause.
                </Typography>
              </div>
            </>
          )}
        </div>
        {/* END of the schedule of the donor */}
      </div>

      <hr className="my-2 p-[2.0px] m-2 bg-black"></hr>

      {/* START of the Admin Posts */}
      <div className="m-4">
        {adminPosts.map((post) => (
          <Card
            key={post.blood_request_id}
            shadow={false}
            className="p-4 w-full shadow-md my-4"
          >
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
                    {formatDate(post.created_at)}
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
                      {formatDate(post.donation_date)}
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
              <Typography color="blue-gray" className="mt-2">
                {post.body}
              </Typography>
              {isInterested(post.blood_request_id) ? (
                <Button
                  disabled
                  color="green"
                  variant="gradient"
                  className="w-1/8 mt-4"
                >
                  <span className="flex items-center">
                    Already Interested
                    <CheckIcon className="h-5 w-5 ml-2" />
                  </span>
                </Button>
              ) : (
                <Interested
                  requestId={post.blood_request_id}
                  onInterestedClick={() =>
                    handleInterestedClick(post.blood_request_id)
                  }
                  updateInterestedBloodRequests={updateInterestedBloodRequests}
                  fetchMySchedule={fetchMySchedule}
                  bloodNeed={post.blood_needs}
                />
              )}
            </CardBody>
          </Card>
        ))}
      </div>
      {/* END of the Admin Posts */}
    </>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
