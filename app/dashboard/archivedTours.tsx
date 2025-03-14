'use client';

import { useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import { supabase } from '@/lib/supbase';

const Archive = ({ tours }: { tours: any[] }) => {
  const [archivedTours, setArchivedTours] = useState<any[]>([]);

  // Fetch archived tours from the database
  const fetchArchivedTours = async () => {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('archived', true); // Fetch only archived tours

      if (error) throw error;

      // Update the state with fetched archived tours
      setArchivedTours(data);
    } catch (error) {
      console.error('Error fetching archived tours:', error);
    }
  };

  // Fetch archived tours when the component mounts
  useEffect(() => {
    fetchArchivedTours();
  }, []);

  // Handle unarchiving a tour (update both in the database and UI)
  const handleUnarchiveTour = async (id: string) => {
    if (!window.confirm('Are you sure you want to unarchive this tour?')) return;

    try {
      // Update the archived status in the Supabase database
      const { error } = await supabase
        .from('tours')
        .update({ archived: false })
        .eq('id', id);

      if (error) throw error;

      // Fetch the updated list of archived tours after unarchiving
      fetchArchivedTours();
    } catch (error) {
      console.error('Error unarchiving tour:', error);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
            <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Latitude</th>
                <th className="px-6 py-3 text-left">Longitude</th>
                <th className="px-6 py-3 text-left">Photo</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">TripAdvisor</th>
                <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {archivedTours.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-3 text-center text-gray-500">
                  No archived tours available.
                </td>
              </tr>
            ) : (
              archivedTours.map((tour) => (
                <tr key={tour.id} className="border-b">
                  <td className="px-6 py-3 text-gray-800">{tour.name}</td>
                                <td className="px-6 py-3 text-gray-800">{tour.description}</td>
                                <td className="px-6 py-3 text-gray-800">{tour.latitude}</td>
                                <td className="px-6 py-3 text-gray-800">{tour.longitude}</td>
                                <td className="px-6 py-3">
                                    {tour.photo_urls && tour.photo_urls.length > 0 ? (
                                        tour.photo_urls.map((url: string, index: number) => (
                                            <img key={index} src={url} alt="Tour" className="h-12 w-12 rounded object-cover mr-2" />
                                        ))
                                    ) : (
                                        'No Photos'
                                    )}
                                </td>
                                <td className="px-6 py-3 text-gray-800">${tour.price}</td>
                                <td className="px-6 py-3 text-blue-600 underline">
                                    <a href={tour.tripAdvisor_link} target="_blank" rel="noopener noreferrer">View</a>
                                </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleUnarchiveTour(tour.id)}
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-400 transition"
                    >
                      <Store size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Archive;
