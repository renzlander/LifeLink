import Navbar from '../components/navbar_index';
import { useRouter } from 'next/router';

export default function IndexPage() {
  return (
    <main className="gen_bg bg-[#d9d9d9] h-full">

      <div className='h-screen py-7 flex justify-center'>
        <div className='bg-gray-100 w-1/3 h-full flex justify-center shadow-md'>

          <div className='pt-10 flex flex-col'>

            <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-red-700">
              Login to LifeLink
            </h1>
          
            <div className="relative z-0">
                <input type="text" id="floating_standard" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-red-900 dark:border-red-900 dark:focus:border-red-800 focus:outline-none focus:ring-0 focus:border-red-800 peer" placeholder=" " />
                <label for="floating_standard" className="absolute text-sm text-gray-500 dark:text-red-900 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-red-800 peer-focus:dark:text-red-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username or E-mail</label>
            </div>
            
            <div className="relative z-0">
                <input type="text" id="floating_standard" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-red-900 dark:border-red-900 dark:focus:border-red-800 focus:outline-none focus:ring-0 focus:border-red-800 peer" placeholder=" " />
                <label for="floating_standard" className="absolute text-sm text-gray-500 dark:text-red-900 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-red-800 peer-focus:dark:text-red-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
            </div>

            <button className='bg-[#d1071b] border-2 text-gray-100 rounded-full mt-10 py-3 px-9 hover:bg-gray-100 hover:border-2 hover:border-[#d1071b] hover:text-[#d1071b]'>
                Get Started
            </button>

            <button className='text-gray-400 mt-10 underline'>
                Forgot Password?
            </button>

          </div>

        </div>
      </div>

    </main>
  );
};
