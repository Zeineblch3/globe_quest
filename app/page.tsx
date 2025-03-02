'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { supabase } from '@/lib/supbase';
import Image from 'next/image';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // shows loading while request is in progress
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(authError.message);
            } else {
                router.push('/dashboard'); // Redirect after successful login
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) {
                setError(error.message);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <div className="w-96 p-8 bg-gray-800 text-white rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 text-gray-900 bg-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 text-gray-900 bg-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
                        >
                            {showPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    {/* Forgot Password */}
                    <div className="text-center mt-4">
                        <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                            Forgot Password?
                        </a>
                    </div>
                </form>

                {/* Google Login */}
                <div className="flex items-center justify-center mt-6">
                    <button
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center w-full px-4 py-2 bg-transparent border border-gray-500 rounded-lg hover:bg-gray-500 transition"
                    >
                        <Image src="/google-logo.png" alt="Google Logo" width={30} height={30} className="mr-3" />
                        <span className="text-white-100">Login with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
