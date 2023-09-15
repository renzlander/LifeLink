"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LoginForm } from './components/loginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-10">
      <LoginForm />
    </main>
  )
}