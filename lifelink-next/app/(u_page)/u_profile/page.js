'use client'
import React from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Collapse,
  Button,
  Card,
  Typography,
  CardBody,
} from "@material-tailwind/react";
import CollapseDefault from "./components/collapse";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
 
  const toggleOpen = () => setOpen((cur) => !cur);

  return (
    <div className="flex min-h-screen flex-col py-2 ml-72">
      <CollapseDefault />
    </div>
  )
}
