'use client';
import * as React from 'react';
import { useState, useEffect } from "react"; 
import { usePathname } from 'next/navigation';
import {
  BellIcon,
} from "@heroicons/react/24/solid";
import { 
    Bars3Icon,
 } from "@heroicons/react/24/outline";
import {
  Typography,
  List,
  Button,
  IconButton,
  Tooltip,
  Navbar,
} from "@material-tailwind/react";
import { CreateRequest } from './network/components/CreateRequest';
import { UserSidebar, MobileUserSidebar } from './components/sidebar';

export default function UserLayout({ children }) {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);
  const [openNav, setOpenNav] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 1200 && setOpenNav(false)
    );
  }, []);
  
  return (
    <div className="bg-gray-300 min-h-screen flex gap-6 p-4">
      <div className='w-[320px] hidden xl:grid'>
        <UserSidebar />
      </div>
      <div className='w-full xl:w-[calc(100%-320px)] flex flex-col items-center justify-center'>
        <MobileUserSidebar openDrawer={open} closeDrawer={closeDrawer} />
        {/* NAVBAR START */}
        <Navbar className="sticky top-0 z-50 h-max max-w-full py-2 px-4 xl:px-8 xl:py-4">
          <div className="flex items-center justify-between text-blue-gray-900">
            <IconButton onClick={openDrawer} variant="text" className="xl:hidden">
              <Bars3Icon className="h-5 w-5" />
            </IconButton>
            <div>
            </div>
            <div className="flex items-center gap-4">
              <IconButton variant="text">
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