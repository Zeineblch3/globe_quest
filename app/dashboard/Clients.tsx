import { useEffect, useState } from 'react';
import { fetchTouristsWithEvents } from '../Services/ClientService';
import Export from './Export'; // Make sure to import the Export component

// Define Tourist type
type Tourist = {
  name: string;
  email: string;
  country: string;
  event_name: string;
  notes: string;
};

const Clients = () => {
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States for filtering
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedEventName, setSelectedEventName] = useState<string>('');

  useEffect(() => {
    const getTourists = async () => {
      try {
        const fetchedTourists = await fetchTouristsWithEvents(); // Fetch tourists with events
        setTourists(fetchedTourists);
      } catch (error: any) {
        setError('Failed to fetch tourists: ' + error.message); // Include the error message
      } finally {
        setLoading(false);
      }
    };

    getTourists();
  }, []);

  // Filter tourists based on selected country and event
  const filteredTourists = tourists.filter((tourist) => {
    const isCountryMatch = selectedCountry ? tourist.country === selectedCountry : true;
    const isEventMatch = selectedEventName ? tourist.event_name === selectedEventName : true;
    return isCountryMatch && isEventMatch;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Get unique countries and events for dropdown options
  const uniqueCountries = Array.from(new Set(tourists.map((tourist) => tourist.country)));
  const uniqueEvents = Array.from(new Set(tourists.map((tourist) => tourist.event_name)));

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'country', label: 'Country' },
    { key: 'event_name', label: 'Tour Event' },
    { key: 'notes', label: 'Reviews' },
  ];

  return (
    <div>
        {/* Filter Section and Export Button */}
        <div className="flex flex-col mb-4">
            <div className="flex space-x-4 mb-4">
            {/* Country Filter */}
            <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="p-2 text-gray-800 border border-gray-300 rounded-lg"
            >
                <option value="">Select Country</option>
                {uniqueCountries.map((country, index) => (
                <option key={index} value={country}>
                    {country}
                </option>
                ))}
            </select>

            {/* Event Filter */}
            <select
                value={selectedEventName}
                onChange={(e) => setSelectedEventName(e.target.value)}
                className="p-2 text-gray-800 border border-gray-300 rounded-lg"
            >
                <option value="">Select Event</option>
                {uniqueEvents.map((event, index) => (
                <option key={index} value={event}>
                    {event}
                </option>
                ))}
            </select>
            </div>

            {/* Export Button - Align it to the extreme right */}
            <div className="flex justify-end">
            <Export
                data={filteredTourists}
                columns={columns}
                fileName="Client_Export"
                className="p-2 bg-black text-white rounded flex items-center"
            />
            </div>
        </div>

      {/* Client Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Country</th>
              <th className="px-6 py-3 text-left">Tour Event</th>
              <th className="px-6 py-3 text-left">Reviews</th>
            </tr>
          </thead>
          <tbody>
            {filteredTourists.map((tourist, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-3 text-gray-800">{tourist.name}</td>
                <td className="px-6 py-3 text-gray-800">{tourist.email}</td>
                <td className="px-6 py-3 text-gray-800">{tourist.country}</td>
                <td className="px-6 py-3 text-gray-800">{tourist.event_name}</td>
                <td className="px-6 py-3 text-gray-800">{tourist.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
