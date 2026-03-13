'use client';

import { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';
import AddBookModal from '@/components/AddBookModal';
import EditBookModal from '@/components/EditBookModal';
import { BookOpen, Plus, Search, Filter, Loader2 } from 'lucide-react';

export default function ClientDashboard({ userName }: { userName: string }) {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<any>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [shelfFilter, setShelfFilter] = useState('');
  const [shelves, setShelves] = useState<any[]>([]);
  const [loanFilter, setLoanFilter] = useState(false);

  const fetchShelves = async () => {
    try {
      const res = await fetch('/api/shelves');
      if (res.ok) {
        const data = await res.json();
        setShelves(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      let url = '/api/books';
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (statusFilter) params.append('status', statusFilter);
      if (shelfFilter) params.append('shelf', shelfFilter);

      const res = await fetch(`${url}?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelves();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, statusFilter, shelfFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBooks(books.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete book', err);
    }
  };

  const totals = {
    all: books.length,
    reading: books.filter(b => b.status === 'Reading').length,
    loaned: books.filter(b => !!b.loanedTo).length,
  };

  const filteredBooks = books.filter(b => {
    if (loanFilter && !b.loanedTo) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
            Welcome back, {userName}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Here is the state of your library.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-medium rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Book
        </button>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
          <h2 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-1">Total Books</h2>
          <p className="text-3xl font-semibold text-zinc-900 dark:text-white">{totals.all}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
          <h2 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-1">Currently Reading</h2>
          <p className="text-3xl font-semibold text-zinc-900 dark:text-white">{totals.reading}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
          <h2 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-1">Loaned Out</h2>
          <p className="text-3xl font-semibold text-zinc-900 dark:text-white">{totals.loaned}</p>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text"
            placeholder="Search titles or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none transition-all dark:text-white"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-zinc-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none transition-all dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="Unread">Unread</option>
            <option value="Reading">Reading</option>
            <option value="Read">Read</option>
          </select>
          <select
            value={shelfFilter}
            onChange={(e) => setShelfFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none transition-all dark:text-white"
          >
            <option value="">All Shelves</option>
            {shelves.map((shelf) => (
              <option key={shelf._id} value={shelf._id}>
                {shelf.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setLoanFilter(!loanFilter)}
            className={`px-4 py-2 border rounded-lg outline-none transition-all text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
              loanFilter 
                ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400' 
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            Loaned Only
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
             <BookCard 
               key={book._id} 
               book={book} 
               onEdit={setBookToEdit} 
               onDelete={handleDelete} 
             />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-zinc-100 dark:border-zinc-700">
            <BookOpen className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
          </div>
          <p className="text-lg text-zinc-700 dark:text-zinc-300 font-medium tracking-tight mb-1">
            {searchQuery || statusFilter ? 'No books match your filters' : 'Your library is empty'}
          </p>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm">
            {searchQuery || statusFilter ? 'Try adjusting your search or filters.' : 'Add your first book to get started.'}
          </p>
          {!(searchQuery || statusFilter) && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="mt-6 px-5 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors dark:text-white"
            >
              Add a book
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <AddBookModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchBooks} 
      />
      
      <EditBookModal 
        book={bookToEdit} 
        isOpen={!!bookToEdit} 
        onClose={() => setBookToEdit(null)} 
        onSuccess={fetchBooks} 
      />
    </div>
  );
}
