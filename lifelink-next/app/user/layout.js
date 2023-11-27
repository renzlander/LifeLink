'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import {
  BellIcon,
  ClockIcon,
  GlobeAltIcon,
  TruckIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";
import { 
    Bars3Icon,
 } from "@heroicons/react/24/outline";
import {
  Card,
  Typography,
  List,
  Button,
  IconButton,
  Tooltip,
  Navbar,
} from "@material-tailwind/react";
import { CreateRequest } from './network/components/CreateRequest';
import { MobileUserSidebar } from './components/SideBar';

export default function UserLayout({ children }) {
  const [userData, setUserData] = useState(null); 
  const [open, setOpen] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [MiniSide, setMiniSide] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const openMiniSide = () => setMiniSide(!MiniSide);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 1200 && setOpenNav(false)
    );
  }, []);
  
  const handleLogout = async () => {
    const token = getCookie("token");
    if (!token) {
      router.push("../login");
      return;
    }
    try {
      const response = await axios.post(`${laravelBaseUrl}/api/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      router.push("../login");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const menuItems = [
    { icon: Squares2X2Icon, text: "Dashboard", link: './dashboard' },
    { icon: ClockIcon, text: "History", link: './history' },
    { icon: GlobeAltIcon, text: "Network", link: './network' },
    { icon: TruckIcon, text: "Journey", link: './journey' },
    { icon: UserIcon, text: "Profile", link: './profile' },
  ];

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

  return (
    <div className="bg-gray-300 min-h-screen flex gap-6 p-4">
      <div className={`${MiniSide === true ? 'w-[80px]' : 'w-[240px]'} hidden xl:grid`}>
        {/* SIDEBAR START */}
        <Card 
          className={`fixed top-4 left-4 h-[calc(100vh-2rem)] w-full ${MiniSide === true ? 'max-w-[5rem] transition-max-w ease-in-out duration-100' : 'max-w-[15rem] transition-max-w ease-in-out duration-100'} py-4 flex flex-col justify-between`}
        >
          <div className="w-full">
            <div className={`flex ${MiniSide === true ? 'justify-center px-2' : 'justify-between px-6'} items-center`}>
              <IconButton variant='text' onClick={openMiniSide}>
                <EllipsisHorizontalIcon className="h-10 w-10" />
              </IconButton>
              <Image src="/logo_lifelink.png" width={100} height={40} className={MiniSide === true ? 'hidden' : 'block'} />
            </div>
            <div className={`flex ${MiniSide === true ? 'justify-center px-2' : 'justify-between px-6'} items-center py-4`}>
              <Link href='./profile'>
                <Image src="/patient_icon.png" width={40} height={40} />
              </Link>
              <div className={`${MiniSide === true ? 'hidden' : 'flex'} flex-col truncate`}>
                <Tooltip placement="right-end" content={`${userData ? userData.first_name : ""} ${userData ? userData.last_name : ""}`}>
                  <Typography className="text-gray-800 font-medium text-md truncate overflow-hidden max-w-[8rem]">
                    {userData ? `${userData.first_name} ${userData.last_name}` : "Loading..."}
                  </Typography> 
                </Tooltip>
                <Typography className="text-gray-800 font-light text-sm">Donor no: {userData ? userData.donor_no : "Loading..."}</Typography>
              </div>
            </div>
            <hr className="fading_divider_gray mb-4" />
            <List className={MiniSide === true ? 'min-w-[80px]' : ''}>
              {menuItems.map((item, index) => (
                <Link href={item.link} key={index} passHref>
                  {MiniSide === true ? (
                    <div className='flex justify-center'>
                      <Button
                        variant='text'
                        className={`${pathName.replace('/user', '.') === item.link ? 'bg-gray-300' : ''} text-gray-800 hover:bg-gray-300`}
                      >
                        {<item.icon className="h-5 w-5" />}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant='text'
                      className={`${pathName.replace('/user', '.') === item.link ? 'bg-gray-300' : ''} text-gray-800 flex items-center justify-between w-full hover:bg-gray-300`}
                    >
                      <div className="flex items-center gap-4">
                        {<item.icon className="h-5 w-5" />}
                        <Typography variant="paragraph" className="normal-case font-medium">
                          {item.text}
                        </Typography>
                      </div>
                    </Button>
                  )}
                </Link>
              ))}
            </List>
            <hr className="fading_divider_gray my-4" />
          </div>
          <div className='px-2 flex justify-center'>
            {MiniSide === true ? (
              <Button
                variant='text'
                className="text-gray-800 hover:bg-gray-300"
                onClick={handleLogout}
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              </Button>
              ) : (
              <Button
                variant="text"
                className='text-gray-800 flex items-center justify-between w-full hover:bg-gray-300'
                onClick={handleLogout}
              >
                <div className="flex items-center gap-4">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5"/>
                  <Typography variant="paragraph" className="normal-case font-medium">
                    Log Out
                  </Typography>
                </div>
              </Button>
            )}
          </div>
        </Card>
        {/* SIDEBAR END */}
      </div>
      <div className={`w-full ${MiniSide === true ? 'xl:w-[calc(100%-80px)]' : 'xl:w-[calc(100%-240px)]'} flex flex-col items-center justify-center`}>
        <MobileUserSidebar openDrawer={open} closeDrawer={closeDrawer} userData={userData} />
        {/* NAVBAR START */}
        <Navbar className="bg-red-700 bg-opacity-100 border-none sticky top-0 z-50 h-max max-w-full py-2 px-4 xl:px-6 xl:py-4">
          <div className="flex items-center justify-between text-blue-gray-900">
            <IconButton onClick={openDrawer} color='white' variant="text" className="xl:hidden">
              <Bars3Icon className="h-5 w-5" />
            </IconButton>
            <div>
            </div>
            <div className="flex items-center gap-4">
              <IconButton variant="text" color='white'>
                  <BellIcon className="h-6 w-6" />
              </IconButton>
            </div>
          </div>
        </Navbar>
        {/* NAVBAR END */}
        {children}
      </div>
      <div  className="fixed bottom-10 right-10">
        {"." + pathName === "./network" ? <CreateRequest /> : ""}
      </div>
    </div>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}