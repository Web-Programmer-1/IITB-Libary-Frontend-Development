'use client';

import { useEffect, useState } from 'react';
import BookGrid from '@/components/books/BookGrid';
import BookFilters from '@/components/books/BookFilters';
import { useBooks, useCategories } from '@/apis/queries';
import { useAuth } from '@/hooks/useAuth';
import { useCreateBook, useUploadImage } from '@/apis/mutations';
import { Plus, UploadCloud, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { BookQueryParams } from '@/types';

const generateISBN = () => {
  const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `978-${randomDigits}`;
};

const generateShelfNo = () => {
  const letters = 'ABCDEFGH';
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  const randomNumber = Math.floor(Math.random() * 50) + 1;
  return `${randomLetter}-${randomNumber}`;
};

export default function BooksPage() {
  const { isAuthenticated, user } = useAuth();
  const { data: categories } = useCategories({ limit: 100 });
  const createBookMutation = useCreateBook();
  const uploadImageMutation = useUploadImage('book-image');

  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<BookQueryParams>({
    page: 1,
    limit: 20,
  });

  const { data: books, isLoading } = useBooks(filters);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  // Pre-fill author with logged-in user name
  useEffect(() => {
    if (user?.name) {
      setAuthor(user.name);
    }
  }, [user]);
  const [isbn, setIsbn] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shelfNo, setShelfNo] = useState('');
  const [totalCopies, setTotalCopies] = useState<number>(5);
  const [bookImage, setBookImage] = useState('https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop');
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [publishedYear, setPublishedYear] = useState<number>(new Date().getFullYear());
  const [publisher, setPublisher] = useState('');
  const [pages, setPages] = useState<number>(300);
  const [language, setLanguage] = useState('English');

  const handleBookUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size must be less than 5MB');
    }

    setIsUploading(true);
    try {
      const data = await uploadImageMutation.mutateAsync(file);
      const imageUrl = data.url || URL.createObjectURL(file);
      setBookImage(imageUrl);
      toast.success('Book cover uploaded successfully!');
    } catch (err: any) {
      console.error('Book upload error:', err);
      const fallbackUrl = URL.createObjectURL(file);
      setBookImage(fallbackUrl);
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Upload failed. Using local preview for testing.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Title is required');
    if (!author.trim()) return toast.error('Author is required');
    if (!isbn.trim()) return toast.error('ISBN is required');
    if (!categoryId) return toast.error('Category is required');
    if (!shelfNo.trim()) return toast.error('Shelf Number is required');

    createBookMutation.mutate(
      {
        title,
        author,
        isbn,
        categoryId,
        shelfNo,
        totalCopies: Number(totalCopies),
        bookImage,
        description,
        publishedYear: Number(publishedYear),
        publisher,
        pages: Number(pages),
        language,
      },
      {
        onSuccess: () => {
          toast.success('Book created successfully!');
          setIsOpen(false);
          // Reset fields
          setTitle('');
          setAuthor(user?.name || '');
          setIsbn(generateISBN());
          setCategoryId('');
          setShelfNo(generateShelfNo());
          setTotalCopies(5);
          setBookImage('https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop');
          setDescription('');
          setPublishedYear(new Date().getFullYear());
          setPublisher('');
          setPages(300);
          setLanguage('English');
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to create book');
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-white">Browse Books</h1>
          <p className="mt-2 text-slate-500">
            Explore our collection and find your next read
          </p>
        </div>
        
        {isAuthenticated && (
          <Button
            onClick={() => {
              setIsOpen(true);
              if (user?.name) {
                setAuthor(user.name);
              }
              setIsbn(generateISBN());
              setShelfNo(generateShelfNo());
            }}
            icon={<Plus className="h-5 w-5" />}
          >
            Add Book
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <BookFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Results count */}
      {books && !isLoading && (
        <p className="mb-4 text-sm text-slate-500">
          Showing {books.length} {books.length === 1 ? 'book' : 'books'}
        </p>
      )}

      {/* Grid */}
      <BookGrid books={books} isLoading={isLoading} />

      {/* Pagination */}
      {books && books.length >= (filters.limit || 20) && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            disabled={filters.page === 1}
            onClick={() =>
              setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))
            }
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 transition-all hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            Previous
          </button>
          <span className="flex items-center px-4 text-sm text-slate-500">
            Page {filters.page || 1}
          </span>
          <button
            onClick={() =>
              setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))
            }
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 transition-all hover:bg-white/10 hover:text-white"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Book Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create New Book"
      >
        <form onSubmit={handleSubmit} className="space-y-4 mt-2 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Book Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Clean Code"
              required
            />
            <Input
              label="Author *"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Robert C. Martin"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="ISBN *"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="ISBN code"
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
              >
                <option value="" disabled className="bg-[var(--bg-secondary)]">Select a category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[var(--bg-secondary)]">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Shelf Number *"
              value={shelfNo}
              onChange={(e) => setShelfNo(e.target.value)}
              placeholder="e.g. A-12"
              required
            />
            <Input
              label="Total Copies"
              type="number"
              value={totalCopies}
              onChange={(e) => setTotalCopies(Number(e.target.value))}
              min={1}
              required
            />
            <Input
              label="Published Year"
              type="number"
              value={publishedYear}
              onChange={(e) => setPublishedYear(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="Publisher name"
            />
            <Input
              label="Pages"
              type="number"
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
            />
            <Input
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary or description..."
              className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors min-h-[80px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Book Cover Image
            </label>
            <label className="group relative flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-[var(--card-border)] bg-[var(--bg-secondary)]/30 hover:bg-[var(--bg-secondary)]/65 hover:border-[var(--accent-primary)]/50 transition-all duration-300 cursor-pointer overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleBookUpload}
                className="sr-only"
                disabled={isUploading}
              />
              {bookImage && bookImage !== 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop' ? (
                <>
                  <img
                    src={bookImage}
                    alt="Cover preview"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Floating Change Icon in Center on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <UploadCloud className="h-8 w-8 text-white" />
                  </div>
                  {/* Floating Reset Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBookImage('https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop');
                    }}
                    className="absolute top-2 right-2 z-20 flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-red-500 hover:text-red-400 transition-all duration-200"
                    title="Reset to Default"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center z-10">
                  <UploadCloud className="h-10 w-10 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors duration-300" />
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-[var(--accent-primary)] mb-1"></div>
                  <span className="text-[10px] text-white">Uploading...</span>
                </div>
              )}
            </label>
          </div>
          <Input
            label="Or Paste Cover Image URL"
            value={bookImage}
            onChange={(e) => setBookImage(e.target.value)}
            placeholder="Book cover image URL link"
          />
          
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--card-border)] sticky bottom-0 bg-[var(--bg-secondary)] py-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createBookMutation.isPending}
            >
              Create Book
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
