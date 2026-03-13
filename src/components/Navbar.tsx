import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { Library, LogOut, User as UserIcon } from 'lucide-react';

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold text-lg">
            <Library className="w-6 h-6" />
            <span>Home Library</span>
          </Link>

          <div className="flex items-center gap-6">
            {session ? (
              <>
                <Link href="/library" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  My Books
                </Link>
                <Link href="/lending" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Lending
                </Link>
                <div className="flex items-center gap-4 border-l border-zinc-200 dark:border-zinc-800 pl-6 text-sm">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hidden sm:flex">
                    <UserIcon className="w-4 h-4" />
                    <span>{session.user?.name || session.user?.email}</span>
                  </div>
                  <form action={async () => {
                    "use server";
                    await signOut({ redirectTo: '/login' });
                  }}>
                    <button type="submit" className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium">
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Sign out</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link href="/register" className="text-sm font-medium px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-white transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
