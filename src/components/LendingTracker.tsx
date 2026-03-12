'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImageUrl?: string;
  loanedTo?: string;
  loanDate?: string;
  totalPages: number;
  currentPage: number;
}

function getLoanStatus(loanDate: string): {
  label: 'Overdue' | 'Due Soon' | 'Active';
  detail: string;
} {
  const loaned = new Date(loanDate);
  const dueDate = new Date(loaned);
  dueDate.setDate(dueDate.getDate() + 14); // 14-day lending period
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: 'Overdue', detail: `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} late` };
  } else if (diffDays <= 3) {
    return { label: 'Due Soon', detail: diffDays === 0 ? 'Due today' : `In ${diffDays} day${diffDays !== 1 ? 's' : ''}` };
  } else {
    const daysLoaned = Math.floor((now.getTime() - loaned.getTime()) / (1000 * 60 * 60 * 24));
    return { label: 'Active', detail: `${daysLoaned} day${daysLoaned !== 1 ? 's' : ''}` };
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const statusBadge: Record<string, string> = {
  Overdue: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
  'Due Soon': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  Active: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
};

const statusDetailColor: Record<string, string> = {
  Overdue: 'text-red-500',
  'Due Soon': 'text-amber-500',
  Active: 'text-slate-900 dark:text-white',
};

const statusDetailLabel: Record<string, string> = {
  Overdue: 'Status',
  'Due Soon': 'Deadline',
  Active: 'Duration',
};

interface LendingEntryProps {
  book: Book;
  onReturn: (id: string) => void;
  isReturning: boolean;
}

function LendingEntry({ book, onReturn, isReturning }: LendingEntryProps) {
  const { label, detail } = getLoanStatus(book.loanDate!);

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex items-center gap-4 flex-1">
          <div className="size-20 shrink-0 rounded-lg overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            {book.coverImageUrl ? (
              <img
                src={book.coverImageUrl}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-3xl">book</span>
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">{book.title}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadge[label]}`}>
                {label}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <span className="material-symbols-outlined text-base mr-1.5 opacity-70">person</span>
                Borrowed by{' '}
                <span className="font-semibold text-slate-900 dark:text-white ml-1">{book.loanedTo}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <span className="material-symbols-outlined text-base mr-1.5 opacity-70">calendar_today</span>
                Loaned on {formatDate(book.loanDate!)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-4 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:items-end mr-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none text-right">
              {statusDetailLabel[label]}
            </span>
            <span className={`text-sm font-medium ${statusDetailColor[label]}`}>{detail}</span>
          </div>
          <button
            onClick={() => onReturn(book._id)}
            disabled={isReturning}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Return
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LendingTracker({ initialBooks }: { initialBooks: Book[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [returningId, setReturningId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const loanedBooks = useMemo(
    () => initialBooks.filter((b) => b.loanedTo && b.loanDate),
    [initialBooks]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return loanedBooks;
    const q = query.toLowerCase();
    return loanedBooks.filter(
      (b) => b.title.toLowerCase().includes(q) || (b.loanedTo ?? '').toLowerCase().includes(q)
    );
  }, [loanedBooks, query]);

  const overdue = filtered.filter((b) => getLoanStatus(b.loanDate!).label === 'Overdue');
  const dueSoon = filtered.filter((b) => getLoanStatus(b.loanDate!).label === 'Due Soon');
  const active = filtered.filter((b) => getLoanStatus(b.loanDate!).label === 'Active');

  const sorted = [...overdue, ...dueSoon, ...active];

  const handleReturn = async (id: string) => {
    setReturningId(id);
    try {
      await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanedTo: null, loanDate: null }),
      });
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setReturningId(null);
    }
  };

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Lending Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Keep track of your books currently in circulation.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none w-full sm:w-64 transition-all"
              placeholder="Search books or people..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Lending List */}
      {sorted.length > 0 ? (
        <div className="space-y-4">
          {sorted.map((book) => (
            <LendingEntry
              key={book._id}
              book={book}
              onReturn={handleReturn}
              isReturning={returningId === book._id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600">
          <span className="material-symbols-outlined text-6xl mb-4">handshake</span>
          <p className="text-lg font-semibold">No books currently loaned out</p>
          <p className="text-sm mt-1">Books you lend will appear here.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary">book</span>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Total Loaned</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {loanedBooks.length} {loanedBooks.length === 1 ? 'Book' : 'Books'}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/20">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-red-500">warning</span>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Overdue</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {loanedBooks.filter((b) => getLoanStatus(b.loanDate!).label === 'Overdue').length}{' '}
            {loanedBooks.filter((b) => getLoanStatus(b.loanDate!).label === 'Overdue').length === 1 ? 'Book' : 'Books'}
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/20">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-amber-500">schedule</span>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Due Soon</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {loanedBooks.filter((b) => getLoanStatus(b.loanDate!).label === 'Due Soon').length}{' '}
            {loanedBooks.filter((b) => getLoanStatus(b.loanDate!).label === 'Due Soon').length === 1 ? 'Book' : 'Books'}
          </p>
        </div>
      </div>
    </main>
  );
}
