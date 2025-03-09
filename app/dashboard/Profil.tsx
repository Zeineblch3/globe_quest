'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supbase'; // Ensure the path is correct for your Supabase client
import { Camera } from 'lucide-react'; // Using lucide-react for the camera icon

const Profil = () => {
    const [fullName, setFullName] = useState<string>(''); // Username from Supabase Auth
    const [email, setEmail] = useState<string>(''); // Properly typed as string
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [bio, setBio] = useState<string>(''); // State for bio
    const [loading, setLoading] = useState<boolean>(true); // State to handle loading
    const [error, setError] = useState<string | null>(null); // State to handle errors

    useEffect(() => {
        const getUserData = async () => {
            try {
                setLoading(true); // Start loading while fetching user data
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                    setError('Error fetching user data');
                    return;
                }

                const user = data?.user;
                if (user) {
                    setEmail(user.email || ''); // Set email from authenticated user
                    setFullName(user.user_metadata?.username || ''); // Set full name from username in user metadata
                }
            } catch (err) {
                setError('An error occurred while fetching user data');
            } finally {
                setLoading(false); // Stop loading after fetching user data
            }
        };

        getUserData();
    }, []);

    const handleCancel = () => {
        // Handle cancel logic, for example, resetting the form values
        setFullName(''); // Reset to empty or initial state
        setEmail('');
        setProfilePicture(null);
        setBio('');
      };
    
    const handleSaveChanges = () => {
        // Handle saving the changes, for example, send to Supabase
        console.log('Changes saved');
    };
    

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setProfilePicture(URL.createObjectURL(file));
        }
    };

    if (loading) {
        return <div className="text-center text-gray-500">Loading user data...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div>
            <p className="text-gray-500 mb-6">Update your personal information and how others see you on the platform.</p>

            <div className="profile-picture-section mb-6">
                <h4 className="font-medium text-lg text-gray-700 mb-2">Profile Picture</h4>
                <div className="profile-picture flex items-center gap-4">
                    {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                    ) : (
                        <div className="w-24 h-24 flex items-center justify-center border-2 border-gray-300 rounded-full bg-gray-200">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}
                    <div className="flex flex-col">
                        {/* Custom file input with icon */}
                        <label
                            htmlFor="profile-picture-upload"
                            className="mt-2 text-sm text-gray-700 bg-blue-100 px-4 py-2 rounded-full cursor-pointer flex gap-2"
                            >
                            <Camera className="w-5 h-5 text-gray-600" />
                            <span>Choose a file</span>
                        </label>
                        <input
                            id="profile-picture-upload"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden" // Hides the default file input element
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload a photo to personalize your account. Recommended: Square JPG, PNG, or GIF, at least 400x400 pixels.</p>
                    </div>
                </div>
            </div>

            {/* Full Name Input */}
            <div className="form-group mb-6">
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
                <input
                    type="text"
                    id="name"
                    value={fullName}
                    readOnly
                    className="block w-full border-2 border-gray-300 p-3 rounded-lg mt-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
            </div>

            {/* Email Input */}
            <div className="form-group mb-6">
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    readOnly
                    className="block w-full border-2 border-gray-300 p-3 rounded-lg mt-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
            </div>

            {/* Bio Input */}
            <div className="form-group mb-6">
                <label className="block text-sm font-medium text-gray-700" htmlFor="bio">Bio</label>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="block w-full border-2 border-gray-300 p-3 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-gray-500 mt-1">Write a short bio about yourself.</p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
                <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400"
                >
                Cancel
                </button>
                <button
                type="button"
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                Save Changes
                </button>
            </div>
        </div>
    );
};

export default Profil;
