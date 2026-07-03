'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Users,
  Star,
  Sparkles,
  TrendingUp,
  Library,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import BookCard from '@/components/books/BookCard';
import CategoryCard from '@/components/categories/CategoryCard';
import StatCard from '@/components/ui/StatCard';
import { BookCardSkeleton } from '@/components/ui/Skeleton';
import { useBooks, useCategories, useTopBooks, usePublishers } from '@/apis/queries';
import { useAuth } from '@/hooks/useAuth';

const SLIDES = [
  {
    id: 1,
    category: 'Programming & Tech',
    title: 'Introduction to Algorithms',
    subtitle: 'By Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein',
    description: 'The global standard for understanding computer algorithms, data structures, and software engineering foundations.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
    readers: 142,
    copies: 18,
    rating: 4.9,
    tag: 'Technology',
    floatingIcon: '💻',
    floatingTitle: 'Algorithms Book',
    floatingStatus: 'Issued Successfully',
  },
  {
    id: 2,
    category: 'Science & Cosmos',
    title: 'A Brief History of Time',
    subtitle: 'By Stephen Hawking',
    description: 'Explore the landmark volume that explains space, time, black holes, and the origin and fate of our universe.',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=800&auto=format&fit=crop',
    readers: 98,
    copies: 8,
    rating: 4.8,
    tag: 'Science',
    floatingIcon: '🔭',
    floatingTitle: 'Physics Book',
    floatingStatus: 'Issued Successfully',
  },
  {
    id: 3,
    category: 'World History & Civilizations',
    title: 'Sapiens: A Brief History of Humankind',
    subtitle: 'By Yuval Noah Harari',
    description: 'A brilliant explanation of how Homo sapiens came to dominate the Earth, spanning from ancient evolution to modern technology.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop',
    readers: 115,
    copies: 12,
    rating: 4.7,
    tag: 'History',
    floatingIcon: '📜',
    floatingTitle: 'History Book',
    floatingStatus: 'Returned Successfully',
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);
  const { data: featuredBooks, isLoading: booksLoading } = useBooks({
    limit: 5,
    sortBy: 'year_desc',
  });
  const { data: categories, isLoading: catsLoading } = useCategories({
    limit: 6,
  });
  const { data: topBooks } = useTopBooks();

  return (
    <div className="relative">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden px-4 py-20 lg:py-32 bg-[#0a0018]">
        {/* Professional Mesh Gradient Background inspired by reference */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top Left - Magenta/Pink */}
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full mix-blend-screen filter blur-[100px] opacity-80 animate-float" style={{ background: 'radial-gradient(circle, rgba(236,0,140,0.8) 0%, rgba(236,0,140,0) 70%)' }} />
          {/* Top Right - Orange/Peach */}
          <div className="absolute top-[0%] -right-[10%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-float-delayed" style={{ background: 'radial-gradient(circle, rgba(255,123,84,0.8) 0%, rgba(255,123,84,0) 70%)' }} />
          {/* Bottom Left - Cyan/Blue */}
          <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] rounded-full mix-blend-screen filter blur-[120px] opacity-80 animate-float" style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.7) 0%, rgba(0,240,255,0) 70%)' }} />
          {/* Bottom Right - Deep Purple/Violet */}
          <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full mix-blend-screen filter blur-[120px] opacity-90 animate-float-delayed" style={{ background: 'radial-gradient(circle, rgba(110,0,255,0.8) 0%, rgba(110,0,255,0) 70%)' }} />
          {/* Overlay to blend everything smoothly */}
          <div className="absolute inset-0 bg-[#0a0018]/30 backdrop-blur-3xl" />
          {/* Seamless bottom fade to match page background */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left side: Text content */}
            <div className="animate-fade-in-up lg:col-span-6 flex flex-col items-start text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-1.5 text-sm text-[var(--text-secondary)] backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 text-[var(--accent-primary)] animate-pulse" />
                <span>Your Academic Universe, Connected</span>
              </div>

              <h1 className="mb-6 text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl text-left">
                <span className="text-[var(--text-primary)]">Empower Your Learning Journey at</span>
                <br />
                <span className="gradient-text">IITB Library Portal</span>
              </h1>

              <p className="mb-8 max-w-xl text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
                Discover a world of infinite knowledge. Search through thousands of textbook volumes, journal articles, and novels. Borrow items instantly, track reading milestones, write reviews, and collaborate seamlessly.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/books">
                  <Button size="lg" icon={<BookOpen className="h-5 w-5" />}>
                    Explore Collection
                  </Button>
                </Link>
                {isAuthenticated ? (
                  <Link href="/my-dashboard">
                    <Button variant="outline" size="lg">
                      Go to My Space
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button variant="outline" size="lg">
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Features pill grid */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg">
                <div className="flex items-center gap-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] p-3 backdrop-blur-md">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                    <BookOpen className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">1,000+ Books</p>
                    <p className="text-[10px] text-[var(--text-muted)]">Multiple Categories</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] p-3 backdrop-blur-md">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                    <Users className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">500+ Readers</p>
                    <p className="text-[10px] text-[var(--text-muted)]">Active community</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] p-3 backdrop-blur-md col-span-2 sm:col-span-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                    <RefreshCw className="h-4.5 w-4.5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">Instant Issuing</p>
                    <p className="text-[10px] text-[var(--text-muted)]">Fully Automated</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Modern Library Management Visualization */}
            <div className="lg:col-span-6 relative flex justify-center items-center w-full">
              {/* Decorative background glow behind dashboard mockup */}
              <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 blur-2xl opacity-80" />

              {/* Main slideshow browser/card mockup */}
              <div className="relative w-full max-w-[560px] rounded-3xl border border-[var(--card-border)] bg-[var(--bg-secondary)]/90 shadow-2xl p-4.5 backdrop-blur-xl overflow-hidden group hover:border-[var(--card-border-hover)] transition-all duration-300 flex flex-col z-10">
                
                {/* Browser bar */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--card-border)]">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)] tracking-wider uppercase">Live Catalog Preview</div>
                  <div className="h-2.5 w-6 rounded bg-[var(--card-border)]" />
                </div>

                {/* Slides content - Images only */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {SLIDES.map((slide, idx) => {
                    const isVisible = idx === currentSlide;
                    return (
                      <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                          isVisible
                            ? 'opacity-100 translate-x-0 pointer-events-auto'
                            : 'opacity-0 translate-x-8 pointer-events-none'
                        }`}
                      >
                        {/* Slide image header */}
                        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[var(--bg-primary)] border border-[var(--card-border)]">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="object-cover w-full h-full opacity-90 group-hover:scale-103 transition-transform duration-700 ease-out"
                          />
                          
                          {/* Category overlay pill */}
                          <span className="absolute top-4 right-4 rounded-full bg-[var(--bg-primary)]/90 border border-[var(--card-border)] px-3 py-1 text-[10px] font-bold text-[var(--accent-primary)] tracking-wide uppercase shadow-lg backdrop-blur-sm">
                            {slide.tag}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Slider progress dots */}
                <div className="flex justify-center gap-1.5 mt-4">
                  {SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentSlide
                          ? 'w-6 bg-[var(--accent-primary)]'
                          : 'w-1.5 bg-[var(--card-border)] hover:bg-[var(--text-muted)]'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

              </div>

              {/* FLOATING CARD 1: Dynamic Book Variant Info (positioned top-left) */}
              <div className="absolute -left-6 top-8 animate-float hidden sm:flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--bg-primary)]/90 p-3 shadow-xl backdrop-blur-md max-w-[220px] z-20 transition-all duration-500">
                <div className="logo-themed flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-white text-base">
                  {SLIDES[currentSlide].floatingIcon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[140px] transition-all duration-300">
                    {SLIDES[currentSlide].floatingTitle}
                  </h4>
                  <p className="text-[10px] text-emerald-400 font-medium transition-all duration-300">
                    {SLIDES[currentSlide].floatingStatus}
                  </p>
                </div>
              </div>

              {/* FLOATING CARD 2: Active User Session (positioned bottom-right) */}
              <div className="absolute -right-6 bottom-8 animate-float-delayed hidden sm:flex flex-col gap-1.5 rounded-2xl border border-[var(--card-border)] bg-[var(--bg-primary)]/95 p-3 shadow-xl backdrop-blur-md min-w-[180px] z-20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-[var(--text-muted)]">Active Readers</span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 relative" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[var(--text-primary)]">148+</span>
                  <span className="text-[9px] text-emerald-400 font-medium">+12% this hour</span>
                </div>
                <div className="w-full bg-[var(--card-border)] h-1 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] h-full w-[75%]" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Quick Stats ── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="stagger-children grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard
              title="Books Available"
              value={topBooks?.length ? '1000+' : '—'}
              icon={<BookOpen className="h-5 w-5" />}
            />
            <StatCard
              title="Active Readers"
              value="500+"
              icon={<Users className="h-5 w-5" />}
            />
            <StatCard
              title="Categories"
              value={categories?.length ?? '—'}
              icon={<Library className="h-5 w-5" />}
            />
            <StatCard
              title="Reviews"
              value="2000+"
              icon={<Star className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* ── Library Catalog & Filters (Rokomari Style) ── */}
      <section className="px-4 py-16 bg-[var(--bg-secondary)]/30 border-y border-white/5">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-10 text-center animate-fade-in-up">
            <h2 className="text-3xl font-extrabold text-white">IITB Library Catalog</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)] max-w-xl mx-auto">
              Browse books, filter by your favorite author, publisher, language, or category with real-time updates.
            </p>
          </div>

          <CatalogContainer categories={categories ?? []} />
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Browse by Category
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Find books that match your interest
              </p>
            </div>
            <Link href="/categories">
              <Button variant="ghost" size="sm">
                All Categories
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {catsLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="h-52 animate-pulse rounded-2xl bg-[var(--card-bg)]"
                />
              ))}
            </div>
          ) : (
            <div className="stagger-children grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {categories?.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-3xl border border-[var(--card-border)] p-12 backdrop-blur-xl"
            style={{ background: `color-mix(in srgb, var(--accent-primary) 5%, var(--bg-primary))` }}
          >
            <h2 className="mb-4 text-3xl font-bold text-[var(--text-primary)]">
              Ready to start reading?
            </h2>
            <p className="mb-8 text-[var(--text-muted)]">
              Join our community of readers. Issue books, write reviews, and
              track your reading progress.
            </p>
            <Link href="/register">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

interface Category {
  id: string;
  name: string;
}

function CatalogContainer({ categories }: { categories: Category[] }) {
  // Query Filters State
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('best_seller');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  
  // Responsive sidebar toggles
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Author and publisher list filter options loaded dynamically
  const { data: dbPublishers } = usePublishers();

  const publisherOptions = dbPublishers || [];

  // Helper toggle handlers
  const handlePublisherToggle = (name: string) => {
    setSelectedPublishers(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  };

  const handleRatingSelect = (stars: number) => {
    setSelectedRating(prev => prev === stars ? null : stars);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSortBy('best_seller');
    setInStockOnly(false);
    setSelectedPublishers([]);
    setSelectedRating(null);
  };

  // Build query params
  const queryParams = {
    limit: 20,
    search: searchQuery || undefined,
    categoryId: activeTab === 'all' ? undefined : activeTab,
    sortBy: sortBy as any,
    inStock: inStockOnly ? 'true' : undefined,
    publisher: selectedPublishers.length > 0 ? selectedPublishers.join(',') : undefined,
    minRating: selectedRating || undefined,
  };

  const { data: books, isLoading: booksLoading } = useBooks(queryParams);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* ── Mobile Filter Toggle ── */}
      <div className="flex lg:hidden items-center justify-between gap-4 w-full">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter Books
        </button>
        <span className="text-xs text-[var(--text-muted)] font-medium">
          Showing {books?.length || 0} product(s)
        </span>
      </div>

      {/* ── Sidebar Filters (Rokomari Style) ── */}
      <aside
        className={`fixed inset-0 z-50 flex flex-col bg-[#0a0018]/95 p-6 backdrop-blur-xl lg:backdrop-blur-none transition-all duration-300 lg:static lg:z-0 lg:flex lg:w-64 lg:bg-transparent lg:p-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 lg:hidden mb-6">
          <h3 className="text-lg font-bold text-white">Filters</h3>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Search bar inside sidebar */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search books, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:border-[var(--accent-primary)]/50 focus:outline-none"
            />
          </div>

          {/* Stock criteria */}
          <div className="pb-4 border-b border-white/5">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-[var(--accent-primary)] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                In Stock Only
              </span>
            </label>
          </div>

          {/* Sorting */}
          <div className="pb-5 border-b border-white/5">
            <h4 className="mb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Sort By</h4>
            <div className="space-y-2.5">
              {[
                { value: 'best_seller', label: 'Best Seller' },
                { value: 'year_desc', label: 'New Released' },
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' },
                { value: 'discount_desc', label: 'Discount: High to Low' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="radio"
                    name="sortBy"
                    value={opt.value}
                    checked={sortBy === opt.value}
                    onChange={() => setSortBy(opt.value)}
                    className="h-4 w-4 border-white/10 bg-white/5 text-[var(--accent-primary)] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>



          {/* Filter by Publishers */}
          <div className="pb-5 border-b border-white/5">
            <h4 className="mb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">By Publishers</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
              {publisherOptions.map((pubName) => (
                <label key={pubName} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedPublishers.includes(pubName)}
                    onChange={() => handlePublisherToggle(pubName)}
                    className="h-4 w-4 rounded border-white/10 bg-white/5 text-[var(--accent-primary)] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    {pubName}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter by Rating */}
          <div className="pb-5 border-b border-white/5">
            <h4 className="mb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Rating</h4>
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((stars) => {
                const isSelected = selectedRating === stars;
                return (
                  <button
                    key={stars}
                    onClick={() => handleRatingSelect(stars)}
                    className={`flex items-center justify-between w-full p-2 rounded-xl transition-all duration-150 border text-left ${
                      isSelected
                        ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-white'
                        : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < stars ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium">
                        {stars === 5 ? '5 Stars' : `& Up`}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold text-[var(--accent-primary)] bg-[var(--accent-primary)]/20 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Filters button */}
          <button
            onClick={handleResetFilters}
            className="w-full text-center py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      </aside>

      {/* ── Main content area with Category Tabs and Catalog Grid ── */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Top category tabs system (horizontal scrollbar) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg shadow-[var(--accent-primary)]/20'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === cat.id
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg shadow-[var(--accent-primary)]/20'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Books Catalog Grid */}
        <div>
          {booksLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 border border-white/10 rounded-2xl" />
              ))}
            </div>
          ) : !books || books.length === 0 ? (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md mx-auto">
              <BookOpen className="mx-auto h-12 w-12 text-slate-500 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Books Found</h3>
              <p className="text-sm text-slate-400 mb-4">We couldn't find any books matching your criteria. Try adjusting your filters.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-white hover:bg-white/20 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="stagger-children grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
