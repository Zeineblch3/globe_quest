"use client";

import { useEffect, useState } from "react";
import { fetchTourEvents, unarchiveTourEvent } from "../Services/tourEventService";
import { Store } from "lucide-react";

interface TourEvent {
  id: string;
  event_name: string;
  date_from: string;
  date_to: string;
  tours: { name: string };
  archived: boolean;
}

const ArchivedTourEvents = () => {
  const [archivedEvents, setArchivedEvents] = useState<TourEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadArchivedEvents = async () => {
    try {
      const data = await fetchTourEvents();
      setArchivedEvents(data.filter((event: TourEvent) => event.archived));
    } catch (error) {
      console.error("Error fetching archived events:", error);
      setError("Failed to load archived events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchivedEvents();
  }, []);

  const handleUnarchive = async (eventId: string) => {
    try {
      await unarchiveTourEvent(eventId);
      setArchivedEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Error unarchiving event:", error);
    }
  };

  if (loading) return <p>Loading archived events...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Event Name</th>
              <th className="px-6 py-3 text-left">Date From</th>
              <th className="px-6 py-3 text-left">Date To</th>
              <th className="px-6 py-3 text-left">Tour</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {archivedEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-3 text-center text-gray-500">
                  No archived events available.
                </td>
              </tr>
            ) : (
              archivedEvents.map(event => (
                <tr key={event.id} className="border">
                  <td className="px-6 py-3 text-gray-800">{event.event_name}</td>
                  <td className="px-6 py-3 text-gray-800">{event.date_from}</td>
                  <td className="px-6 py-3 text-gray-800">{event.date_to}</td>
                  <td className="px-6 py-3 text-gray-800">{event.tours.name}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleUnarchive(event.id)}
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

export default ArchivedTourEvents;
