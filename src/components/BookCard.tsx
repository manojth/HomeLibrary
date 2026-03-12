'use client';

import { BookOpen, MoreVertical, Trash2, Edit3, ImageOff } from 'lucide-react';
import { useState } from 'react';

export default function BookCard({ book, onEdit, onDelete }: { book: any, onEdit: (b: any) => void, onDelete: (id: string) => void }) {
  const [showMenu, setShowMenu] = useState(false);

  // Status color mapping
  const statusColors: Record<string, string> = {
    'Unread': 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    'Reading': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    'Read': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  };

  const calculateProgress = () => {
    if (book.status === 'Unread') return 0;
    if (book.status === 'Read') return 100;
    if (book.totalPages > 0) {
      return Math.round((book.currentPage / book.totalPages) * 100);
    }
    return 0;
  };

  const progress = calculateProgress();

  return (
    <div className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all overflow-hidden flex flex-col h-full">
      {/* Cover Image */}
      <div className="h-48 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        {book.coverImageUrl ? (
          <img 
            src={book.coverImageUrl} 
            alt={book.title} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-zinc-400 dark:text-zinc-600 flex flex-col items-center">
            <ImageOff className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs uppercase tracking-wider font-semibold opacity-50">No Cover</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border border-black/5 dark:border-white/5 backdrop-blur-md shadow-sm w-fit ${statusColors[book.status] || statusColors['Unread']}`}>
            {book.status}
          </span>
          {book.loanedTo && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full text-xs font-medium border border-black/5 dark:border-white/5 backdrop-blur-md shadow-sm w-fit">
              Loaned Out
            </span>
          )}
        </div>

        {/* Action Menu */}
        <div className="absolute top-3 right-3">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-full shadow-sm transition-colors border border-black/5 dark:border-white/10"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
              <button 
                onClick={() => { setShowMenu(false); onEdit(book); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              
              {!book.loanedTo ? (
                <button 
                  onClick={async () => {
                    setShowMenu(false);
                    const name = prompt('Who are you loaning this book to?');
                    if (!name) return;
                    await fetch(`/api/books/${book._id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ loanedTo: name, loanDate: new Date() })
                    });
                    window.location.reload();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                >
                  <BookOpen className="w-4 h-4" /> Loan Out
                </button>
              ) : (
                <button 
                  onClick={async () => {
                    setShowMenu(false);
                    await fetch(`/api/books/${book._id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ loanedTo: null, loanDate: null })
                    });
                    window.location.reload();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors"
                >
                  <BookOpen className="w-4 h-4" /> Mark Returned
                </button>
              )}
              
              <button 
                onClick={() => { setShowMenu(false); onDelete(book._id); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight mb-1">
          {book.title}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
          {book.author}
        </p>

        {book.loanedTo && (
          <div className="mb-4 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-100 dark:border-amber-900/50">
            Currently loaned to: <span className="font-semibold">{book.loanedTo}</span>
            {book.loanDate && <span className="block mt-0.5 opacity-75">since {new Date(book.loanDate).toLocaleDateString()}</span>}
          </div>
        )}

        {book.shelves && book.shelves.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {book.shelves.map((shelf: any) => (
              <span key={shelf._id} className="text-[10px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md">
                {typeof shelf === 'string' ? shelf : shelf.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Progress</span>
            <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{progress}%</span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-zinc-900 dark:bg-zinc-300 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 text-right">
            {book.currentPage} / {book.totalPages} pages
          </p>
        </div>
      </div>
    </div>
  );
}
