'use client'
import { UsersTable } from './components/table';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-12">
        <UsersTable />
    </div>
  )
}
