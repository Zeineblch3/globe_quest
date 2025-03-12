'use client';

import { supabase } from '@/lib/supbase';
import { useState, useEffect } from 'react';
import { FaSearch, FaSpinner, FaSync } from 'react-icons/fa';

interface Tour {
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    photo_urls: string[];
    price: number;
    tripAdvisor_link: string;
}

interface TourSearchProps {
    setTours: (tours: Tour[]) => void;
}

const TourSearch: React.FC<TourSearchProps> = ({ setTours }) => {
    const [searchQuery, setSearchQuery] = useState<string>(''); // Explicitly declare state type
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Debounce functionality: delay search after typing stops
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 500); // Delay of 500ms

        return () => clearTimeout(timer); // Cleanup the timeout if searchQuery changes before 500ms
    }, [searchQuery]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchAllTours();
            return;
        }

        setLoading(true);
        setError('');

        try {
            let query = supabase.from('tours').select('*');
            
            // Check if search query is a valid number (for ID search)
            const isNumber = /^-?\d*(\.\d+)?$/.test(searchQuery.trim());

            if (isNumber) {
                // If it's a number, search by ID
                query = query.eq('id', searchQuery.trim());
            } else {
                // If it's not a number, search by name
                query = query.ilike('name', `%${searchQuery}%`);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            setTours(data || []);
        } catch (err) {
            setError('Failed to fetch tours. Please try again.');
            console.error('Error fetching tours:', err);  // Log the actual error object for debugging
        } finally {
            setLoading(false);
        }
    };

    const fetchAllTours = async () => {
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.from('tours').select('*');
            if (error) {
                throw error;
            }
            setTours(data || []);
        } catch (err) {
            setError('Failed to fetch tours. Please try again.');
            console.error('Error fetching all tours:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container mb-4">
            <input
                type="text"
                placeholder="Search Tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-b-2 border-gray-300 p-2 w-72 text-gray-800 focus:outline-none focus:ring-0" // Remove outline and focus ring
            />
            <button
                onClick={handleSearch}
                className="ml-2 text-blue-500 p-2 rounded-full"
                disabled={loading} // Disable button while loading
            >
                <FaSearch className="text-gray-800" />
            </button>

            {error && <div className="text-red-500 mt-2">{error}</div>} {/* Display error message */}
            {loading && <div className="mt-2 text-gray-500">Loading...</div>} {/* Loading spinner */}
        </div>
    );
};

export default TourSearch;
