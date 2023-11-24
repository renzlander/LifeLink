import '../globals.css'
import React from "react";
import NavbarIndex from './components/NavBars';

export default function RootLayout({ children }) {
  return (
    <body className='bg_lifelink'>
      <nav className='px-2'>
        <NavbarIndex />
      </nav>
      {children}
    </body>
  )
}
