import '../globals.css'
import React from "react";
import { NavbarIndex } from './components/navbar';

export default function RootLayout({ children }) {
  return (
      <body className='bg_lifelink'>
        <nav className='px-2 w-full'>
        <NavbarIndex />
        </nav>
        {children}
      </body>
  )
}
