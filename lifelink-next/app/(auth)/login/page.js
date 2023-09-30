"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LoginForm } from './components/loginForm';
import { ToastContainer, toast  } from 'react-toastify';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <LoginForm />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </main>
  )
}