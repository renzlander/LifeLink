'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@material-tailwind/react";
import { DeferralTable } from './components/table';
import { AuthCard } from './components/authenticate';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between p-12">
      {isAuthenticated ? (
        <DeferralTable />
      ) : (
        <AuthCard onAuthenticate={handleAuthentication} />
      )}
    </div>
  );
}
