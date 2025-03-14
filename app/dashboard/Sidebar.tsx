'use client';

import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  User, 
  UserCircle, 
  Settings as SettingsIcon, 
  LogOutIcon, 
  Archive
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setActiveSection: (section: 'tours' | 'guides' | 'profile' | 'setting' | 'archivedTours'| null) => void;
  handleLogout: () => void;
  activeSection: 'tours' | 'guides' | 'profile' | 'setting' | 'archivedTours'| null;
}

const Sidebar = ({
  isCollapsed, 
  toggleSidebar, 
  setActiveSection, 
  handleLogout, 
  activeSection 
}: SidebarProps) => {
  const handleClick = (section: 'tours' | 'guides' | 'profile' | 'setting' | 'archivedTours') => {
    setActiveSection(section);
  };

  return (
    <div className={`bg-white text-gray-800 shadow-xl p-4 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col fixed top-0 left-0 bottom-0`}>
      
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition ml-auto"
      >
        {isCollapsed ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
      </button>

      {/* Title */}
      <h1 className={`${isCollapsed ? 'hidden' : 'block'} text-xl mb-4 text-gray-500`}>
        Management
      </h1>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul>
          {/* Tours */}
          <li className="mb-4">
            <button
              onClick={() => handleClick('tours')}
              className={`flex items-center text-lg p-2 rounded-full focus:outline-none transition-all ${
                activeSection === 'tours' ? 'text-gray-800 font-bold' : 'hover:text-gray-600'
              }`}
            >
              <MapPin
                size={24}
                className={`mr-2 ${activeSection === 'tours' ? 'text-gray-800' : 'text-gray-400'}`}
              />
              {!isCollapsed && <span>Tours</span>}
            </button>
          </li>

          {/* Guides */}
          <li className="mb-4">
            <button
              onClick={() => handleClick('guides')}
              className={`flex items-center text-lg p-2 rounded-full focus:outline-none transition-all ${
                activeSection === 'guides' ? 'text-gray-800 font-bold' : 'hover:text-gray-600'
              }`}
            >
              <User
                size={24}
                className={`mr-2 ${activeSection === 'guides' ? 'text-gray-800' : 'text-gray-400'}`}
              />
              {!isCollapsed && <span>Guides</span>}
            </button>
          </li>

          {/* Archived Tours */}
          <li className="mb-4">
            <button
              onClick={() => handleClick('archivedTours')}
              className={`flex items-center text-lg p-2 rounded-full focus:outline-none transition-all ${activeSection === 'archivedTours' ? 'text-gray-800 font-bold' : 'hover:text-gray-600'}`}
            >
              <Archive size={24} className={`mr-2 ${activeSection === 'archivedTours' ? 'text-gray-800' : 'text-gray-400'}`} />
              {!isCollapsed && <span>Archived Tours</span>}
            </button>
          </li>
        </ul>
      </nav>

      {/* Account Section */}
      <h1 className={`${isCollapsed ? 'hidden' : 'block'} text-xl mb-4 text-gray-500`}>
        Account
      </h1>
      <ul>
        {/* Profile */}
        <li className="mb-4">
          <button
            onClick={() => handleClick('profile')}
            className={`flex items-center text-lg p-2 rounded-full focus:outline-none transition-all ${
              activeSection === 'profile' ? 'text-gray-800 font-bold' : 'hover:text-gray-600'
            }`}
          >
            <UserCircle
              size={24}
              className={`mr-2 ${activeSection === 'profile' ? 'text-gray-800' : 'text-gray-400'}`}
            />
            {!isCollapsed && <span>Profile</span>}
          </button>
        </li>
        
        {/* Settings */}
        <li className="mb-4">
          <button
            onClick={() => handleClick('setting')}
            className={`flex items-center text-lg p-2 rounded-full focus:outline-none transition-all ${
              activeSection === 'setting' ? 'text-gray-800 font-bold' : 'hover:text-gray-600'
            }`}
          >
            <SettingsIcon
              size={24}
              className={`mr-2 ${activeSection === 'setting' ? 'text-gray-800' : 'text-gray-400'}`}
            />
            {!isCollapsed && <span>Settings</span>}
          </button>
        </li>
      </ul>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 w-full flex items-center justify-center p-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
      >
        {isCollapsed ? (
          <LogOutIcon size={28} />
        ) : (
          <>
            <LogOutIcon size={24} className="mr-2" />
            Logout
          </>
        )}
      </button>
    </div>
  );
};

export default Sidebar;