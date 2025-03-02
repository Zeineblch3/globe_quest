'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supbase';
import { Edit, Trash2 } from 'lucide-react';


export default function ManageGuides() {
    const [guides, setGuides] = useState<any[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingGuide, setEditingGuide] = useState<any | null>(null);

    const [name, setName] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [availability, setAvailability] = useState(true);
    const [photoUrl, setPhotoUrl] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        fetchGuides();
    }, []);

    const fetchGuides = async () => {
        const { data, error } = await supabase.from('guides').select('*');
        if (error) console.error('Error fetching guides:', error);
        else setGuides(data);
    };

    const openAddModal = () => {
        setShowModal(true);
        setIsEditing(false); // Reset the edit state when opening the "Add" modal
    };

    const openEditModal = (guide: any) => {
        setShowModal(true);
        setIsEditing(true);
        setEditingGuide(guide);
        setName(guide.name);
        setSpeciality(guide.speciality);
        setAvailability(guide.availability);
        setPhotoUrl(guide.photo_url || '');
        setPhoneNumber(guide.phone_number || '');
        setEmail(guide.email || '');
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingGuide(null);
        clearForm();
    };

    const clearForm = () => {
        setName('');
        setSpeciality('');
        setAvailability(true);
        setPhotoUrl('');
        setPhoneNumber('');
        setEmail('');
    };

    const handleCreateGuide = async (e: React.FormEvent) => {
        e.preventDefault();
        const newGuide = { name, speciality, availability, photo_url: photoUrl, phone_number: phoneNumber, email };
        try {
            const { error } = await supabase.from('guides').insert([newGuide]);
            if (error) throw error;
            fetchGuides();
            closeModal();
        } catch (error) {
            console.error('Error creating guide:', error);
        }
    };

    const handleUpdateGuide = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedGuide = { name, speciality, availability, photo_url: photoUrl, phone_number: phoneNumber, email };
        try {
            const { error } = await supabase.from('guides').update(updatedGuide).eq('id', editingGuide.id);
            if (error) throw error;
            fetchGuides();
            closeModal();
        } catch (error) {
            console.error('Error updating guide:', error);
        }
    };

    const handleDeleteGuide = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this guide?')) {
            try {
                const { error } = await supabase.from('guides').delete().eq('id', id);
                if (error) throw error;
                fetchGuides();
            } catch (error) {
                console.error('Error deleting guide:', error);
            }
        }
    };

    return (
        <div>

            {/* Button to open Add Guide Modal */}
            <button onClick={openAddModal} className="mt-4 p-2 bg-blue-500 text-white rounded">Add New Guide</button>

            {/* Table of Guides */}
            <div className="overflow-x-auto">
                <table className="mt-6 w-full table-auto border-collapse">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Speciality</th>
                            <th className="px-6 py-3 text-left">Availability</th>
                            <th className="px-6 py-3 text-left">Photo</th>
                            <th className="px-6 py-3 text-left">Phone Number</th>
                            <th className="px-6 py-3 text-left">Email</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guides.map((guide) => (
                            <tr key={guide.id} className="border-b">
                                <td className="text-gray-800 px-6 py-3">{guide.name}</td>
                                <td className="text-gray-800 px-6 py-3">{guide.speciality}</td>
                                <td className="text-gray-800 px-6 py-3">{guide.availability ? 'Available' : 'Not Available'}</td>
                                <td className="px-6 py-3">
                                    {guide.photo_url ? (
                                        <img src={guide.photo_url} alt="Guide" className="h-12 w-12 rounded-full object-cover" />
                                    ) : (
                                        'No Photo'
                                    )}
                                </td>
                                <td className="text-gray-800 px-6 py-3">{guide.phone_number}</td>
                                <td className="text-gray-800 px-6 py-3">{guide.email}</td>
                                <td className="px-6 py-3">
                                    <div className="flex space-x-4">
                                        {/* Edit Button with Pencil Icon */}
                                        <button onClick={() => openEditModal(guide)} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-400 transition">
                                            <Edit size={20} />
                                        </button>

                                        {/* Delete Button with Trash Icon */}
                                        <button onClick={() => handleDeleteGuide(guide.id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-400 transition">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

           {/* Modal for Adding/Editing a Guide */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-1/3 max-h-[80vh] overflow-auto text-gray-800">
                        <h3 className="text-xl font-semibold">{isEditing ? 'Edit Guide' : 'Add Guide'}</h3>
                        <form onSubmit={isEditing ? handleUpdateGuide : handleCreateGuide} className="space-y-4 mt-4">
                            <div>
                                <label htmlFor="name" className="block font-medium">Guide Name</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 p-2 border rounded w-full text-gray-900" required />
                            </div>
                            <div>
                                <label htmlFor="speciality" className="block font-medium">Speciality</label>
                                <input type="text" id="speciality" value={speciality} onChange={(e) => setSpeciality(e.target.value)} className="mt-1 p-2 border rounded w-full text-gray-900" required />
                            </div>
                            <div>
                                <label htmlFor="availability" className="block font-medium">Availability</label>
                                <select id="availability" value={availability ? 'true' : 'false'} onChange={(e) => setAvailability(e.target.value === 'true')} className="mt-1 p-2 border rounded w-full text-gray-900">
                                    <option value="true">Available</option>
                                    <option value="false">Not Available</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="photoUrl" className="block font-medium">Photo URL</label>
                                <input type="text" id="photoUrl" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="mt-1 p-2 border rounded w-full text-gray-900" />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block font-medium">Phone Number</label>
                                <input type="text" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-1 p-2 border rounded w-full text-gray-900" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block font-medium">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 p-2 border rounded w-full text-gray-900" required />
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button type="button" onClick={closeModal} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white p-2 rounded">{isEditing ? 'Update Guide' : 'Add Guide'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
}
