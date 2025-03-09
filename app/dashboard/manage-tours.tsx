'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supbase';

// URL validation helper function
const isValidUrl = (url: string) => {
    const trimmedUrl = url.trim(); // Remove leading/trailing whitespace
    const regex = /^(https?:\/\/)?([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}(:\d+)?(\/.*)?$/i;
    return regex.test(trimmedUrl);
};

export default function ManageTours() {
    const [tours, setTours] = useState<any[]>([]);
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

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        const { data, error } = await supabase.from('tours').select('*');
        if (error) console.error('Error fetching tours:', error);
        else setTours(data);
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

        // Reset previous error messages
        setPhotoUrlError('');
        setTripAdvisorLinkError('');

        let valid = true;

        if (photoUrls.length === 0) {
            setPhotoUrlError('At least one photo URL must be provided.');
            valid = false;
        }

        // Validate each URL in the photoUrls array
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
            photo_urls: photoUrls,  // Store the photo URLs as an array
            price: parseFloat(price as string) || 0, 
            tripAdvisor_link: tripAdvisor_link 
        };

        try {
            const { data, error } = await supabase.from('tours').insert([newTour]);
            if (error) {
                console.error('Error creating tour:', error.message);
                alert(`Error: ${error.message}`);
                return;
            }
            fetchTours();
            closeModal();
        } catch (error) {
            console.error('Unexpected error creating tour:', error);
            alert(`Unexpected error: ${error instanceof Error ? error.message : error}`);
        }
    };

    const handleUpdateTour = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset previous error messages
        setPhotoUrlError('');
        setTripAdvisorLinkError('');

        let valid = true;

        if (photoUrls.length === 0) {
            setPhotoUrlError('At least one photo URL must be provided.');
            valid = false;
        }

        // Validate each URL in the photoUrls array
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
            photo_urls: photoUrls,  // Update the photo_urls array
            price: parseFloat(price as string) || 0, 
            tripAdvisor_link: tripAdvisor_link 
        };
        try {
            const { error } = await supabase.from('tours').update(updatedTour ).eq('id', editingTour.id);
            if (error) throw error;
            fetchTours();
            closeModal();
        } catch (error) {
            console.error('Error updating tour:', error);
        }
    };

    const handleDeleteTour = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this tour?')) {
            try {
                const { error } = await supabase.from('tours').delete().eq('id', id);
                if (error) throw error;
                fetchTours();
            } catch (error) {
                console.error('Error deleting tour:', error);
            }
        }
    };

    // Add new photo URL to the list
    const addPhotoUrl = () => {
        setPhotoUrls([...photoUrls, '']); // Add an empty string for a new URL
    };

    return (
        <div>
            <button onClick={openAddModal} className="mt-4 p-2 bg-blue-500 text-white rounded">Add New Tour</button>

            <div className="overflow-x-auto">
                <table className="mt-6 w-full table-auto border-collapse">
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
                        {tours.map((tour) => (
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
                                    <div className="flex space-x-4">
                                        <button onClick={() => openEditModal(tour)} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-400 transition">
                                            <Edit size={20} />
                                        </button>

                                        <button onClick={() => handleDeleteTour(tour.id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-400 transition">
                                            <Trash2 size={20} />
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
                        <form onSubmit={isEditing ? handleUpdateTour : handleCreateTour} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="mt-1 p-2 border rounded w-full text-gray-900"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block">Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="mt-1 p-2 border rounded w-full text-gray-900"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="latitude" className="block">Latitude</label>
                                    <input
                                        type="number"
                                        id="latitude"
                                        value={latitude}
                                        onChange={(e) => setLatitude(e.target.value)}
                                        required
                                        className="mt-1 p-2 border rounded w-full text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="longitude" className="block">Longitude</label>
                                    <input
                                        type="number"
                                        id="longitude"
                                        value={longitude}
                                        onChange={(e) => setLongitude(e.target.value)}
                                        required
                                        className="mt-1 p-2 border rounded w-full text-gray-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="photoUrls" className="block">Photo URLs</label>
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
                                                className="mt-1 p-2 border rounded w-full text-gray-900"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addPhotoUrl}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        + Add Another Photo URL
                                    </button>
                                </div>
                                {photoUrlError && <p className="text-red-600 text-sm">{photoUrlError}</p>}
                            </div>

                            <div>
                                <label htmlFor="price" className="block">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    className="mt-1 p-2 border rounded w-full text-gray-900"
                                />
                            </div>

                            <div>
                                <label htmlFor="tripAdvisor_link" className="block">TripAdvisor Link</label>
                                <input
                                    type="text"
                                    id="tripAdvisor_link"
                                    value={tripAdvisor_link}
                                    onChange={(e) => setTripAdvisor_link(e.target.value)}
                                    className="mt-1 p-2 border rounded w-full text-gray-900"
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