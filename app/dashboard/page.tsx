'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Profil from './Profil';
import ManageGuides from './manage-guides';
import ManageTours from './manage-tours';
import ArchivedTours from './archivedTours'; // Import ArchivedTours component
import { getSession, signOut, subscribeToAuthStateChanges } from '../Services/authService';
import Sidebar from './Sidebar';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<'tours' | 'guides' | 'profile' | 'setting' | 'archivedTours' | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
  };

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
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
        activeSection={activeSection}
      />

      {/* Main Content */}
      <div
        className={`flex-1 p-8 bg-white overflow-auto h-screen transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-[256px]'
        }`}
      >
        {activeSection === null ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-semibold text-gray-800 mb-4 text-center">
              Welcome to the Back Office Dashboard
            </h1>
            <p className="mt-2 text-xl text-gray-600 text-center">Hello, {user?.email}!</p>
            <p className="mt-4 text-lg text-gray-500 text-center">
              You can manage your tours and guides from here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeSection === 'tours' && (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Tours</h2>
                <ManageTours />
              </div>
            )}
            {activeSection === 'guides' && (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Guides</h2>
                <ManageGuides />
              </div>
            )}
            {activeSection === 'profile' && (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Settings</h2>
                <Profil />
              </div>
            )}
            {activeSection === 'setting' && (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preferences Settings</h2>
              </div>
            )}
            {activeSection === 'archivedTours' && (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Archived Tours</h2>
                <ArchivedTours tours={[]} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
