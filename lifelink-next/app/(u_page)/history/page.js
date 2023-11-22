'use client'
import { HistoryTable } from './components/table';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col py-2">
        <HistoryTable />
    </div>
  )
}
