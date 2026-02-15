import { Head, Link, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Star, SlidersHorizontal, X } from 'lucide-react';

interface Artist {
    id: string;
    name: string;
    city: string;
    profile_photo: string;
    stage_name: string;
    categories: string[];
    base_rate: number;
    is_verified: boolean;
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

export default function Artists({ artists, cities, categories, filters }: ArtistsProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchTerm });
    };

    const applyFilters = (newFilters: Partial<Filters>) => {
        router.get(
            '/artists',
            { ...filters, ...newFilters },
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        router.get('/artists', {}, { preserveState: false });
    };

    const hasActiveFilters =
        filters.category || filters.city || filters.max_rate || filters.verified || filters.search;

    return (
        <MainLayout>
            <Head title="Tous les Artistes" />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-12">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-heading mb-2 text-foreground">Découvrez nos Artistes</h1>
                    <p className="text-muted-foreground">
                        {artists.data.length} artiste{artists.data.length > 1 ? 's' : ''} disponible
                        {artists.data.length > 1 ? 's' : ''}
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Rechercher un artiste par nom..."
                            className="pl-10 h-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    {/* Filter Toggle & Categories */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-2"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filtres
                            {hasActiveFilters && (
                                <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                    !
                                </Badge>
                            )}
                        </Button>

                        {/* Categories Quick Filter */}
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
                            <Button
                                variant={!filters.category ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => applyFilters({ category: undefined })}
                                className="whitespace-nowrap"
                            >
                                Tous
                            </Button>
                            {categories.map((cat) => (
                                <Button
                                    key={cat.key}
                                    variant={filters.category === cat.key ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => applyFilters({ category: cat.key })}
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
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* City Filter */}
                                    <div className="space-y-2">
                                        <Label>Ville</Label>
                                        <Select
                                            value={filters.city || ''}
                                            onValueChange={(value) =>
                                                applyFilters({ city: value || undefined })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Toutes les villes" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Toutes les villes</SelectItem>
                                                {cities.map((city) => (
                                                    <SelectItem key={city} value={city}>
                                                        {city}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Max Rate Filter */}
                                    <div className="space-y-2">
                                        <Label>Tarif maximum</Label>
                                        <Select
                                            value={filters.max_rate?.toString() || ''}
                                            onValueChange={(value) =>
                                                applyFilters({ max_rate: value ? parseInt(value) : undefined })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tous les tarifs" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Tous les tarifs</SelectItem>
                                                <SelectItem value="25000">Jusqu'à 25,000 FCFA</SelectItem>
                                                <SelectItem value="50000">Jusqu'à 50,000 FCFA</SelectItem>
                                                <SelectItem value="75000">Jusqu'à 75,000 FCFA</SelectItem>
                                                <SelectItem value="100000">Jusqu'à 100,000 FCFA</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Sort Filter */}
                                    <div className="space-y-2">
                                        <Label>Trier par</Label>
                                        <Select
                                            value={filters.sort}
                                            onValueChange={(value) => applyFilters({ sort: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="rating">Meilleures notes</SelectItem>
                                                <SelectItem value="rate_asc">Prix croissant</SelectItem>
                                                <SelectItem value="rate_desc">Prix décroissant</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Verified Filter */}
                                    <div className="space-y-2">
                                        <Label>Vérification</Label>
                                        <Button
                                            variant={filters.verified ? 'default' : 'outline'}
                                            className="w-full justify-start"
                                            onClick={() => applyFilters({ verified: !filters.verified })}
                                        >
                                            <Star className="w-4 h-4 mr-2" />
                                            Vérifiés uniquement
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
                                        <X className="w-4 h-4" />
                                        Réinitialiser les filtres
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Artists Grid */}
                {artists.data.length > 0 ? (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {artists.data.map((artist) => (
                                <Link key={artist.id} href={`/artist/${artist.id}`}>
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                                        <div className="aspect-square relative overflow-hidden bg-muted">
                                            <img
                                                src={artist.profile_photo}
                                                alt={artist.stage_name}
                                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                            />
                                            {artist.is_verified && (
                                                <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                                    Vérifié
                                                </Badge>
                                            )}
                                            {artist.rating > 0 && (
                                                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    {artist.rating.toFixed(1)}
                                                </div>
                                            )}
                                        </div>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg truncate">{artist.stage_name}</CardTitle>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <MapPin className="w-3 h-3" />
                                                {artist.city}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {artist.categories.slice(0, 2).map((category) => (
                                                    <Badge key={category} variant="secondary" className="text-xs capitalize">
                                                        {category}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="text-sm font-medium text-primary">
                                                À partir de {artist.base_rate.toLocaleString()} FCFA
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {artists.last_page > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {artists.links.map((link: any, index: number) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <Card>
                        <CardContent className="pt-12 pb-12 text-center">
                            <p className="text-muted-foreground mb-4">Aucun artiste trouvé avec ces critères.</p>
                            <Button onClick={clearFilters} variant="outline">
                                Réinitialiser les filtres
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
}
