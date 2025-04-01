'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ManageGuides from './manage-guides';
import ManageTours from './manage-tours';
import { getSession, signOut, subscribeToAuthStateChanges } from '../Services/authService';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ArchivedTourEvents from './archivedTourEvents';
import Clients from './Clients';
import { Calendar, CompassIcon, Globe, UserIcon } from 'lucide-react';
import ArchivedTours from './archivedTours';
import Profil from './Profil';
import TourEvent from './tourEvents';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<'tours' | 'guides' | 'archivedTours' | 'profile' | 'setting' | 'tourEvents' | 'archivedTourEvent' | 'clients' | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} setActiveSection={setActiveSection} activeSection={activeSection} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Navbar */}
        <Navbar userEmail={user?.email} handleLogout={signOut} setActiveSection={setActiveSection} activeSection={activeSection} />

        {/* Content Section */}
        <div className="p-6">
        {activeSection === null ? (
        <div className="text-center mt-20">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to GlobeQuest</h1>
          <h5 className="text-xl font-bold text-gray-800 mb-9">Tour Management Platform</h5>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Upcoming Tours */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
              <div className="mb-4">
                <Globe size={40} color="#1D4ED8" /> {/* Blue Icon */}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Tours</h2>
              <p className="text-gray-600 text-sm mt-1">View and manage all your upcoming tours to ensure smooth scheduling and coordination</p>
            </div>

            {/* Recent Clients */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
              <div className="mb-4">
                <UserIcon size={40} color="#16A34A" /> {/* Green Icon */}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Recent Clients</h2>
              <p className="text-gray-600 text-sm mt-1">Explore recent client bookings and track customer details for better engagement</p>
            </div>

            {/* Recent Events */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
              <div className="mb-4">
                <Calendar size={40} color="#6B21A8" /> {/* Purple Icon */}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Scheduled Events</h2>
              <p className="text-gray-600 text-sm mt-1">Stay on top of your scheduled events and ensure everything runs according to plan</p>
            </div>

            {/* Guides */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
              <div className="mb-4">
                <CompassIcon size={40} color="#D97706" /> {/* Orange Icon */}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Guides</h2>
              <p className="text-gray-600 text-sm mt-1">Efficiently manage and oversee the tour guides to ensure a great experience for all customers</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6">
              {activeSection === 'tours' && <ManageTours />}
              {activeSection === 'guides' && <ManageGuides />}
              {activeSection === 'profile' && <Profil />}
              {activeSection === 'archivedTours' && <ArchivedTours tours={[]} />}
              {activeSection === 'tourEvents' && <TourEvent />}
              {activeSection === 'archivedTourEvent' && <ArchivedTourEvents />}
              {activeSection === 'clients' && <Clients />}
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
