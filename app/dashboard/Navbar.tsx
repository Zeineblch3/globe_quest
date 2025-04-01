'use client';

import { Bell, UserCircle, LogOut, SettingsIcon, Home } from 'lucide-react';

interface NavbarProps {
  userEmail: string | null;
  handleLogout: () => void;
  setActiveSection: (section: 'tours' | 'guides' | 'archivedTours' | 'profile' | 'setting'| 'tourEvents' | 'archivedTourEvent' | 'clients' | null) => void;
  activeSection: 'tours' | 'guides' | 'archivedTours' | 'profile' | 'setting' | 'tourEvents'| 'archivedTourEvent' | 'clients' | null;
}

const Navbar = ({ handleLogout, setActiveSection, activeSection }: NavbarProps) => {
  return (
    <nav className="bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center border-b border-gray-800">
      {/* Home Button */}
      <button
          aria-label="Home"
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${activeSection === null ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          onClick={() => setActiveSection(null)}
        >
          <Home size={24} />
        </button>
      <h1 className="text-xl font-semibold text-gray-200 ml-2 mr-auto">Admin Dashboard</h1>

      <div className="flex items-center space-x-4">
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-lg hover:bg-gray-700 transition"
        >
          <Bell size={24} className="text-white" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        <button
          aria-label="Settings"
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${activeSection === 'setting' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          onClick={() => setActiveSection('setting')}
        >
          <SettingsIcon size={24} />
        </button>

        <button
          aria-label="User Profile"
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${activeSection === 'profile' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          onClick={() => setActiveSection('profile')}
        >
          <UserCircle size={24} />
        </button>

        <button
          aria-label="Logout"
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-500 hover:text-red-600 px-3 py-2 rounded-lg transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
