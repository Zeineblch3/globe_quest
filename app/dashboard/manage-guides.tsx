'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supbase';

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

    const [nameError, setNameError] = useState<string>('');
    const [specialityError, setSpecialityError] = useState<string>('');
    const [phoneNumberError, setPhoneNumberError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [photoUrlError, setPhotoUrlError] = useState<string>('');

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
        setIsEditing(false);
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
        setNameError('');
        setSpecialityError('');
        setPhoneNumberError('');
        setEmailError('');
        setPhotoUrlError('');
    };

    const isValidUrl = (url: string) => {
        const regex = /^(https?:\/\/)?([a-z0-9]+(\.[a-z0-9]+)*\.[a-z]{2,})?(:\d+)?(\/.*)?$/i;
        return regex.test(url) && (url.startsWith('http://') || url.startsWith('https://'));
    };
    

    const isValidPhoneNumber = (phone: string) => {
        const regex = /^[0-9]{8}$/;
        return regex.test(phone);
    };

    const isValidEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleCreateGuide = async (e: React.FormEvent) => {
        e.preventDefault();

        let isValid = true;

        // Validate each field
        if (!name) {
            setNameError('Name is required.');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!speciality) {
            setSpecialityError('Speciality is required.');
            isValid = false;
        } else {
            setSpecialityError('');
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            setPhoneNumberError('Phone number must be 8 digits.');
            isValid = false;
        } else {
            setPhoneNumberError('');
        }

        if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (photoUrl && !isValidUrl(photoUrl)) {
            setPhotoUrlError('Please enter a valid URL.');
            isValid = false;
        } else {
            setPhotoUrlError('');
        }

        if (!isValid) return;

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

        let isValid = true;

        // Validate each field
        if (!name) {
            setNameError('Name is required.');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!speciality) {
            setSpecialityError('Speciality is required.');
            isValid = false;
        } else {
            setSpecialityError('');
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            setPhoneNumberError('Phone number must be 8 digits.');
            isValid = false;
        } else {
            setPhoneNumberError('');
        }

        if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (photoUrl && !isValidUrl(photoUrl)) {
            setPhotoUrlError('Please enter a valid URL.');
            isValid = false;
        } else {
            setPhotoUrlError('');
        }

        if (!isValid) return;

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
            <button onClick={openAddModal} className="mt-4 p-2 bg-blue-500 text-white rounded">Add New Guide</button>

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
                                        <button onClick={() => openEditModal(guide)} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-400 transition">
                                            <Edit size={20} />
                                        </button>
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

            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-1/3 max-h-[80vh] overflow-auto text-gray-800">
                        <h3 className="text-xl font-semibold">{isEditing ? 'Edit Guide' : 'Add Guide'}</h3>
                        <form onSubmit={isEditing ? handleUpdateGuide : handleCreateGuide} className="space-y-4 mt-4">
                            <div>
                                <label htmlFor="name" className="block font-medium">Guide Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 p-2 border rounded w-full text-gray-900"
                                />
                                {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
                            </div>
                            <div>
                                <label htmlFor="speciality" className="block font-medium">Speciality</label>
                                <input
                                    type="text"
                                    id="speciality"
                                    value={speciality}
                                    onChange={(e) => setSpeciality(e.target.value)}
                                    className="mt-1 p-2 border rounded w-full text-gray-900"
                                />
                                {specialityError && <p className="text-red-500 text-sm">{specialityError}</p>}
                            </div>
                            <div>
                                <label htmlFor="availability" className="block font-medium">Availability</label>
                                <select
                                    id="availability"
                                    value={availability ? 'true' : 'false'}
                                    onChange={(e) => setAvailability(e.target.value === 'true')}
                                    className="mt-1 p-2 border rounded w-full text-gray-900"
                                >
                                    <option value="true">Available</option>
                                    <option value="false">Not Available</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="photoUrl" className="block font-medium">Photo URL</label>
                                <input
                                    type="text"
                                    id="photoUrl"
                                    value={photoUrl}
                                    onChange={(e) => setPhotoUrl(e.target.value)}
                                    className="mt-1 p-2 border rounded w-full text-gray-900"
                                />
                                {photoUrlError && <p className="text-red-500 text-sm">{photoUrlError}</p>}
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block font-medium">Phone Number</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="mt-1 p-2 border rounded w-full text-gray-900"
                                />
                                {phoneNumberError && <p className="text-red-500 text-sm">{phoneNumberError}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block font-medium">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 p-2 border rounded w-full text-gray-900"
                                />
                                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-400"
                                >
                                    {isEditing ? 'Update Guide' : 'Add Guide'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
