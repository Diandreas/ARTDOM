import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    MapPin,
    Star,
    SlidersHorizontal,
    X,
    Loader2,
    Zap,
    Trophy,
    Users,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';
import * as ArtistActions from '@/actions/App/Http/Controllers/ArtistController';

interface Artist {
    id: string;
    name: string;
    city: string;
    profile_photo: string;
    stage_name: string;
    categories: string[];
    base_rate: number;
    is_verified: boolean;
    level: string;
    rating: number;
    total_reviews: number;
}

interface Filters {
    category?: string;
    city?: string;
    max_rate?: number;
    verified?: boolean;
    search?: string;
    sort: string;
}

interface Category {
    key: string;
    label: string;
}

interface ArtistsProps {
    artists: {
        data: Artist[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    cities: string[];
    categories: Category[];
    filters: Filters;
}

export default function Artists({
    artists,
    cities,
    categories,
    filters,
}: ArtistsProps) {
    const { t } = useAppLocale();
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const isFirstRender = useRef(true);

    const categoryLabel = (key: string) =>
        categories.find((c) => c.key === key)?.label ?? key;

    const applyFilters = (newFilters: Partial<Filters>) => {
        const merged = { ...filters, ...newFilters };
        const cleaned = Object.fromEntries(
            Object.entries(merged).filter(
                ([, v]) =>
                    v !== undefined && v !== null && v !== false && v !== '',
            ),
        );

        router.get(ArtistActions.index().url, cleaned, {
            preserveState: true,
            preserveScroll: true,
            onBefore: () => setIsSearching(true),
            onFinish: () => setIsSearching(false),
        });
    };

    // Debounced search
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                applyFilters({ search: searchTerm });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Sync searchTerm with filters.search when it changes externally (e.g. back button or clear filters)
    useEffect(() => {
        setSearchTerm(filters.search || '');
    }, [filters.search]);

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchTerm });
    };

    const clearFilters = () => {
        setSearchTerm('');
        router.get('/artists', {}, { preserveState: false });
    };

    const hasActiveFilters =
        filters.category ||
        filters.city ||
        filters.max_rate ||
        filters.verified ||
        filters.search;

    return (
        <MainLayout>
            <Head title={t('All artists')} />

            <div className="container mx-auto max-w-7xl px-4 py-8 pb-24 md:px-6 md:pb-12">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="font-heading mb-2 text-3xl font-bold text-foreground">
                        {t('Discover our artists')}
                    </h1>
                    <p className="text-muted-foreground">
                        {artists.data.length}{' '}
                        {artists.data.length > 1
                            ? t('artists available')
                            : t('artist available')}
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="relative">
                        {isSearching ? (
                            <Loader2 className="absolute top-3 left-3 h-5 w-5 animate-spin text-primary" />
                        ) : (
                            <Search className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
                        )}
                        <Input
                            type="search"
                            placeholder={t('Search an artist by name...')}
                            className="h-12 pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    {/* Filter Toggle & Categories */}
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-2"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            {t('Filters')}
                            {hasActiveFilters && (
                                <Badge className="ml-1 flex h-5 w-5 items-center justify-center rounded-full p-0">
                                    !
                                </Badge>
                            )}
                        </Button>

                        {/* Categories Quick Filter */}
                        <div className="scrollbar-hide flex flex-1 gap-2 overflow-x-auto">
                            <Button
                                variant={
                                    !filters.category ? 'default' : 'outline'
                                }
                                size="sm"
                                onClick={() =>
                                    applyFilters({ category: undefined })
                                }
                                className="whitespace-nowrap"
                            >
                                {t('All')}
                            </Button>
                            {categories.map((cat) => (
                                <Button
                                    key={cat.key}
                                    variant={
                                        filters.category === cat.key
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        applyFilters({ category: cat.key })
                                    }
                                    className="whitespace-nowrap capitalize"
                                >
                                    {cat.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Filters Panel */}
                    {showFilters && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    {/* City Filter */}
                                    <div className="space-y-2">
                                        <Label>{t('City')}</Label>
                                        <Select
                                            value={filters.city || 'all'}
                                            onValueChange={(value) =>
                                                applyFilters({
                                                    city:
                                                        value === 'all'
                                                            ? undefined
                                                            : value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={t(
                                                        'All cities',
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    {t('All cities')}
                                                </SelectItem>
                                                {cities.map((city) => (
                                                    <SelectItem
                                                        key={city}
                                                        value={city}
                                                    >
                                                        {city}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Max Rate Filter */}
                                    <div className="space-y-2">
                                        <Label>{t('Maximum rate')}</Label>
                                        <Select
                                            value={
                                                filters.max_rate?.toString() ||
                                                'all'
                                            }
                                            onValueChange={(value) =>
                                                applyFilters({
                                                    max_rate:
                                                        value === 'all'
                                                            ? undefined
                                                            : parseInt(value),
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={t('All rates')}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    {t('All rates')}
                                                </SelectItem>
                                                <SelectItem value="25000">
                                                    {t("Up to 25,000 FCFA")}
                                                </SelectItem>
                                                <SelectItem value="50000">
                                                    {t("Up to 50,000 FCFA")}
                                                </SelectItem>
                                                <SelectItem value="75000">
                                                    {t("Up to 75,000 FCFA")}
                                                </SelectItem>
                                                <SelectItem value="100000">
                                                    {t("Up to 100,000 FCFA")}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Sort Filter */}
                                    <div className="space-y-2">
                                        <Label>{t('Sort by')}</Label>
                                        <Select
                                            value={filters.sort}
                                            onValueChange={(value) =>
                                                applyFilters({ sort: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="rating">
                                                    {t('Best rated')}
                                                </SelectItem>
                                                <SelectItem value="rate_asc">
                                                    {t('Price ascending')}
                                                </SelectItem>
                                                <SelectItem value="rate_desc">
                                                    {t('Price descending')}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Verified Filter */}
                                    <div className="space-y-2">
                                        <Label>{t('Verification')}</Label>
                                        <Button
                                            variant={
                                                filters.verified
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className="w-full justify-start"
                                            onClick={() =>
                                                applyFilters({
                                                    verified: !filters.verified,
                                                })
                                            }
                                        >
                                            <Star className="mr-2 h-4 w-4" />
                                            {t('Verified only')}
                                        </Button>
                                    </div>
                                </div>

                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="mt-4 gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        {t('Reset filters')}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Artists Grid */}
                {artists.data.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {artists.data.map((artist) => (
                                <Link
                                    key={artist.id}
                                    href={ArtistActions.show(artist.id).url}
                                >
                                    <Card className="h-full cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
                                        <div className="relative aspect-square overflow-hidden bg-muted">
                                            <img
                                                src={artist.profile_photo}
                                                alt={artist.stage_name}
                                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                            <div className="absolute top-2 left-2 flex flex-col gap-2">
                                                {artist.level === 'emerging_star' && (
                                                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none text-[10px]">
                                                        <Trophy className="mr-1 h-3 w-3" />
                                                        {t('Star en émergence')}
                                                    </Badge>
                                                )}
                                                {artist.level === 'rising_star' && (
                                                    <Badge variant="secondary" className="text-[10px]">
                                                        <Zap className="mr-1 h-3 w-3 fill-current" />
                                                        {t('Artiste perçant')}
                                                    </Badge>
                                                )}
                                                {artist.level === 'talent' && (
                                                    <Badge variant="outline" className="bg-black/50 text-white border-white/20 text-[10px]">
                                                        {t('Talent')}
                                                    </Badge>
                                                )}
                                            </div>
                                            {artist.is_verified && (
                                                <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                                                    <Star className="mr-1 h-3 w-3 fill-current" />
                                                    {t('Verified')}
                                                </Badge>
                                            )}
                                            {artist.rating > 0 && (
                                                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur">
                                                    <Star className="h-3 w-3 fill-current" />
                                                    {artist.rating.toFixed(1)}
                                                </div>
                                            )}
                                        </div>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="truncate text-lg">
                                                {artist.stage_name}
                                            </CardTitle>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                                {artist.city}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="mb-3 flex flex-wrap gap-2">
                                                {artist.categories
                                                    .slice(0, 2)
                                                    .map((category) => (
                                                        <Badge
                                                            key={category}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {categoryLabel(
                                                                category,
                                                            )}
                                                        </Badge>
                                                    ))}
                                            </div>
                                            <div className="text-sm font-medium text-primary">
                                                {t('Starting from')}{' '}
                                                {artist.base_rate.toLocaleString()}{' '}
                                                FCFA
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {artists.last_page > 1 && (
                            <div className="mt-8 flex justify-center gap-2">
                                {artists.links.map(
                                    (link: any, index: number) => (
                                        <Button
                                            key={index}
                                            variant={
                                                link.active
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() =>
                                                link.url &&
                                                router.visit(link.url)
                                            }
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <Card>
                        <CardContent className="pt-12 pb-12 text-center">
                            <p className="mb-4 text-muted-foreground">
                                {t('No artists found with these filters.')}
                            </p>
                            <Button onClick={clearFilters} variant="outline">
                                {t('Reset filters')}
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
}
