import Link from 'next/link';
import { useRouter } from 'next/router';


export default function Navbar() {
    const router = useRouter();

    const isActiveLink = (href) => {
        return router.pathname === href ? 'text-red-700' : '';
    };

  return (
    <nav className="bg-gray-100 p-4 drop-shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div>
            <Link href="/">
              <img src='/images/logo_lifelink.png' className='h-7'/>
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-4 text-gray-800 font-semibold">
            <li>
              <Link href="/" passHref>
                <span className={isActiveLink('/')}>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/news">
                <span className={isActiveLink('/news')}>News</span>
              </Link>
            </li>
            <li>
              <Link href="/bloodbank">
                <span className={isActiveLink('/bloodbank')}>Blood Banks</span>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <span className={isActiveLink('/about')}>About</span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <span className={isActiveLink('/contact')}>Contact Us</span>
              </Link>
            </li>
          </ul>

          {/* Mobile Navigation (hamburger menu) */}
          <div className="md:hidden">
            <button
              className="text-white hover:text-blue-200"
              // Implement your mobile menu functionality here (e.g., using React hooks and state)
            >
              <svg
                className="w-6 h-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M4 18h16v-2H4v2zm0-5h16v-2H4v2zm0-7v2h16V6H4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

