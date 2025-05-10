'use client';

import { useState, useEffect } from 'react';
import { Archive, Edit, Plus, Trash2 } from 'lucide-react';
import TourSearch from './tourSearch';
import * as tourService from '../Services/tourService';
import Export from './Export';

// URL validation helper function
const isValidUrl = (url: string) => {
    const trimmedUrl = url.trim(); // Remove leading/trailing whitespace
    const regex = /^(https?:\/\/)?([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}(:\d+)?(\/.*)?$/i;
    return regex.test(trimmedUrl);
};

export default function ManageTours() {
    const [tours, setTours] = useState<any[]>([]);
    const [selectedTours, setSelectedTours] = useState<Set<string>>(new Set()); // Track selected tours

    const [showModal, setShowModal] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingTour, setEditingTour] = useState<any | null>(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState<number | string>(''); 
    const [longitude, setLongitude] = useState<number | string>(''); 
    const [photoUrls, setPhotoUrls] = useState<string[]>([]); // Changed to an array
    const [price, setPrice] = useState<number | string>(''); 
    const [tripAdvisor_link, setTripAdvisor_link] = useState('');

    const [photoUrlError, setPhotoUrlError] = useState('');
    const [tripAdvisorLinkError, setTripAdvisorLinkError] = useState('');

    const filteredTours = tours.filter((tour) => !tour.archived);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        const { data, error } = await tourService.fetchTours();
        if (error) {
            console.error('Error fetching tours:', error);
        } else {
            setTours(data);
        }
    };
    const openAddModal = () => {
        setShowModal(true);
        setIsEditing(false);
        setPhotoUrls([]); // Reset photoUrls when adding a new tour
    };

    const openEditModal = (tour: any) => {
        setShowModal(true);
        setIsEditing(true);
        setEditingTour(tour);
        setName(tour.name);
        setDescription(tour.description);
        setLatitude(tour.latitude);
        setLongitude(tour.longitude);
        setPhotoUrls(tour.photo_urls || []); // Set the existing photo URLs
        setPrice(tour.price);
        setTripAdvisor_link(tour.tripAdvisor_link || '');
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTour(null);
        clearForm();
    };

    const clearForm = () => {
        setName('');
        setDescription('');
        setLatitude('');
        setLongitude('');
        setPhotoUrls([]); // Clear the photo URLs array
        setPrice('');
        setTripAdvisor_link('');
        setPhotoUrlError('');
        setTripAdvisorLinkError('');
    };

    const handleCreateTour = async (e: React.FormEvent) => {
        e.preventDefault();

        setPhotoUrlError('');
        setTripAdvisorLinkError('');

        let valid = true;

        if (photoUrls.length === 0) {
            setPhotoUrlError('At least one photo URL must be provided.');
            valid = false;
        }

        photoUrls.forEach((url) => {
            if (!isValidUrl(url)) {
                setPhotoUrlError('Please enter valid URLs.');
                valid = false;
            }
        });

        if (tripAdvisor_link && !isValidUrl(tripAdvisor_link)) {
            setTripAdvisorLinkError('Please enter a valid URL.');
            valid = false;
        }

        if (!valid) return;

        const newTour = { 
            name, 
            description, 
            latitude: parseFloat(latitude as string) || 0, 
            longitude: parseFloat(longitude as string) || 0, 
            photo_urls: photoUrls,  
            price: parseFloat(price as string) || 0, 
            tripAdvisor_link: tripAdvisor_link 
        };

        const { error } = await tourService.createTour(newTour);
        if (error) {
            console.error('Error creating tour:', error.message);
            alert(`Error: ${error.message}`);
            return;
        }
        fetchTours();
        closeModal();
    };

    const handleUpdateTour = async (e: React.FormEvent) => {
        e.preventDefault();

        setPhotoUrlError('');
        setTripAdvisorLinkError('');

        let valid = true;

        if (photoUrls.length === 0) {
            setPhotoUrlError('At least one photo URL must be provided.');
            valid = false;
        }

        photoUrls.forEach((url) => {
            if (!isValidUrl(url)) {
                setPhotoUrlError('Please enter valid URLs.');
                valid = false;
            }
        });

        if (tripAdvisor_link && !isValidUrl(tripAdvisor_link)) {
            setTripAdvisorLinkError('Please enter a valid URL.');
            valid = false;
        }

        if (!valid) return;

        const updatedTour = { 
            name, 
            description, 
            latitude: parseFloat(latitude as string) || 0, 
            longitude: parseFloat(longitude as string) || 0, 
            photo_urls: photoUrls, 
            price: parseFloat(price as string) || 0, 
            tripAdvisor_link: tripAdvisor_link 
        };

        const { error } = await tourService.updateTour(updatedTour, editingTour.id);

        if (error) {
            console.error('Error updating tour:', error);
            return;
        }
        fetchTours();
        closeModal();
    };


   const handleDeleteTour = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tour?')) return;

    const { error } = await tourService.deleteTour(id);

    if (error) {
        const isForeignKeyError =
            error.message?.toLowerCase().includes('foreign key');

        if (isForeignKeyError) {
            window.alert(
                'This tour is linked to existing tour events.\n\nPlease delete the related events before deleting this tour.'
            );
        } else {
            // Log to console in dev only, silently fail in prod
            if (process.env.NODE_ENV === 'development') {
                console.warn('Unexpected error while deleting tour:', error.message || error);
            }
            window.alert('Could not delete the tour. Please try again later.');
        }

        return; // Prevent propagation
    }

    fetchTours();
};




    const handleArchiveTour = async (tourId: string) => {
        const { error } = await tourService.archiveTour(tourId);
        if (error) {
            console.error('Error archiving tour:', error);
            return;
        }
        fetchTours();
    };
      
      
    // Add new photo URL to the list
    const addPhotoUrl = () => {
        setPhotoUrls([...photoUrls, '']); // Add an empty string for a new URL
    };

    // Handle checkbox selection
    const handleCheckboxChange = (tourId: string) => {
        setSelectedTours((prev) => {
            const newSelectedTours = new Set(prev);
            if (newSelectedTours.has(tourId)) {
                newSelectedTours.delete(tourId);
            } else {
                newSelectedTours.add(tourId);
            }
            return newSelectedTours;
        });
    };

    const tourColumns = [
        { key: 'id', label: 'Tour ID' },
        { key: 'name', label: 'Tour Name' },
        { key: 'description', label: 'Description' },
        { key: 'latitude', label: 'Latitude' },
        { key: 'longitude', label: 'Longitude' },
        { key: 'price', label: 'price' },
        { key: 'tripAdvisor_link', label: 'TripAdvisor_link' },
        
      ];

    return (
        <div>
            {/* Search Bar Component */}
            <TourSearch setTours={setTours} />

            <button onClick={openAddModal} className="mt-4 p-2 bg-black text-white rounded flex items-center">
                <Plus size={20} className="mr-2" /> Add New Tour
            </button>
            <div className="flex justify-end">
                <Export
                    data={tours.filter((tour) => selectedTours.has(tour.id))} // Filter selected tours
                    columns={tourColumns} // Pass the columns to be exported
                    fileName="Selected_Tours" // Customize the file name
                    className="p-2 bg-black text-white rounded flex items-center"
                />
            </div>


            <div className="overflow-x-auto">
                <table className="mt-6 w-full table-auto border-collapse">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                        <th className="px-6 py-3 text-left">
                                <input 
                                    type="checkbox" 
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedTours(new Set(tours.map((tour) => tour.id)));
                                        } else {
                                            setSelectedTours(new Set());
                                        }
                                    }}
                                />
                            </th>
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
                        {filteredTours.map((tour) => (
                            <tr key={tour.id} className="border-b">
                                <td className="px-6 py-3">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedTours.has(tour.id)} 
                                        onChange={() => handleCheckboxChange(tour.id)} 
                                    />
                                </td>
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
                                    <div className="flex flex-col space-y-4">
                                        <button
                                            onClick={() => openEditModal(tour)}
                                            className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-400 flex items-center justify-center h-8 w-8"
                                        >
                                            <Edit size={20} />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteTour(tour.id)}
                                            className="bg-red-500 text-white p-2 rounded hover:bg-red-400 flex items-center justify-center h-8 w-8"
                                        >
                                            <Trash2 size={20} />
                                        </button>

                                        <button
                                            onClick={() => handleArchiveTour(tour.id)}
                                            className="bg-gray-600 text-white p-2 rounded hover:bg-gray-400 flex items-center justify-center h-8 w-8"
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
                    <div className="bg-white p-6 rounded-xl shadow-lg w-1/3 max-h-[80vh] overflow-auto text-gray-800">
                        <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Tour' : 'Add Tour'}</h3>
                        <form onSubmit={isEditing ? handleUpdateTour : handleCreateTour} className="space-y-4 bg-white p-6 rounded-lg w-full max-w-lg">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-900">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full p-3 mt-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-900">Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="w-full p-3 mt-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-900">Latitude</label>
                                    <input
                                        type="number"
                                        id="latitude"
                                        value={latitude}
                                        onChange={(e) => setLatitude(e.target.value)}
                                        required
                                        className="w-full p-3 mt-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-900">Longitude</label>
                                    <input
                                        type="number"
                                        id="longitude"
                                        value={longitude}
                                        onChange={(e) => setLongitude(e.target.value)}
                                        required
                                        className="w-full p-3 mt-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="photoUrls" className="block text-sm font-medium text-gray-900">Photo URLs</label>
                                <div className="space-y-2">
                                    {photoUrls.map((url, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={url}
                                                onChange={(e) => {
                                                    const updatedUrls = [...photoUrls];
                                                    updatedUrls[index] = e.target.value;
                                                    setPhotoUrls(updatedUrls);
                                                }}
                                                className="w-full p-3 mt-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addPhotoUrl}
                                        className="text-blue-500 hover:text-blue-700 text-base"
                                    >
                                        + Add Another Photo URL
                                    </button>
                                </div>
                                {photoUrlError && <p className="text-red-600 text-sm">{photoUrlError}</p>}
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-900">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    className="w-full p-3 mt-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="tripAdvisor_link" className="block text-sm font-medium text-gray-900">TripAdvisor Link</label>
                                <input
                                    type="text"
                                    id="tripAdvisor_link"
                                    value={tripAdvisor_link}
                                    onChange={(e) => setTripAdvisor_link(e.target.value)}
                                    className="w-full p-3 mt-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {tripAdvisorLinkError && <p className="text-red-600 text-sm">{tripAdvisorLinkError}</p>}
                            </div>

                            <div className="flex justify-between space-x-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-400 text-white p-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white p-2 rounded"
                                >
                                    {isEditing ? 'Update Tour' : 'Create Tour'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}