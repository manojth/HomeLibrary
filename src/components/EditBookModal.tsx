'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Image as ImageIcon, ImageOff } from 'lucide-react';

interface EditBookModalProps {
  book: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBookModal({ book, isOpen, onClose, onSuccess }: EditBookModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shelves, setShelves] = useState<any[]>([]);
  const [newShelfName, setNewShelfName] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    status: 'Unread',
    coverImageUrl: '',
    currentPage: 0,
    shelves: [] as string[],
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        totalPages: String(book.totalPages),
        status: book.status || 'Unread',
        coverImageUrl: book.coverImageUrl || '',
        currentPage: book.currentPage || 0,
        shelves: book.shelves ? book.shelves.map((s: any) => typeof s === 'string' ? s : s._id) : [],
      });
    }
  }, [book]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/shelves').then(res => res.json()).then(data => {
        if (Array.isArray(data)) setShelves(data);
      });
    }
  }, [isOpen]);

  const toggleShelf = (id: string) => {
    setFormData(prev => ({
      ...prev,
      shelves: prev.shelves.includes(id) 
        ? prev.shelves.filter(s => s !== id)
        : [...prev.shelves, id]
    }));
  };

  const handleCreateShelf = async () => {
    if (!newShelfName.trim()) return;
    try {
      const res = await fetch('/api/shelves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newShelfName }),
      });
      if (res.ok) {
        const newShelf = await res.json();
        setShelves([...shelves, newShelf]);
        toggleShelf(newShelf._id);
        setNewShelfName('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen || !book) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/books/${book._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalPages: parseInt(formData.totalPages),
          currentPage: parseInt(String(formData.currentPage)),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update book');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Edit Book</h2>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none transition-all dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Author *</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none transition-all dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Total Pages *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.totalPages}
                  onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none transition-all dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none transition-all dark:text-white"
                >
                  <option value="Unread">Unread</option>
                  <option value="Reading">Reading</option>
                  <option value="Read">Read</option>
                </select>
              </div>
            </div>

            {formData.status === 'Reading' && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Current Page</label>
                <input
                  type="number"
                  min="0"
                  max={formData.totalPages}
                  value={formData.currentPage}
                  onChange={(e) => setFormData({ ...formData, currentPage: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none transition-all dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Cover Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none transition-all dark:text-white"
              />
            </div>

            {/* Preview Area */}
            {formData.coverImageUrl && (
              <div className="flex justify-center">
                <div className="relative h-48 w-32 bg-zinc-100 dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner">
                  <img
                    src={formData.coverImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
                    <ImageOff className="w-8 h-8 mb-1 opacity-50" />
                    <span className="text-[10px] uppercase font-bold opacity-50">Invalid URL</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Shelves</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {shelves.map(shelf => (
                  <button
                    key={shelf._id}
                    type="button"
                    onClick={() => toggleShelf(shelf._id)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      formData.shelves.includes(shelf._id)
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {shelf.name}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newShelfName}
                  onChange={(e) => setNewShelfName(e.target.value)}
                  placeholder="New shelf name..."
                  className="flex-1 px-3 py-1.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateShelf();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleCreateShelf}
                  className="px-3 py-1.5 text-sm font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors border border-transparent"
                >
                  Create
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
