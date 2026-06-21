'use client';

import { useState } from 'react';
import CategoryCard from '@/components/categories/CategoryCard';
import Skeleton from '@/components/ui/Skeleton';
import { useCategories } from '@/apis/queries';
import { useAuth } from '@/hooks/useAuth';
import { useCreateCategory, useUploadImage } from '@/apis/mutations';
import { Plus, UploadCloud, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function CategoriesPage() {
  const { isAuthenticated } = useAuth();
  const { data: categories, isLoading } = useCategories({ limit: 50 });
  const createCategoryMutation = useCreateCategory();
  const uploadImageMutation = useUploadImage('category-image');

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState('https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop');
  const [isUploading, setIsUploading] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleCategoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size must be less than 5MB');
    }

    setIsUploading(true);
    try {
      const data = await uploadImageMutation.mutateAsync(file);
      const imageUrl = data.url || URL.createObjectURL(file);
      setCategoryImage(imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (err: any) {
      console.error('Upload error:', err);
      const fallbackUrl = URL.createObjectURL(file);
      setCategoryImage(fallbackUrl);
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
    if (!name.trim()) return toast.error('Name is required');
    if (!slug.trim()) return toast.error('Slug is required');

    createCategoryMutation.mutate(
      {
        name,
        slug,
        description,
        categoryImage,
      },
      {
        onSuccess: () => {
          toast.success('Category created successfully!');
          setIsOpen(false);
          setName('');
          setSlug('');
          setDescription('');
          setCategoryImage('https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop');
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to create category');
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <p className="mt-2 text-slate-500">Browse books by category</p>
        </div>
        
        {isAuthenticated && (
          <Button
            onClick={() => setIsOpen(true)}
            icon={<Plus className="h-5 w-5" />}
          >
            Add Category
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="stagger-children grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl">📂</div>
          <h3 className="text-lg font-semibold text-white">
            No categories found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Categories will appear here once created.
          </p>
        </div>
      )}

      {/* Create Category Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create New Category"
      >
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            label="Category Name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Science Fiction"
            required
          />
          <Input
            label="URL Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. science-fiction"
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the category..."
              className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors min-h-[100px]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Category Image
            </label>
            <label className="group relative flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-[var(--card-border)] bg-[var(--bg-secondary)]/30 hover:bg-[var(--bg-secondary)]/65 hover:border-[var(--accent-primary)]/50 transition-all duration-300 cursor-pointer overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleCategoryUpload}
                className="sr-only"
                disabled={isUploading}
              />
              {categoryImage && categoryImage !== 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop' ? (
                <>
                  <img
                    src={categoryImage}
                    alt="Category preview"
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
                      setCategoryImage('https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop');
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
            label="Or Paste Category Image URL"
            value={categoryImage}
            onChange={(e) => setCategoryImage(e.target.value)}
            placeholder="Image URL link"
          />
          
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--card-border)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createCategoryMutation.isPending}
            >
              Create Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
