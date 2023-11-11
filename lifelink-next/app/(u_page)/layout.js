'use client';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import { DrawerHeader, AppBar, Drawer, } from './components/constants';
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react"; 
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  HomeIcon,
  ClockIcon,
  GlobeAltIcon,
  TruckIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
  Bars3Icon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import {
  Typography,
  List,
  Button,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { CreatePost } from './components/popup';

export default function UserLayout({ children }) {
  const theme = useTheme();
  const [userData, setUserData] = useState(null); 
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menuItems = [
    { icon: HomeIcon, text: "Dashboard", link: './dashboard' },
    { icon: ClockIcon, text: "History", link: './history' },
    { icon: GlobeAltIcon, text: "Network", link: './network' },
    { icon: TruckIcon, text: "Journey", link: './journey' },
    { icon: UserIcon, text: "Profile", link: './profile' },
    // { icon: Cog6ToothIcon, text: "Settings", link: './Settings' },
  ];

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
    <Box sx={{ display: 'flex', backgroundColor: '#e5e7eb', width: '100%' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            variant="text"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
          >
            <Bars3Icon className='h-6 w-6 text-gray-600' />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4}}>
          <Image src='/prc_logo.png' width={50} height={50} alt='Red Cross'/>
          {open ? (
              <Image src='/logo_lifelink.png' width={120} height={50} className='drop-shadow-md' alt='Lifelink' />
            ) : (
              ''
            )
          }
        </DrawerHeader>
        <hr className='fading_divider_white' />
        <div className="flex justify-center items-center p-4 my-3">
          <Link href='./profile'>
            <Image src="/patient_icon.png" width={60} height={60} alt='User Profile' />
          </Link>
              {open ? (
                <div className="flex flex-col ml-3 truncate">
                  <Tooltip placement="right-end" content={`${userData ? userData.first_name : ""} ${userData ? userData.last_name : ""}`}>
                    <Typography className="text-gray-100 font-medium text-md truncate overflow-hidden max-w-[8rem]">
                      {userData ? `${userData.first_name} ${userData.last_name}` : "Loading..."}
                    </Typography>
                  </Tooltip>
                  <Typography className="text-gray-100 font-light text-sm">Donor no: {userData ? userData.donor_no : "Loading..."}</Typography>
                </div>
                ) : (
                  ''
                )
              }
              <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
        </div>
        <hr className='fading_divider_white' />
        <List>
          {menuItems.map((item, index) => (
            <Link href={item.link} key={index} passHref>
              {open ? (pathName,
                <Button
                  variant={'.' + pathName === item.link ? 'gradient' : 'text'}
                  color={'.' + pathName === item.link ? 'red' : undefined}
                  className='text-white flex items-center justify-between w-full hover:bg-gray-100 hover:bg-opacity-30'
                >
                  <div className="flex items-center gap-4">
                    {<item.icon className="h-6 w-6" />}
                    <Typography variant="paragraph" className="normal-case font-medium">
                      {item.text}
                    </Typography>
                  </div>
                  {'.' + pathName === item.link ? <ChevronRightIcon className="h-5 w-5" /> : ''}
                </Button>
              ) : (
                <IconButton
                  variant={'.' + pathName === item.link ? 'gradient' : 'text'}
                  color={'.' + pathName === item.link ? 'red' : undefined}
                  size='lg'
                  className='text-white flex items-center justify-between w-full hover:bg-gray-100 hover:bg-opacity-30'
                >
                  {<item.icon className="h-6 w-6" />}
                </IconButton>
              )}
            </Link>
          ))}
        </List>
        <hr className="fading_divider_white my-2" />
        { open ? (
          <List>
            <Button
              variant="text"
              color="red"
              className='text-white flex items-center justify-between w-full hover:bg-gray-100 hover:bg-opacity-30'
              onClick={handleLogout}
            >
              <div className="flex items-center gap-4">
                <ArrowLeftOnRectangleIcon className="h-6 w-6"/>
                <Typography variant="paragraph" className="normal-case font-medium">
                  Log Out
                </Typography>
              </div>
            </Button>
          </List>
          ) : (
          <div className='w-full flex items-center justify-center'>
            <IconButton variant='text' size='lg' onClick={handleLogout} className='w-full text-white hover:bg-gray-100 hover:bg-opacity-30'>
              <ArrowLeftOnRectangleIcon className="h-6 w-6"/>
            </IconButton>
          </div>
          )
        }
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <DrawerHeader />
        {children}
        {"." + pathName === "./u_network" ? <CreatePost /> : ""}
      </Box>
    </Box>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}