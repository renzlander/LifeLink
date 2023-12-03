"use client";
import { laravelBaseUrl } from "@/app/variables";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Tab,
  Tabs,
  TabsBody,
  TabsHeader,
  TabPanel,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FilterCheckBox } from "./components/Filters";
import { PostCard } from "./components/Post";
import { PostCreated } from "./components/PostCreated";

export default function Home() {
  const [bloodRequests, setLatestBloodRequests] = useState([]);
  const router = useRouter();

  const fetchBloodRequest = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("./login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-blood-request`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLatestBloodRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  useEffect(() => {
    fetchBloodRequest();
  }, []);

  const data = [
    {
      label: "Blood Requests",
      value: "req",
      content: 
      <>
        {/* <FilterCheckBox /> */}
        <PostCard bloodRequests={bloodRequests} fetchBloodRequest={fetchBloodRequest} />
      </>,
    },
    {
      
      label: "Created Posts",
      value: "post",
      content: <PostCreated />,
    }
  ];

  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between p-12">
      <Card className="h-full w-full mt-4 bg-gray-100">
        <CardHeader color="red" className="relative h-16 flex items-center mb-4">
          <Typography variant="h4" color="white" className="ml-4">
            Blood Network
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0">
          <Tabs value="req">
            <TabsHeader className="sticky top-0 mx-10 bg-gray-300">
              {data.map(({ label, value }) => (
                <Tab key={value} value={value}>
                  {label}
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody className="overflow-y-auto max-h-[120vh]">
              {data.map(({ value, content }) => (
                <TabPanel key={value} value={value} className="grid gap-6">
                  {content}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
