"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function NavbarIndex() {
  const router = useRouter();
  const pathName = usePathname();
  const [openNav, setOpenNav] = useState(false);

  const navList = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "News",
      path: "/news",
    },
    {
      name: "Blood Banks",
      path: "/banks",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact Us",
      path: "/contacts",
    },
  ];

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);
  return (
    <Navbar className="my-2 mx-auto min-w-full py-2 px-4 lg:px-8 lg:py-4">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Image src="/logo_lifelink.png" alt="Logo" width={100} height={50} />
        <div className="hidden lg:block">
          <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            {navList.map((item, index) => (
              <Typography
                as="li"
                key={index}
                variant="small"
                color={pathName === item.path ? "red" : "blue-gray"}
                className="p-1 font-medium hover:text-red-800"
              >
                <Link href={item.path} className="flex items-center">
                  {item.name}
                </Link>
              </Typography>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-x-1">
          <Button
            onClick={() => {
              router.push("/login");
            }}
            variant="text"
            size="sm"
            className="hidden lg:inline-block"
          >
            <span>Log In</span>
          </Button>
          <Button
            onClick={() => {
              router.push("/register");
            }}
            variant="gradient"
            size="sm"
            className="hidden lg:inline-block"
          >
            <span>Sign Up</span>
          </Button>
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
          {navList.map((item, index) => (
            <Typography
              as="li"
              key={index}
              variant="small"
              color="blue-gray"
              className="p-1 font-medium"
            >
              <Link href={item.path} className="flex items-center">
                {item.name}
              </Link>
            </Typography>
          ))}
        </ul>
        <div className="flex items-center gap-x-1">
          <Button
            onClick={() => {
              router.push("/login");
            }}
            fullWidth
            variant="text"
            size="sm"
            className=""
          >
            <span>Log In</span>
          </Button>
          <Button
            onClick={() => {
              router.push("/register");
            }}
            fullWidth
            variant="gradient"
            size="sm"
            className=""
          >
            <span>Sign Up</span>
          </Button>
        </div>
      </Collapse>
    </Navbar>
  );
}
