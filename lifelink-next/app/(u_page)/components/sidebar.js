"use client";
import {
    Card,
    Drawer,
    Typography,
    List,
    Button,
    IconButton,
    Tooltip,
  } from "@material-tailwind/react";
  import {
    HomeIcon,
    ClockIcon,
    GlobeAltIcon,
    TruckIcon,
    UserIcon,
    ArrowLeftOnRectangleIcon,
    ChevronRightIcon,
    Bars3Icon,
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
      { icon: HomeIcon, text: "Dashboard", link: './dashboard' },
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
      <>
        <Card color="gray" variant="gradient" className="fixed top-4 left-4 h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 flex flex-col justify-between">
          <div className="w-full">
            <div className="flex justify-center items-center p-4 my-3">
              <Link href='./profile'>
                <Image src="/patient_icon.png" width={60} height={60} />
              </Link>
              <div className="flex flex-col ml-3 truncate">
                <Tooltip placement="right-end" content={`${userData ? userData.first_name : ""} ${userData ? userData.last_name : ""}`}>
                  <Typography className="text-gray-100 font-medium text-md truncate overflow-hidden max-w-[8rem]">
                    {userData ? `${userData.first_name} ${userData.last_name}` : "Loading..."}
                  </Typography> 
                </Tooltip>
                <Typography className="text-gray-100 font-light text-sm">Donor no: {userData ? userData.donor_no : "Loading..."}</Typography>
              </div>
            </div>
            <hr className="fading_divider_white mb-4" />
            <List className="max-w-full">
              {menuItems.map((item, index) => (
                <Link href={item.link} key={index} passHref>
                  <Button
                    variant={'.' + pathName === item.link ? 'gradient': 'text'}
                    color={'.' + pathName === item.link ? 'red' : undefined}
                    className='text-white flex items-center justify-between w-full hover:bg-gray-100 hover:bg-opacity-30'
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
            <hr className="fading_divider_white mb-4" />
          </div>
          <Button
            variant="text"
            color="red"
            className='text-white flex items-center justify-between w-full hover:bg-gray-100 hover:bg-opacity-30'
            onClick={handleLogout}
          >
            <div className="flex items-center gap-4">
              <ArrowLeftOnRectangleIcon className="h-5 w-5"/>
              <Typography variant="paragraph" className="normal-case font-medium">
                Log Out
              </Typography>
            </div>
          </Button>
        </Card>
      </>
    );
  }

  export function MobileUserSidebar({ openDrawer, closeDrawer }) {
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
      { icon: HomeIcon, text: "Dashboard", link: './dashboard' },
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
      <>
        <Drawer open={openDrawer} onClose={closeDrawer} overlay={false} className="xl:hidden bg-transparent">
          <Card color="gray" variant="gradient" className="xl:hidden fixed top-4 left-0 h-[calc(100vh-2rem)] w-full max-w-[20rem] p-2 flex flex-col justify-between">
            <div className="w-full">
              <div className="flex justify-center items-center p-4 my-3">
                <Link href='./profile'>
                  <Image src="/patient_icon.png" width={60} height={60} />
                </Link>
                <div className="flex flex-col ml-3 truncate">
                  <Tooltip placement="right-end" content={`${userData ? userData.first_name : ""} ${userData ? userData.last_name : ""}`}>
                    <Typography className="text-gray-100 font-medium text-md truncate overflow-hidden max-w-[8rem]">
                      {userData ? `${userData.first_name} ${userData.last_name}` : "Loading..."}
                    </Typography> 
                  </Tooltip>
                  <Typography className="text-gray-100 font-light text-sm">Donor no: {userData ? userData.donor_no : "Loading..."}</Typography>
                </div>
              </div>
              <hr className="fading_divider_white mb-4" />
              <List className="max-w-full">
                {menuItems.map((item, index) => (
                  <Link href={item.link} key={index} passHref>
                    <Button
                      variant={'.' + pathName === item.link ? 'gradient': 'text'}
                      color={'.' + pathName === item.link ? 'red' : undefined}
                      className='text-white flex items-center justify-between w-full hover:bg-gray-100 hover:bg-opacity-30'
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
              <hr className="fading_divider_white mb-4" />
            </div>
            <Button
              variant="text"
              color="red"
              className='text-white flex items-center justify-between w-full hover:bg-gray-100 hover:bg-opacity-30'
              onClick={handleLogout}
            >
              <div className="flex items-center gap-4">
                <ArrowLeftOnRectangleIcon className="h-5 w-5"/>
                <Typography variant="paragraph" className="normal-case font-medium">
                  Log Out
                </Typography>
              </div>
            </Button>
          </Card>
        </Drawer>
      </>
    );
  }

  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
  }