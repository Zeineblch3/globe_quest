'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Profil from './Profil';
import { MapPin, User, LogOutIcon, Settings as SettingsIcon, UserCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { getSession, signOut, subscribeToAuthStateChanges } from '../Services/authService';
import { useSidebarState } from './useSidebarState';
import ManageGuides from './manage-guides';
import ManageTours from './manage-tours';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null); // Define user type as needed
  const [activeSection, setActiveSection] = useState<'tours' | 'guides' | 'profile' | 'setting' | null>(null);
  const { isCollapsed, toggleSidebar } = useSidebarState(); // Custom hook for sidebar state
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const currentUser = await getSession();
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
      }
    };

    const { subscription } = subscribeToAuthStateChanges((session) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session);
      }
    });

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white shadow-xl p-4 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col`}>
        {/* Toggle Button */}
        <button onClick={toggleSidebar} className="mb-6 flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 transition ml-auto">
          {isCollapsed ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
        </button>

        {/* Navigation */}
        <nav className="flex-grow">
          <ul>
            <li className="mb-4">
              <button
                onClick={() => setActiveSection('tours')}
                className={`flex items-center text-lg text-gray-300 ${activeSection === 'tours' ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white'} p-2 rounded-full`}
              >
                <MapPin size={24} />
                {!isCollapsed && <span className="ml-2">Manage Tours</span>}
              </button>
            </li>
            <li className="mb-4">
              <button
                onClick={() => setActiveSection('guides')}
                className={`flex items-center text-lg text-gray-300 ${activeSection === 'guides' ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white'} p-2 rounded-full`}
              >
                <User size={24} />
                {!isCollapsed && <span className="ml-2">Manage Guides</span>}
              </button>
            </li>
          </ul>
        </nav>

        {/* Profile Button */}
        <li className="mb-4">
          <button
            onClick={() => setActiveSection('profile')}
            className="flex items-center text-lg text-gray-300 hover:bg-blue-500 hover:text-white p-2 rounded-full"
          >
            <UserCircle size={24} />
            {!isCollapsed && <span className="ml-2">Profile</span>}
          </button>
        </li>

        {/* Settings Button */}
        <li className="mb-4">
          <button
            onClick={() => setActiveSection('setting')}
            className="flex items-center text-lg text-gray-300 hover:bg-blue-500 hover:text-white p-2 rounded-full"
          >
            <SettingsIcon size={24} />
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </button>
        </li>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          {isCollapsed ? <LogOutIcon size={28} /> : <><LogOutIcon size={24} className="mr-2" />Logout</>}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white">
        {/* Conditionally render the welcome message or the active section */}
        {activeSection === null ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-semibold text-gray-800 mb-4 text-center">Welcome to the Back Office Dashboard</h1>
            <p className="mt-2 text-xl text-gray-600 text-center">Hello, {user?.email}!</p>
            <p className="mt-4 text-lg text-gray-500 text-center">You can manage your tours and guides from here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Manage Tours */}
            {activeSection === 'tours' && (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Tours</h2>
                <ManageTours />
              </div>
            )}
            {/* Manage Guides */}
            {activeSection === 'guides' && (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Guides</h2>
                <ManageGuides />
              </div>
            )}
            {/* Profile Settings */}
            {activeSection === 'profile' && (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Settings</h2>
                <Profil />
              </div>
            )}
            {/* Preferences Settings */}
            {activeSection === 'setting' && (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preferences Settings</h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
