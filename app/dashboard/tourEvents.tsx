'use client'

import { useState, useEffect } from 'react';
import { fetchTours } from '../Services/tourService';
import { Archive, Plus } from 'lucide-react';
import { 
  archiveTourEvent, 
  fetchTourEvents, 
  createTourEvent, 
  updateTourEventTourist, 
  fetchTourEventById, 
  deleteTourist
} from '../Services/tourEventService';

// Define a type for Tourist
export type Tourist = {
  id?: string;
  name: string;
  email: string;
  country: string;
  notes: string;
};

export default function TourEvent() {
  const [eventName, setEventName] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedTour, setSelectedTour] = useState<string | null>(null);
  const [tourists, setTourists] = useState<Tourist[]>([{ name: '', email: '', country: '', notes: '' }]);
  const [loading, setLoading] = useState(false);
  const [tourList, setTourList] = useState<any[]>([]);
  const [tourEvents, setTourEvents] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Reset form fields (used for new events)
  const resetForm = () => {
    setEventName('');
    setDateFrom('');
    setDateTo('');
    setSelectedTour(null);
    setTourists([{ name: '', email: '', country: '', notes: '' }]);
  };

  // Open modal for adding a new event
  const openAddModal = () => {
    setSelectedEvent(null);
    resetForm();
    setShowModal(true);
  };

  // Open modal for modifying an existing event (only tourist info)
  const openModifyModal = async (event: any) => {
    try {
      const eventDetails = await fetchTourEventById(event.id);
      setSelectedEvent(eventDetails);
      setTourists(eventDetails.tourists || []);
      setShowModal(true);
    } catch (error) {
      console.error("Error opening modify modal:", error);
    }
  };
  
  

  // Fetch tours and events on mount
  useEffect(() => {
    let isMounted = true;

    const getTours = async () => {
      const { data, error } = await fetchTours();
      if (isMounted) {
        if (error) {
          setFetchError('Failed to fetch tours');
        } else {
          setTourList(data || []);
        }
      }
    };

    const getTourEvents = async () => {
      try {
        const data = await fetchTourEvents();
        if (isMounted) {
          const filteredEvents = data.filter((event: any) => !event.archived);
          setTourEvents(filteredEvents);
        }
      } catch (error) {
        if (isMounted) setFetchError('Failed to fetch tour events');
      }
    };

    getTours();
    getTourEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddTourist = () => {
    setTourists(prevTourists => {
      // Check for duplicates before adding
      if (prevTourists.some(t => t.email === '' && t.name === '')) {
        return prevTourists; // Avoid adding duplicate empty tourists
      }
      return [...prevTourists, { name: '', email: '', country: '', notes: '' }];
    });
  };
  
  
  const handleRemoveTourist = async (index: number) => {
    const touristToRemove = tourists[index];
    
    // Only remove the tourist if they have an ID and delete them from the database
    if (touristToRemove.id) {
      try {
        await deleteTourist(touristToRemove.id); // Deleting from DB
      } catch (error) {
        console.error("Error removing tourist:", error);
      }
    }
    
    setTourists(tourists.filter((_, i) => i !== index)); // Removing from state
  };
  
  

  const handleTouristChange = (index: number, field: keyof Tourist, value: string) => {
    const updatedTourists = tourists.map((tourist, i) =>
      i === index ? { ...tourist, [field]: value } : tourist
    );
    setTourists(updatedTourists); // Update state to reflect changes
  };
  
  
  

  const handleSaveEvent = async (e: React.FormEvent) => { 
    e.preventDefault();
    setLoading(true);
    
    try {
      let successMessage = '';

      if (selectedEvent) {
        // Modify existing event and tourist data (ensure no 'id' is sent here)
        await updateTourEventTourist(selectedEvent.id, tourists);
        successMessage = 'Event updated successfully!';
      } else {
        // Create new event here
        const result = await createTourEvent(eventName, dateFrom, dateTo, selectedTour, tourists);
        
        if (!result.success) {
          throw new Error(result.message);
        }

        successMessage = 'New event created successfully!';
      }

      console.log(successMessage);

      // Ensure we fetch the updated list after creation
      const updatedEvents = await fetchTourEvents();
      setTourEvents(updatedEvents.filter((event: any) => !event.archived));
      setShowModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleArchive = async (eventId: string) => {
    try {
      await archiveTourEvent(eventId);
      const updatedEvents = await fetchTourEvents();
      setTourEvents(updatedEvents.filter((event: any) => !event.archived));
    } catch (error) {
      console.error('Error archiving event:', error);
    }
  };

  return (
    <div>
      {/* Top Actions */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openAddModal}
          className="mt-4 p-2 bg-black text-white rounded flex items-center"
        >
          <Plus size={20} className="mr-2" /> Add New Event
        </button>
      </div>

      {/* Display Errors */}
      {fetchError && (
        <div className="bg-red-600 text-white p-3 rounded-lg text-center">
          {fetchError}
        </div>
      )}

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="mt-6 w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Event Name</th>
              <th className="px-6 py-3 text-left">Start Date</th>
              <th className="px-6 py-3 text-left">End Date</th>
              <th className="px-6 py-3 text-left">Tour</th>
              <th className="px-6 py-3 text-left">Tourists</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tourEvents
              .filter((event) => !event.archived)
              .map((event) => (
                <tr key={event.id} className="border-b">
                  <td className="text-gray-800 px-6 py-3">{event.event_name}</td>
                  <td className="text-gray-800 px-6 py-3">{event.date_from}</td>
                  <td className="text-gray-800 px-6 py-3">{event.date_to}</td>
                  <td className="text-gray-800 px-6 py-3">{event.tours?.name || 'N/A'}</td>
                  <td className="px-6 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModifyModal(event)}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Modify
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleArchive(event.id)}
                        className="bg-gray-600 text-white p-2 rounded hover:bg-gray-400"
                      >
                        <Archive size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-1/3 max-h-[80vh] overflow-hidden text-gray-800">
            <div className="overflow-y-auto max-h-[75vh]">
                <h3 className="text-xl font-semibold">
                {selectedEvent ? 'Modify Tour Event Tourist' : 'Add Tour Event'}
                </h3>
                <form
                onSubmit={handleSaveEvent}
                className="space-y-4 bg-white p-6 rounded-lg w-full max-w-lg"
                >
                {/* Event Name (only if not modifying) */}
                {!selectedEvent && (
                    <div>
                    <label className="block text-sm font-medium text-gray-900">Event Name</label>
                    <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        required
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                )}

                {/* Date Range (only if not modifying) */}
                {!selectedEvent && (
                    <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-900">From</label>
                        <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        required
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-900">To</label>
                        <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        required
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    </div>
                )}

                {/* Tour Selection (only if not modifying) */}
                {!selectedEvent && (
                    <div>
                    <label className="block text-sm font-medium text-gray-900">Select Tour</label>
                    <select
                        value={selectedTour || ''}
                        onChange={(e) => setSelectedTour(e.target.value)}
                        required
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Tour</option>
                        {tourList.map((tour: any) => (
                        <option key={tour.id} value={tour.id}>
                            {tour.name}
                        </option>
                        ))}
                    </select>
                    </div>
                )}

                {/* Tourist Details (always shown in modify mode) */}
                {tourists.map((tourist, index) => (
                    <div key={index} className="space-y-3">
                    <h3 className="text-lg font-semibold">Tourist {index + 1}</h3>
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input
                        type="text"
                        value={tourist.name}
                        onChange={(e) => handleTouristChange(index, 'name', e.target.value)}
                        required
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                        type="email"
                        value={tourist.email}
                        onChange={(e) => handleTouristChange(index, 'email', e.target.value)}
                        required
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Country</label>
                        <input
                        type="text"
                        value={tourist.country}
                        onChange={(e) => handleTouristChange(index, 'country', e.target.value)}
                        required
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Notes/Remarks</label>
                        <textarea
                        value={tourist.notes}
                        onChange={(e) => handleTouristChange(index, 'notes', e.target.value)}
                        required
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => handleRemoveTourist(index)}
                        className="text-sm text-red-600 hover:underline"
                    >
                        Remove Tourist
                    </button>
                    </div>
                ))}

                {/* Add Another Tourist Button */}
                <button
                    type="button"
                    onClick={handleAddTourist}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Add Another Tourist
                </button>

                {/* Submit & Cancel Buttons */}
                <div className="mt-4 flex justify-between">
                    <button
                    type="submit"
                    disabled={loading}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-400"
                    >
                    {loading ? 'Saving...' : selectedEvent ? 'Update Event' : 'Save Event'}
                    </button>
                    <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-400"
                    >
                    Cancel
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
        )}

    </div>
  );
}
