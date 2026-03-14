'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Library, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="w-16 h-16 text-red-500 opacity-20" />
        </div>
        <p className="text-slate-700 dark:text-slate-300 mb-6 font-medium">
          Invalid or missing reset token. Please request a new link.
        </p>
        <Link 
          href="/forgot-password"
          className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors"
        >
          Request new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Your password has been reset successfully. You can now log in.');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message ? (
        <div className="text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <p className="text-slate-900 dark:text-slate-100 font-bold text-xl mb-2">Success!</p>
          <p className="text-slate-500 dark:text-slate-400 mb-4">{message}</p>
          <p className="text-xs text-slate-400 italic">Redirecting you to login...</p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5" htmlFor="password">
              New Password
            </label>
            <div className="relative flex items-center">
              <input 
                className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-slate-400 text-sm pr-11" 
                id="password" 
                placeholder="At least 8 characters" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <button 
                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5" htmlFor="confirm">
              Confirm New Password
            </label>
            <input 
              className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-slate-400 text-sm" 
              id="confirm" 
              placeholder="Confirm your password" 
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            className="w-full h-12 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const isSetup = searchParams.get('setup') === 'true';

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
            <Library className="w-7 h-7" />
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight">
            {isSetup ? 'Complete Registration' : 'Set New Password'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 text-center">
            {isSetup 
              ? "Welcome! Please choose a secure password to complete your account setup." 
              : "Please enter your new secure password."}
          </p>
        </div>

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
            <p className="text-sm text-slate-400 mt-4">Loading reset form...</p>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
