"use client"
import {
  Card,
    Input,
    Checkbox,
    Typography,
    Select,
    Option,
    Menu,
    MenuHandler,
    Button
  } from "@material-tailwind/react";
import Image from 'next/image';
import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { RegisterStepper } from "./components/stepper";
import { ToastContainer, toast  } from 'react-toastify';

export default function RegisterPage() {
  useEffect(() => {
    document.title = 'Registration';
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-12">

      <RegisterStepper/>
    </main>
  )
}