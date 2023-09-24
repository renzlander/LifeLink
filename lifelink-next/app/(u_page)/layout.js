"use client";
import '../globals.css';
import React from "react";
import { UserSidebar } from './components/sidebar';
import { UserNavbar} from './components/navbar';

export default function UserLayout({ children }) {
  return (
    <main className='bg-gray-300 p-4'>
      <div className='flex'>
        <div className='fixed z-50'>
          <UserSidebar />
        </div>
        
        <div className='flex flex-col w-full ml-72'>
          <UserNavbar />
          <div className='overflow-x-auto'>
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}