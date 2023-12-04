"use client";
import { laravelBaseUrl } from "@/app/variables";
import {
  ArrowLeftOnRectangleIcon,
  ClockIcon,
  GlobeAltIcon,
  HomeIcon,
  TruckIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  Drawer,
  List,
  Tooltip,
  Typography
} from "@material-tailwind/react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';

  export function MobileUserSidebar({ openDrawer, closeDrawer, userData }) {
    const router = useRouter();
    const pathName = usePathname();

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

    return (
      <>
        <Drawer open={openDrawer} onClose={closeDrawer} overlay={false} size={257} className="xl:hidden bg-transparent">
          <Card 
            className='fixed top-4 left-4 h-[calc(100vh-2rem)] w-full max-w-[15rem] py-4 flex flex-col justify-between'
            >
            <div className="w-full">
              <div className='flex justify-between px-6 items-center'>
                <Image src="/prc_logo.png" width={40} height={40} />
                <Image src="/logo_lifelink.png" width={100} height={40} />
              </div>
              <div className='flex justify-between px-6 items-center py-4'>
                <Link href='./profile'>
                  <Image src="/patient_icon.png" width={40} height={40} />
                </Link>
                <div className='flex flex-col truncate'>
                  <Tooltip placement="right-end" content={`${userData ? userData.first_name : ""} ${userData ? userData.last_name : ""}`}>
                    <Typography className="text-gray-800 font-medium text-md truncate overflow-hidden max-w-[8rem]">
                      {userData ? `${userData.first_name} ${userData.last_name}` : "Loading..."}
                    </Typography> 
                  </Tooltip>
                  <Typography className="text-gray-800 font-light text-sm">Donor no: {userData ? userData.donor_no : "Loading..."}</Typography>
                </div>
              </div>
              <hr className="fading_divider_gray mb-4" />
              <List className='min-w-max'>
                {menuItems.map((item, index) => (
                  <Link href={item.link} key={index} passHref>
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
                  </Link>
                ))}
              </List>
              <hr className="fading_divider_gray my-4" />
            </div>
            <div className='px-2 flex justify-center'>
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
            </div>
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