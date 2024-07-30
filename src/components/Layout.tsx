import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaCogs, FaUser, FaServicestack, FaSearch, FaChevronLeft, FaChevronRight, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Layout = (props: { children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const {logout} = useAuth()
 

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => { 
   
    navigate('/login');

    logout()


    
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`relative bg-white shadow-md p-4 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
        <button 
          onClick={toggleSidebar} 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 bg-red-500 p-2">
          {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
        <div className={`mt-10 ${isSidebarOpen ? '' : 'flex flex-col items-center space-y-4'}`}>
          <ul>
            <li className="mb-2 flex items-center">
              <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
                <FaHome className={`mr-2 ${isSidebarOpen ? '' : 'text-xl'}`} />
                {isSidebarOpen && <span className="ml-2">Home</span>}
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link to="/services" className="flex items-center text-blue-600 hover:text-blue-800">
                <FaServicestack className={`mr-2 ${isSidebarOpen ? '' : 'text-xl'}`} />
                {isSidebarOpen && <span className="ml-2">Services</span>}
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link to="/profile" className="flex items-center text-blue-600 hover:text-blue-800">
                <FaUser className={`mr-2 ${isSidebarOpen ? '' : 'text-xl'}`} />
                {isSidebarOpen && <span className="ml-2">Profile</span>}
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link to="/settings" className="flex items-center text-blue-600 hover:text-blue-800">
                <FaCogs className={`mr-2 ${isSidebarOpen ? '' : 'text-xl'}`} />
                {isSidebarOpen && <span className="ml-2">Settings</span>}
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-gray p-4 shadow-md flex items-center">
          <h1 className="text-xl font-bold flex-1">Service Platform</h1>
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-8 py-1 rounded bg-white border border-gray-300"
            />
            <FaSearch className="absolute top-2 left-2 text-gray-500" />
          </div>
          <button 
            onClick={handleLogout} 
            className="ml-4 text-white hover:text-gray-300 flex items-center">
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {props.children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
