import React, { useEffect, useState } from "react";
import {
  Navbar,
  Collapse,
  IconButton,
} from "@material-tailwind/react";
import { 
    XMarkIcon,
    Bars3Icon,
 } from "@heroicons/react/24/outline";
 import { 
    BellIcon,
  } from "@heroicons/react/24/solid";
 import { BreadcrumbsDefault } from "./breadcrumbs";
 import { MobileUserSidebar } from "./sidebar";

export function UserNavbar() {
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 1200 && setOpenNav(false)
    );
  }, []);

  return (
    <Navbar className="sticky top-0 z-50 h-max max-w-full py-2 px-4 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
            <IconButton onClick={openDrawer} variant="text" className="lg:hidden">
              <Bars3Icon className="h-5 w-5" />
            </IconButton>
            {/* <BreadcrumbsDefault /> */}
            <div>
            </div>
            <div className="flex items-center gap-4">
                <IconButton variant="text">
                    <BellIcon className="h-6 w-6" />
                </IconButton>
                <IconButton
                    variant="text"
                    className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                    ripple={false}
                    onClick={() => setOpenNav(!openNav)}
                >
                    {openNav ? (<XMarkIcon className="h-5 w-5" />) : (<Bars3Icon className="h-5 w-5" />)}
                </IconButton>
            </div>
        </div>
        <Collapse open={openNav}>
          <div className="flex items-center gap-x-1">
          </div>
        </Collapse>
    </Navbar>
  );
}