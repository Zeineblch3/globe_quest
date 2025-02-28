'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supbase';

export default function Dashboard() {
    const [user, setUser] = useState(null);
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
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-1/4 bg-white shadow-xl p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Admin Dashboard</h2>
                <nav>
                    <ul>
                        <li className="mb-4">
                            <button
                                onClick={() => router.push('/dashboard/manage-tours')}
                                className="text-lg text-gray-800 hover:text-blue-600"
                            >
                                Manage Tours
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => router.push('/dashboard/manage-guides')}
                                className="text-lg text-gray-800 hover:text-blue-600"
                            >
                                Manage Guides
                            </button>
                        </li>
                    </ul>
                </nav>
                <button
                    onClick={handleLogout}
                    className="mt-6 w-full p-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>

            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold text-gray-800">Welcome to the Dashboard</h1>
                <p className="mt-4 text-gray-600">Hello, {user?.email}!</p>
                <p className="mt-2 text-gray-500">You can manage tours and guides from the sidebar.</p>
            </div>
        </div>
    );
}
