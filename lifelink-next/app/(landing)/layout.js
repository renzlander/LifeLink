"use client";
import NavbarIndex from "./components/NavBars";

export default function RootLayout({ children }) {
  return (
    <main>
      <nav className="px-2">
        <NavbarIndex />
      </nav>
      {children}
    </main>
  );
}
