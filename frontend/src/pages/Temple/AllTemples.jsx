import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ArrowRight, Loader2, AlertCircle, Search } from 'lucide-react';
import { getPublicTemples } from '../../features/temples/templeApi';
import SEO from '../../components/SEO';

const PAGE_SIZE = 20;

const AllTemples = () => {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [search, setSearch] = useState('');

    const { data: temples = [], isLoading, isError } = useQuery({
        queryKey: ['public-temples'],
        queryFn: getPublicTemples,
    });

    const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api/v1', '');

    // Sort descending (newest first)
    const sorted = [...temples].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Filter by search
    const filtered = search.trim()
        ? sorted.filter(
            (t) =>
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.district?.name?.toLowerCase().includes(search.toLowerCase()) ||
                t.deity?.name?.toLowerCase().includes(search.toLowerCase())
        )
        : sorted;

    const visible = filtered.slice(0, visibleCount);
    const hasMore = visibleCount < filtered.length;

    return (
        <div className="min-h-screen bg-background pb-20">
            <SEO
                title="All Temples — Tamil Nadu Sacred Sites"
                description="Browse all approved Hindu temples across Tamil Nadu. Explore ancient temples by name, district, and deity. Discover the divine architectural marvels of Tamil Nadu."
                keywords="all Tamil Nadu temples, browse temples, temple list, ancient temples Tamil Nadu"
                canonical="/all-temples"
            />

            {/* Page Header */}
            <section className="pt-28 pb-10 border-b border-border-theme bg-secondary-bg/10">
                <div className="container mx-auto px-6 max-w-7xl">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-6">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground/70">All Temples</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                    {isLoading ? 'Loading...' : `${filtered.length} Temples`}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-2">
                                All <span className="text-primary italic">Temples</span>
                            </h1>
                            <p className="text-foreground/40 font-medium">
                                Every approved sacred site documented across Tamil Nadu.
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-primary transition-colors" />
                            <input
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
                                placeholder="Search by name, district, deity..."
                                className="w-full bg-secondary-bg border border-border-theme focus:border-primary/40 pl-11 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all placeholder:text-foreground/25 font-medium"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Temple Grid */}
            <section className="container mx-auto px-6 max-w-7xl pt-12">

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="rounded-3xl h-[340px] bg-secondary-bg border border-border-theme animate-pulse" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="py-32 text-center">
                        <AlertCircle className="w-14 h-14 text-red-500/40 mx-auto mb-4" />
                        <p className="text-foreground/40 font-bold text-lg">Failed to load temples.</p>
                        <p className="text-foreground/25 text-sm mt-1">Please check your connection and try again.</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-32 text-center border-2 border-dashed border-border-theme rounded-[2.5rem] bg-secondary-bg/10">
                        <MapPin className="w-12 h-12 text-foreground/15 mx-auto mb-4" />
                        <p className="text-xl font-black text-foreground/30">
                            {search ? `No temples found for "${search}"` : 'No temples available yet.'}
                        </p>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="mt-5 text-xs font-black uppercase tracking-widest text-primary hover:underline"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {visible.map((temple, i) => {
                                const imageUrl = temple.images?.[0]
                                    ? `${API_URL}${temple.images[0]}`
                                    : null;
                                return (
                                    <Link
                                        key={temple._id}
                                        to={`/temples/${temple.slug}`}
                                        className="group relative rounded-3xl overflow-hidden h-[340px] border border-border-theme block hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                                        style={{ animationDelay: `${(i % PAGE_SIZE) * 30}ms` }}
                                    >
                                        {/* Background Image */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 bg-secondary-bg"
                                            style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}
                                        >
                                            {!imageUrl && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <MapPin className="w-12 h-12 text-foreground/10" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/30 to-black/90 pointer-events-none" />

                                        {/* Content */}
                                        <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end">
                                            <span className="text-[9px] uppercase font-black tracking-[0.2em] text-primary mb-1.5">
                                                {temple.district?.name || 'Tamil Nadu'}
                                            </span>
                                            <h3 className="text-lg font-black text-white leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                {temple.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-white/60 text-[10px] font-bold uppercase tracking-wider">
                                                    <MapPin className="w-3 h-3" />
                                                    {temple.deity?.name ? `${temple.deity.name} Temple` : 'Sacred Site'}
                                                </div>
                                                <div className="w-7 h-7 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-lg">
                                                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Load More */}
                        {hasMore && (
                            <div className="mt-14 text-center">
                                <p className="text-foreground/30 text-sm font-medium mb-4">
                                    Showing <span className="font-black text-foreground/60">{visible.length}</span> of <span className="font-black text-foreground/60">{filtered.length}</span> temples
                                </p>
                                <button
                                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                                    className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-[2rem] font-black text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 transition-all active:scale-95"
                                >
                                    <Loader2 className="w-4 h-4" />
                                    Load More Temples
                                </button>
                            </div>
                        )}

                        {!hasMore && filtered.length > 0 && (
                            <div className="mt-14 text-center">
                                <p className="text-foreground/25 text-sm font-bold uppercase tracking-widest">
                                    ✦ You've seen all {filtered.length} temples ✦
                                </p>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default AllTemples;
