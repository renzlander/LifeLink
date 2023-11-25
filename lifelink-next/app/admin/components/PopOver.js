import { laravelBaseUrl } from "@/app/variables";
import {
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemPrefix,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPopover() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          router.push("../login");
          return;
        }

        const response = await axios.get(`${laravelBaseUrl}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      const token = getCookie("token");
      const response = await axios.post(`${laravelBaseUrl}/api/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      router.push("../login");
      console.log(response.data);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Popover placement="bottom">
      <PopoverHandler>
        <Button className="bg-red-900 text-white rounded-full flex justify-center items-center gap-2">
          {userData
            ? `${userData.first_name} ${userData.last_name}`
            : "Loading..."}
          <ChevronDownIcon className="h-5 w-5" />
        </Button>
      </PopoverHandler>
      <PopoverContent className="w-72 z-[9999]">
        <div className="mb-4 flex items-center gap-4 border-b border-blue-gray-50 pb-4">
          <Avatar src="../next.svg" />
          <div>
            <Typography variant="h6" color="blue-gray">
              {userData
                ? `${userData.first_name} ${userData.last_name}`
                : "Loading..."}
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              Administrator
            </Typography>
          </div>
        </div>
        <List className="p-0">
          <Link href="./AdminSettings" className="text-initial">
            <ListItem>
              <ListItemPrefix>
                <Cog6ToothIcon className="h-5 w-5" />
              </ListItemPrefix>
              Settings
            </ListItem>
          </Link>
          <ListItem onClick={handleLogout}>
            <ListItemPrefix>
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </PopoverContent>
    </Popover>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
