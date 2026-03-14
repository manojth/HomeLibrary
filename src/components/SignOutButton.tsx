'use client';

import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  const handleSignOut = async () => {
    // Use the NextAuth signout API endpoint directly
    // This avoids server action redirect issues on Vercel
    const res = await fetch('/api/auth/signout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csrfToken: await getCsrfToken() }),
    });

    if (res.ok) {
      window.location.href = '/login';
    } else {
      // Fallback: just redirect
      window.location.href = '/api/auth/signout';
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Sign out</span>
    </button>
  );
}

async function getCsrfToken(): Promise<string> {
  const res = await fetch('/api/auth/csrf');
  const data = await res.json();
  return data.csrfToken;
}
