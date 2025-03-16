'use client';

import { Bell, UserCircle, LogOut, SettingsIcon } from 'lucide-react';

interface NavbarProps {
  userEmail: string | null;
  handleLogout: () => void;
  setActiveSection: (section: 'tours' | 'guides' | 'archivedTours' | 'profile' | 'setting') => void;
  activeSection: 'tours' | 'guides' | 'archivedTours' | 'profile' | 'setting' | null;
}

const Navbar = ({ userEmail, handleLogout, setActiveSection, activeSection }: NavbarProps) => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-full hover:bg-gray-100"
        >
          <Bell size={24} className="text-gray-600" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        {/* User Info Button */}
        <button
          aria-label="User Profile"
          className={`flex items-center space-x-2 ${activeSection === 'profile' ? 'text-gray-500' : 'text-gray-700'}`}
          onClick={() => setActiveSection('profile')}
        >
          <UserCircle size={28} />
          <span className="text-gray-800 font-medium">{userEmail}</span>
        </button>

        {/* Settings Button */}
        <button
          aria-label="Settings"
          className={`flex items-center space-x-2 ${activeSection === 'setting' ? 'text-gray-500' : 'text-gray-700'}`}
          onClick={() => setActiveSection('setting')}
        >
          <SettingsIcon size={28} />
        </button>

        {/* Logout Button */}
        <button
          aria-label="Logout"
          onClick={handleLogout}
          className="flex items-center space-x-1 text-red-500 hover:text-red-600"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
