'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supbase';
import { ChevronLeft, ChevronRight, MapPin, User, LogOutIcon, Settings, UserCircle } from 'lucide-react';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Function to check session initially
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login'); // Redirect to login if no session
            } else {
                setUser(session.user);
            }
        };

        // Listen for changes in auth state (session)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                router.push('/login'); // Redirect to login if no session on state change
            } else {
                setUser(session.user);
            }
        });

        checkSession(); // Initial session check on page load

        // Cleanup: Unsubscribe from auth state changes on component unmount
        return () => {
            if (subscription) {
                subscription.unsubscribe(); // Unsubscribe correctly
            }
        };
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login'); // Redirect to login after logout
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className={`bg-gray-800 text-white shadow-xl p-4 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col`}>
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="mb-6 flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 transition ml-auto"
                >
                    {isCollapsed ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
                </button>

                {/* Navigation */}
                <nav className="flex-grow">
                    <ul>
                        <li className="mb-4">
                            <button
                                onClick={() => router.push('/dashboard/manage-tours')}
                                className="flex items-center text-lg text-gray-300 hover:bg-blue-500 hover:text-white p-2 rounded-full"
                            >
                                <MapPin size={24} />
                                {!isCollapsed && <span className="ml-2">Manage Tours</span>}
                            </button>
                        </li>
                        <li className="mb-4">
                            <button
                                onClick={() => router.push('/dashboard/manage-guides')}
                                className="flex items-center text-lg text-gray-300 hover:bg-blue-500 hover:text-white p-2 rounded-full"
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
                        onClick={() => router.push('/dashboard/settings')}
                        className="flex items-center text-lg text-gray-300 hover:bg-blue-500 hover:text-white p-2 rounded-full"
                    >
                        <UserCircle size={24} />
                        {!isCollapsed && <span className="ml-2">Profile</span>}
                    </button>
                </li>

                {/* Settings Button */}
                <li className="mb-4">
                    <button
                        onClick={() => router.push('/dashboard/settings')}
                        className="flex items-center text-lg text-gray-300 hover:bg-blue-500 hover:text-white p-2 rounded-full"
                    >
                        <Settings size={24} />
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
                <h1 className="text-2xl font-bold text-gray-800">Welcome to the Dashboard</h1>
                <p className="mt-4 text-gray-600">Hello, {user?.email}!</p>
                <p className="mt-2 text-gray-500">You can manage tours and guides from the sidebar.</p>
            </div>
        </div>
    );
}
