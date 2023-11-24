"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthCard } from "./Authenticate";
import { TabTemp } from "./TabTdbb";

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
    <div>
      {isAuthenticated ? (
        <TabTemp />
      ) : (
        <div className="flex justify-center w-full">
          <AuthCard onAuthenticate={handleAuthentication} />
        </div>
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
