'use client'
import { HistoryTable } from './components/Table';

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col py-4 ">
        <HistoryTable />
    </div>
  )
}
