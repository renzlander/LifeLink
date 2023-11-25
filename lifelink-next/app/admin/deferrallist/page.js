"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthCard } from "./components/Authenticate";
import { DeferralTable } from "./components/Table";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    toast.success("Password is Verified!", {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      theme: "colored",
    });
  };

  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between p-12">
      {isAuthenticated ? (
        <DeferralTable />
      ) : (
        <AuthCard onAuthenticate={handleAuthentication} />
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="colored"
      />
    </div>
  );
}
