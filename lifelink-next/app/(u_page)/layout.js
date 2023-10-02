"use client";
import '../globals.css';
import React from "react";
import { UserSidebar } from './components/sidebar';
import { UserNavbar} from './components/navbar';
import { ToastContainer, toast } from "react-toastify";

export default function UserLayout({ children }) {
  return (
    <main className='bg-gray-300 p-4'>
      <div className='flex'>
        <div className='fixed z-50 hidden lg:block'>
          <UserSidebar />
        </div>
        
        <div className='flex flex-col w-full lg:ml-72'>
          <UserNavbar />
          <div className='overflow-x-auto'>
            {children}
            <ToastContainer
              position="bottom-left"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
