'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supbase';
import { Suspense } from 'react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    const expiresAt = urlParams.get('expires_at');
  
    if (!token) {
      setError('Invalid or expired reset link.');
      return;
    }
  
    if (expiresAt && Number(expiresAt) * 1000 <= Date.now()) {
      setError('The reset link has expired.');
      return;
    }
  }, []);
  

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get('access_token');

    if (!token) {
      setError('Invalid or expired token.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password updated successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-96 p-8 bg-gray-800 text-white rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 text-gray-900 bg-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 text-gray-900 bg-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ResetPasswordWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPassword />
  </Suspense>
);

export default ResetPasswordWrapper;
