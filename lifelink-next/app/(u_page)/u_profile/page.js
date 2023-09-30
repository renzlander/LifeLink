'use client'
import React from "react";
import CardProfile, { CardInfo, CardDisplays } from "./components/cards";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col py-2 gap-y-3">
      <CardProfile />
      <div className="flex gap-3">
        <CardInfo />
        <CardDisplays />
      </div>
    </div>
  )
}
