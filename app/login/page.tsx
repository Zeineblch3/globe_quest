'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { loginWithEmail, resetPassword } from '../Services/authService';

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

    const loginError = await loginWithEmail(email, password);

    if (loginError) {
      setError(loginError);
    } else {
      setEmail('');
      setPassword('');
      router.push('/dashboard');
    }

    setLoading(false);
  };


  const handlePasswordReset = async () => {
    setResetMessage(null);
    if (!resetEmail) return setResetMessage('Please enter your email.');

    const resetError = await resetPassword(resetEmail);

    setResetMessage(resetError || 'Password reset link sent! Check your email.');
    if (!resetError) setShowResetPopup(false);
  };
    

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <div className="w-96 p-8 bg-gray-800 text-white rounded-2xl shadow-2xl">
            <img 
                src="/globequest.png" 
                alt="Admin Login" 
                className="mx-auto mb-7 w-40 h-auto"
            />  
        <h1 className="text-2xl font-semibold text-center mb-5">Admin Login</h1>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email 
                        </label>
                        <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="new-email"
                        className="w-full p-3 text-gray-900 bg-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
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
                            className="absolute right-3 top-1/2 transform flex items-center text-gray-600 hover:text-gray-800"
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

            </div>

            {/* Forgot Password Popup */}
            {showResetPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-96">
                        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
                        {resetMessage && <p className="text-center text-blue-600 mb-3">{resetMessage}</p>}
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
