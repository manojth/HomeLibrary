'use client';

import { useState, useEffect } from 'react';
import { Loader2, Image as ImageIcon, ImageOff } from 'lucide-react';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBookModal({ isOpen, onClose, onSuccess }: AddBookModalProps) {
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
    shelves: [] as string[],
  });

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
        : [...prev.shelves, id],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalPages: parseInt(formData.totalPages),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add book');
      }

      onSuccess();
      onClose();
      setFormData({
        title: '',
        author: '',
        totalPages: '',
        status: 'Unread',
        coverImageUrl: '',
        shelves: [],
      });
      setNewShelfName('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Window */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Drag handle */}
        <div className="flex h-5 w-full items-center justify-center mt-1">
          <div className="h-1 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="px-8 pt-4 pb-2">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add New Book</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Grow your digital shelf with a new story.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl">
                {error}
              </div>
            )}

            {/* Title & Author */}
            <div className="grid grid-cols-1 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Book Title <span className="text-red-400">*</span>
                </span>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none h-12 px-4 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
                  placeholder="e.g. The Great Gatsby"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Author <span className="text-red-400">*</span>
                </span>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none h-12 px-4 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
                  placeholder="e.g. F. Scott Fitzgerald"
                />
              </label>
            </div>

            {/* Pages, Status & Cover URL */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pages</span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl select-none">description</span>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalPages}
                    onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none h-12 pl-10 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
                    placeholder="0"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cover URL</span>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 select-none" />
                  <input
                    type="url"
                    value={formData.coverImageUrl}
                    onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none h-12 pl-10 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
                    placeholder="https://..."
                  />
                </div>
              </label>
            </div>

            {/* Preview Area */}
            {formData.coverImageUrl && (
              <div className="flex justify-center">
                <div className="relative h-48 w-32 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img
                    src={formData.coverImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <ImageOff className="w-8 h-8 mb-1 opacity-50" />
                    <span className="text-[10px] uppercase font-bold opacity-50">Invalid URL</span>
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</span>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none h-12 px-4 text-slate-900 dark:text-slate-100 transition-all"
              >
                <option value="Unread">Unread</option>
                <option value="Reading">Reading</option>
                <option value="Read">Read</option>
              </select>
            </label>

            {/* Shelves */}
            <div className="space-y-3">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Assign to Shelves</span>
              <div className="flex flex-wrap gap-2 items-center">
                {shelves.map(shelf => {
                  const isSelected = formData.shelves.includes(shelf._id);
                  return (
                    <button
                      key={shelf._id}
                      type="button"
                      onClick={() => toggleShelf(shelf._id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 border transition-colors ${
                        isSelected
                          ? 'bg-primary text-white border-primary'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary/50'
                      }`}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-sm leading-none">check</span>
                      )}
                      {shelf.name}
                    </button>
                  );
                })}

                {/* Inline new shelf input */}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newShelfName}
                    onChange={(e) => setNewShelfName(e.target.value)}
                    placeholder="Add new..."
                    className="bg-transparent border-0 border-b border-slate-200 dark:border-slate-700 px-2 py-1 text-sm focus:outline-none focus:border-primary placeholder:text-slate-400 text-slate-700 dark:text-slate-300 w-24 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateShelf();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-8 py-5 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-xl leading-none">add</span>
              )}
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
