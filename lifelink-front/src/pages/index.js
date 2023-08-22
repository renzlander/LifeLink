import Navbar from '../components/navbar_index';
import { useRouter } from 'next/router';

export default function IndexPage() {
  
  const router = useRouter();

  const getStarted = () => {
    router.push('/login');
  };

  return (
    <main className="index_bg h-full">
      
      <Navbar />

      <div className='h-screen'>
        <div className='flex flex-col w-1/2 ml-10 mt-10 font-bold'>
          <h1 className='text-9xl text-[#424242]'>DONATE</h1>
          <h1 className='text-9xl text-[#d1071b]'>Blood</h1>
          <h1 className='text-9xl text-[#424242]'>Save 
            <span className='text-[#d1071b]'>
              Lives.
            </span>
          </h1>
          
          <div className='flex flex-row justify-evenly ml-10 mt-10 font-light text-xl'>
            <button onClick={getStarted} className='bg-[#d1071b] border-2 text-gray-100 rounded-full py-3 px-9 hover:bg-gray-100 hover:border-2 hover:border-[#d1071b] hover:text-[#d1071b]'>
              Get Started
            </button>
            <button className='text-[#d1071b] border-2 border-[#d1071b] rounded-full py-3 px-9 hover:bg-[#d1071b] hover:text-gray-100'>
              Read More
            </button>
          </div>
        </div>
      </div>

    </main>
  );
};
