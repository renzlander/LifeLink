"use client";
import '../globals.css';
import React from "react";
import { UserSidebar } from './components/sidebar';
import { UserNavbar} from './components/navbar';

export default function UserLayout({ children }) {
  return (
    <main className='bg-gray-300 p-4'>
      <div className='flex'>
        <div className='fixed'>
          <UserSidebar />
        </div>
        
        <div className='flex flex-col w-full ml-72 overflow-x-auto'>
          <div>
            <UserNavbar />
          </div>
          <div className='overflow-x-auto overflow-y-auto'>
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}