"use client";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import {
  Bars3BottomLeftIcon,
  Bars3Icon,
  ChevronUpIcon,
  ClipboardDocumentIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  InboxStackIcon,
  ListBulletIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  TrashIcon,
  TruckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Tooltip as Guide, IconButton } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppBar, Drawer, DrawerHeader } from "./components/Constants";
import UserPopover from "./components/PopOver";
import { CreatePost } from "./posts/components/CreatePost";

export default function AdminLayout({ children }) {
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const [open, setOpen] = React.useState(false);
  const [showScrollButton, setShowScrollButton] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY >= 430);
    };

    // Attach the scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures the effect runs only once,

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const links = [
    { href: "./dashboard", text: "Dashboard", icon: <Squares2X2Icon /> },
    { href: "./users", text: "Users", icon: <UserIcon /> },
    { href: "./donorlist", text: "Donor List", icon: <ListBulletIcon /> },
    { href: "./bags", text: "Blood Bags", icon: <ShoppingBagIcon /> },
    {
      href: "./inventory",
      text: "Blood Inventory",
      icon: <InboxStackIcon />,
    },
    {
      href: "./deferrallist",
      text: "Deferral List",
      icon: <ExclamationTriangleIcon />,
    },
    {
      href: "./dispensed",
      text: "Dispensed Blood",
      icon: <TruckIcon />,
    },
    {
      href: "./disposed",
      text: "Disposed Blood Bags",
      icon: <TrashIcon />,
    },
    { href: "./posts", text: "Blood Network", icon: <GlobeAltIcon /> },
    {
      href: "./logs",
      text: "Activity Logs",
      icon: <ClipboardDocumentIcon />,
    },
    { href: "./mbd", text: "MBD Report", icon: <DocumentTextIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "#dc2626" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <IconButton
              variant="text"
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              className="-ml-3"
            >
              {open ? (
                <Bars3BottomLeftIcon className="w-7 h-7 text-white" />
              ) : (
                <Bars3Icon className="w-7 h-7 text-white" />
              )}
            </IconButton>
          </div>
          <UserPopover />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Image src="/prc_logo.png" width={50} height={50} alt="Red Cross" />
          {open ? (
            <Image
              src="/logo_lifelink.png"
              width={120}
              height={50}
              className=" drop-shadow-md"
              alt="Lifelink"
            />
          ) : (
            ""
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {links.map((link, index) => (
            <Link key={index} href={link.href}>
              <Tooltip title={link.text} placement="right" arrow>
                <ListItem
                  disablePadding
                  sx={{ display: "block" }}
                  className={
                    pathName.replace("/admin", ".") === link.href
                      ? "bg-gray-200"
                      : ""
                  }
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon className="p-4">{link.icon}</ListItemIcon>
                    <ListItemText
                      primary={link.text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </Link>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#e5e7eb" }}>
        <DrawerHeader />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover={false}
          theme="light"
        />
        {children}
        {showScrollButton && (
          <div className="fixed bottom-10 right-10 z-50">
            <Guide content="Scroll to top" className="w-max">
              <IconButton
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ChevronUpIcon className="w-7 h-7 text-white" />
              </IconButton>
            </Guide>
          </div>
        )}
        {pathName.replace("/admin", ".") === "./posts" ? (
          <div className="fixed bottom-10 right-10 z-50">
            <CreatePost />
          </div>
        ) : (
          ""
        )}
      </Box>
    </Box>
  );
}
