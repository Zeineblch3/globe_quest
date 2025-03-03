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
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState<string | null>(null);
    const [showResetPopup, setShowResetPopup] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

            if (authError) {
                setError(authError.message);
            } else {
                setEmail('');
                setPassword('');
                router.push('/dashboard');
            }
        } catch {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
            if (error) setError(error.message);
        } catch {
            setError('An unexpected error occurred.');
        }
    };

    const handlePasswordReset = async () => {
        setResetMessage(null);
        if (!resetEmail) return setResetMessage('Please enter your email.');
    
        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
            redirectTo: `http://localhost:3000/reset-password`,
        });
    
        if (error) {
            setResetMessage(error.message);
        } else {
            setResetMessage('Password reset link sent! Check your email.');
            setShowResetPopup(false);
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
                        autoComplete="new-email"
                        className="w-full p-3 text-gray-900 bg-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
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
                        <button
                            type="button"
                            onClick={() => setShowResetPopup(true)}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Forgot Password?
                        </button>
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

            {/* Forgot Password Popup */}
            {showResetPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-96">
                        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
                        {resetMessage && <p className="text-center mb-3">{resetMessage}</p>}
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="w-full p-3 text-gray-900 bg-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end mt-4 space-x-3">
                            <button
                                onClick={() => setShowResetPopup(false)}
                                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordReset}
                                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Send Reset Link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
