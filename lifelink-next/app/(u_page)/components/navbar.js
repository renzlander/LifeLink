import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Card,
  Collapse,
} from "@material-tailwind/react";
import { 
    XMarkIcon,
    Bars3Icon,
 } from "@heroicons/react/24/outline";
 import { 
    BellIcon,
  } from "@heroicons/react/24/solid";
 import { BreadcrumbsDefault } from "./breadcrumbs";
export function UserNavbar() {
  const [openNav, setOpenNav] = React.useState(false);
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);
 
  // const navList = (
  //   <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
  //     <Typography
  //       as="li"
  //       variant="small"
  //       color="blue-gray"
  //       className="p-1 font-normal"
  //     >
  //       <a href="#" className="flex items-center">
  //         Pages
  //       </a>
  //     </Typography>
  //     <Typography
  //       as="li"
  //       variant="small"
  //       color="blue-gray"
  //       className="p-1 font-normal"
  //     >
  //       <a href="#" className="flex items-center">
  //         Account
  //       </a>
  //     </Typography>
  //     <Typography
  //       as="li"
  //       variant="small"
  //       color="blue-gray"
  //       className="p-1 font-normal"
  //     >
  //       <a href="#" className="flex items-center">
  //         Blocks
  //       </a>
  //     </Typography>
  //     <Typography
  //       as="li"
  //       variant="small"
  //       color="blue-gray"
  //       className="p-1 font-normal"
  //     >
  //       <a href="#" className="flex items-center">
  //         Docs
  //       </a>
  //     </Typography>
  //   </ul>
  // );
 
  return (
    <Navbar className="sticky top-0 z-50 h-max max-w-full rounded-lg py-2 px-4 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
            <BreadcrumbsDefault />
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
            {/* {navList} */}
        </Collapse>
    </Navbar>
  );
}