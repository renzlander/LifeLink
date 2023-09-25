"use client";
import {
    Card,
    Typography,
    List,
    Button,
  } from "@material-tailwind/react";
  import {
    HomeIcon,
    ClockIcon,
    GlobeAltIcon,
    TruckIcon,
    UserIcon,
    ArrowLeftOnRectangleIcon,
    ChevronRightIcon,
  } from "@heroicons/react/24/solid";
  import axios from "axios";
  import Image from "next/image";
  import Link from "next/link";
  import { useRouter, usePathname } from 'next/navigation';
  import { useState, useEffect } from "react"; 
  import { laravelBaseUrl } from "@/app/variables";



  export function UserSidebar() {
    const [userData, setUserData] = useState(null); 
    const router = useRouter();
    const pathName = usePathname();

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
      <Card  className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 bg-gradient-to-r from-red-900 to-red-700">
        <div className="flex flex-col justify-center items-center mb-2 p-4 border-b border-gray-200">
          <Link href='./u_profile'>
            <Image src="/patient_icon.png" width={80} height={80} className="mb-4" />
          </Link>
          <Typography className="text-gray-100 font-bold text-2xl">{userData ? `${userData.first_name} ${userData.last_name}` : "Loading..."}</Typography>
          <Typography className="text-gray-100 font-light text-sm">Donor no: {userData ? userData.donor_no : "Loading..."}</Typography>
        </div>
        <List>
          {menuItems.map((item, index) => (
            <Link href={item.link} key={index} passHref>
              <Button
                variant={'.' + pathName === item.link ? 'gradient': 'text'}
                color={'.' + pathName === item.link ? 'red' : ''}
                className='text-white flex items-center justify-between w-full hover:bg-gray-100 hover:bg-opacity-30'
                onClick={item.onClick}
              >
                <div className="flex items-center gap-4">
                  {<item.icon className="h-5 w-5" />}
                  <Typography variant="paragraph" className="normal-case font-medium">
                    {item.text}
                  </Typography>
                </div>
                {'.' + pathName === item.link ? <ChevronRightIcon className="h-5 w-5" /> : ''}
              </Button>
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