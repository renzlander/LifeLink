"use client";
import { useEffect } from "react";
import RegisterStepper from "./components/Steppers";

export default function RegisterPage() {
  useEffect(() => {
    document.title = "Registration";
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-12">
      <RegisterStepper />
    </main>
  );
}
