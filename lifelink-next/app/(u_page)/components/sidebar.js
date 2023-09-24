"use client";
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
  } from "@material-tailwind/react";
  import {
    HomeIcon,
    ClockIcon,
    GlobeAltIcon,
    TruckIcon,
    UserIcon,
    ArrowLeftOnRectangleIcon,
  } from "@heroicons/react/24/solid";
  import axios from "axios";
  import Image from "next/image";
  import { laravelBaseUrl } from "@/app/variables";
  import { useRouter } from 'next/navigation';
  import Link from "next/link";
  import { useState, useEffect } from "react"; 



  export function UserSidebar() {
    const [userData, setUserData] = useState(null); 
    const router = useRouter();

    const handleLogout = async () => {
      const token = getCookie("token");
      if (!token) {
        router.push("./login");
        return;
      }
      try {
        const response = await axios.post(`${laravelBaseUrl}/api/logout`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        router.push("./login");
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const menuItems = [
      { icon: HomeIcon, text: "Dashboard", link: './u_dashboard' },
      { icon: ClockIcon, text: "History", link: './u_history' },
      { icon: GlobeAltIcon, text: "Network", link: './u_network' },
      { icon: TruckIcon, text: "Journey", link: './u_journey' },
      { icon: UserIcon, text: "Profile", link: './u_profile' },
      { icon: ArrowLeftOnRectangleIcon, text: "Log Out", link: '#', onClick: handleLogout },
    ];

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
  
          setUserData(response.data.data);
  
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      };
  
      fetchUserInfo();
    }, []);

    return (
      <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl bg-red-900 shadow-blue-gray-900/5">
        <div className="flex flex-col justify-center items-center mb-2 p-4 border-b border-gray-200">
          <Link href='./u_profile'>
            <Image src="/patient_icon.png" width={80} height={80} className="mb-4" />
          </Link>
          <Typography className="text-gray-100 font-bold text-2xl">{userData ? `${userData.first_name} ${userData.last_name}` : "Loading..."}</Typography>
          <Typography className="text-gray-100 font-light text-sm">Donor no: {userData ? userData.donor_no : "Loading..."}</Typography>
        </div>
        <List className="text-white">
          {menuItems.map((item, index) => (
            <Link href={item.link} key={index}>
              <ListItem onClick={item.onClick}>
                <ListItemPrefix>
                  {<item.icon className="h-5 w-5" />}
                </ListItemPrefix>
                {item.text}
              </ListItem>
            </Link>
          ))}
        </List>
      </Card>
    );
  }

  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
  }