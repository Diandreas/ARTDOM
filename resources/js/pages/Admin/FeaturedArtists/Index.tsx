import { Head, router, useForm } from '@inertiajs/react';
import { GripVertical, Plus, Trash2, Search, User as UserIcon, Loader2, Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin-layout';
import { useAppLocale } from '@/hooks/use-app-locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface Artist {
    id: string;
    name: string;
    stage_name: string;
    profile_photo: string;
    featured_order?: number;
    is_verified: boolean;
}

interface Props {
    featuredArtists: Artist[];
}

export default function FeaturedArtists({ featuredArtists: initialFeaturedArtists }: Props) {
    const { t } = useAppLocale();
    const [featuredArtists, setFeaturedArtists] = useState<Artist[]>(initialFeaturedArtists);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Artist[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setFeaturedArtists(initialFeaturedArtists);
    }, [initialFeaturedArtists]);

    useEffect(() => {
        if (searchTerm.length < 2) {
            setSearchResults([]);
            return;
        }

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        setIsSearching(true);
        searchTimeout.current = setTimeout(async () => {
            try {
                const response = await fetch(`/admin/featured-artists/search?search=${encodeURIComponent(searchTerm)}`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Error searching artists:', error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [searchTerm]);

    const handleAdd = (artistId: string) => {
        router.post('/admin/featured-artists', { artist_id: artistId }, {
            preserveScroll: true,
            onSuccess: () => {
                setSearchTerm('');
                setSearchResults([]);
            }
        });
    };

    const handleRemove = (artistId: string) => {
        if (confirm(t('Remove this artist from featured?'))) {
            router.delete(`/admin/featured-artists/${artistId}`, { preserveScroll: true });
        }
    };

    const moveArtist = (index: number, direction: 'up' | 'down') => {
        const newArtists = [...featuredArtists];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= newArtists.length) return;

        [newArtists[index], newArtists[newIndex]] = [newArtists[newIndex], newArtists[index]];
        
        setFeaturedArtists(newArtists);

        const orders = newArtists.map((artist, idx) => ({
            id: artist.id,
            order: idx + 1
        }));

        router.post('/admin/featured-artists/reorder', { orders }, { preserveScroll: true });
    };

    return (
        <AdminLayout 
            title={t('Featured artists')} 
            subtitle={t('Manage artists displayed on the homepage')}
        >
            <Head title={`Admin — ${t('Featured artists')}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Search and Add */}
                <div className="lg:col-span-1 space-y-4">
                    <Card>
                        <CardHeader className="py-4">
                            <CardTitle className="text-base font-semibold">{t('Add an artist')}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('Search an artist by name...')}
                                    className="pl-9 h-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-3">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {searchResults.length > 0 ? (
                                    searchResults.map((artist) => (
                                        <div 
                                            key={artist.id}
                                            className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={artist.profile_photo} />
                                                    <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-1">
                                                        <p className="text-sm font-medium leading-none">{artist.stage_name}</p>
                                                        {artist.is_verified && <Star className="h-3 w-3 fill-primary text-primary" />}
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground mt-1">{artist.name}</p>
                                                </div>
                                            </div>
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="h-8 w-8 text-primary"
                                                onClick={() => handleAdd(artist.id)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : searchTerm.length >= 2 && !isSearching ? (
                                    <p className="text-center py-4 text-xs text-muted-foreground">{t('No artist found')}</p>
                                ) : (
                                    <p className="text-center py-4 text-xs text-muted-foreground">
                                        {searchTerm.length < 2 ? t('Type at least 2 characters to search') : ''}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Featured List */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader className="py-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold">
                                {t('Featured artists')} ({featuredArtists.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {featuredArtists.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                                    <UserIcon className="h-10 w-10 text-muted-foreground/30 mb-2" />
                                    <p className="text-sm text-muted-foreground">{t('No featured artist yet.')}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{t('Search and add artists from the left panel.')}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {featuredArtists.map((artist, index) => (
                                        <div 
                                            key={artist.id}
                                            className="flex items-center gap-4 p-3 rounded-lg border bg-card transition-shadow hover:shadow-sm"
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6" 
                                                    onClick={() => moveArtist(index, 'up')}
                                                    disabled={index === 0}
                                                >
                                                    <GripVertical className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <Avatar className="h-12 w-12 border">
                                                <AvatarImage src={artist.profile_photo} />
                                                <AvatarFallback><UserIcon className="h-6 w-6" /></AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-1">
                                                    <h3 className="font-semibold text-sm">{artist.stage_name}</h3>
                                                    {artist.is_verified && <Star className="h-3 w-3 fill-primary text-primary" />}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{artist.name}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col gap-1 mr-4">
                                                    <Button 
                                                        variant="outline" 
                                                        size="icon" 
                                                        className="h-7 w-7"
                                                        onClick={() => moveArtist(index, 'up')}
                                                        disabled={index === 0}
                                                    >
                                                        <span className="sr-only">Up</span>
                                                        ↑
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="icon" 
                                                        className="h-7 w-7"
                                                        onClick={() => moveArtist(index, 'down')}
                                                        disabled={index === featuredArtists.length - 1}
                                                    >
                                                        <span className="sr-only">Down</span>
                                                        ↓
                                                    </Button>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleRemove(artist.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="p-4 rounded-lg border border-primary/10 bg-primary/5">
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            <strong className="text-primary font-bold">{t('Note')}:</strong> {t('These artists will be displayed in the "Featured artists" section of the homepage in the specified order.')}
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
