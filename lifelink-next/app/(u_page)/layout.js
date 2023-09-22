"use client";
import '../globals.css';
import React from "react";
import { UserSidebar } from './components/sidebar';

export default function UserLayout({ children }) {
  return (
    <main className='bg-gray-200 p-4'>
        {/* <aside className='lg:fixed md:absoluite'> */}
            <UserSidebar />
        {/* </aside> */}
        {children}
    </main>
  )
}
