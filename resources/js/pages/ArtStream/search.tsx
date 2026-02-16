import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Heart, Clock, TrendingUp, Music, Disc, User, X } from 'lucide-react';
import { useAudio, type Track as AudioTrack } from '@/contexts/AudioContext';
import { cn } from '@/lib/utils';
import AddToPlaylistDialog from '@/components/Player/AddToPlaylistDialog';

interface Artist {
    id: number;
    stage_name: string;
}

interface Album {
    id: number;
    title: string;
    cover_url: string;
    artist: Artist;
}

interface Track {
    id: number;
    title: string;
    duration_seconds: number;
    plays: number;
    file_url: string;
    is_favorited?: boolean;
    album: Album;
}

interface SearchAlbum {
    id: number;
    title: string;
    cover_url: string;
    genre: string;
    year: number;
    total_plays: number;
    tracks_count: number;
    artist: Artist;
}

interface SearchArtist {
    id: number;
    name: string;
    stage_name: string;
    profile_photo: string;
    bio: string | null;
    albums_count: number;
}

interface SearchProps {
    tracks: Track[];
    albums: SearchAlbum[];
    artists: SearchArtist[];
    query: string;
}

export default function SearchPage({ tracks, albums, artists, query: initialQuery }: SearchProps) {
    const [searchQuery, setSearchQuery] = useState(initialQuery || '');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const { setQueue, playTrack, currentTrack, isPlaying } = useAudio();

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('artstream_recent_searches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load recent searches');
            }
        }
    }, []);

    // Save search to recent searches
    const saveRecentSearch = (query: string) => {
        if (!query || query.length < 2) return;

        const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('artstream_recent_searches', JSON.stringify(updated));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim().length < 2) return;

        saveRecentSearch(searchQuery.trim());
        router.get('/artstream/search', { q: searchQuery.trim() }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleRecentSearchClick = (query: string) => {
        setSearchQuery(query);
        router.get('/artstream/search', { q: query });
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('artstream_recent_searches');
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatPlays = (plays: number) => {
        if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
        if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`;
        return plays.toString();
    };

    const convertToAudioTrack = (track: Track): AudioTrack => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.album.artist.stage_name,
        image: track.album.cover_url,
        url: track.file_url,
        duration: track.duration_seconds,
        album: track.album.title,
        is_favorited: track.is_favorited,
    });

    const handlePlayTrack = (track: Track, index: number, allTracks: Track[]) => {
        const audioTracks = allTracks.map(convertToAudioTrack);
        setQueue(audioTracks, index, true);
        router.visit('/artstream/player');
    };

    const isCurrentTrack = (trackId: number) => {
        return currentTrack && currentTrack.id === trackId.toString();
    };

    const hasResults = tracks.length > 0 || albums.length > 0 || artists.length > 0;
    const totalResults = tracks.length + albums.length + artists.length;

    return (
        <MainLayout>
            <Head title={`Recherche${initialQuery ? `: ${initialQuery}` : ''} - ArtStream`} />

            <div className="pb-24 md:pb-6">
                {/* Search Header */}
                <div className="bg-gradient-to-b from-primary/10 to-background border-b border-border/40 px-4 py-8 md:py-12">
                    <div className="container max-w-7xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-black font-heading text-foreground mb-6">
                            Recherche
                        </h1>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="relative max-w-2xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Rechercher des titres, albums ou artistes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-4 h-12 text-base"
                                autoFocus
                            />
                        </form>

                        {/* Recent Searches */}
                        {!initialQuery && recentSearches.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-muted-foreground">Recherches récentes</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearRecentSearches}
                                        className="h-7 text-xs"
                                    >
                                        Effacer
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((search, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRecentSearchClick(search)}
                                            className="rounded-full"
                                        >
                                            <Search className="w-3 h-3 mr-1" />
                                            {search}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results */}
                <section className="py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        {!initialQuery ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                                    <Search className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Recherchez votre musique</h2>
                                <p className="text-muted-foreground">
                                    Trouvez vos titres, albums et artistes préférés
                                </p>
                            </div>
                        ) : !hasResults ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                                    <Search className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Aucun résultat</h2>
                                <p className="text-muted-foreground mb-4">
                                    Aucun résultat pour "{initialQuery}"
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Essayez avec d'autres mots-clés
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <p className="text-sm text-muted-foreground">
                                        {totalResults} résultat{totalResults !== 1 ? 's' : ''} pour "{initialQuery}"
                                    </p>
                                </div>

                                <Tabs defaultValue="all" className="w-full">
                                    <TabsList className="mb-6">
                                        <TabsTrigger value="all">
                                            Tout ({totalResults})
                                        </TabsTrigger>
                                        <TabsTrigger value="tracks">
                                            <Music className="w-4 h-4 mr-2" />
                                            Titres ({tracks.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="albums">
                                            <Disc className="w-4 h-4 mr-2" />
                                            Albums ({albums.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="artists">
                                            <User className="w-4 h-4 mr-2" />
                                            Artistes ({artists.length})
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* All Results Tab */}
                                    <TabsContent value="all" className="mt-0 space-y-8">
                                        {/* Top Tracks */}
                                        {tracks.length > 0 && (
                                            <div>
                                                <h3 className="text-xl font-bold mb-4">Meilleurs titres</h3>
                                                <div className="space-y-1">
                                                    {tracks.slice(0, 5).map((track, index) => (
                                                        <TrackItem
                                                            key={track.id}
                                                            track={track}
                                                            index={index}
                                                            allTracks={tracks}
                                                            isCurrentTrack={isCurrentTrack(track.id)}
                                                            isPlaying={isPlaying}
                                                            onPlay={handlePlayTrack}
                                                            formatDuration={formatDuration}
                                                            formatPlays={formatPlays}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Albums */}
                                        {albums.length > 0 && (
                                            <div>
                                                <h3 className="text-xl font-bold mb-4">Albums</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                                    {albums.slice(0, 6).map((album) => (
                                                        <AlbumCard key={album.id} album={album} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Artists */}
                                        {artists.length > 0 && (
                                            <div>
                                                <h3 className="text-xl font-bold mb-4">Artistes</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                                    {artists.slice(0, 6).map((artist) => (
                                                        <ArtistCard key={artist.id} artist={artist} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Tracks Tab */}
                                    <TabsContent value="tracks" className="mt-0">
                                        {tracks.length === 0 ? (
                                            <p className="text-center text-muted-foreground py-8">Aucun titre trouvé</p>
                                        ) : (
                                            <div className="space-y-1">
                                                {tracks.map((track, index) => (
                                                    <TrackItem
                                                        key={track.id}
                                                        track={track}
                                                        index={index}
                                                        allTracks={tracks}
                                                        isCurrentTrack={isCurrentTrack(track.id)}
                                                        isPlaying={isPlaying}
                                                        onPlay={handlePlayTrack}
                                                        formatDuration={formatDuration}
                                                        formatPlays={formatPlays}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Albums Tab */}
                                    <TabsContent value="albums" className="mt-0">
                                        {albums.length === 0 ? (
                                            <p className="text-center text-muted-foreground py-8">Aucun album trouvé</p>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                                {albums.map((album) => (
                                                    <AlbumCard key={album.id} album={album} />
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Artists Tab */}
                                    <TabsContent value="artists" className="mt-0">
                                        {artists.length === 0 ? (
                                            <p className="text-center text-muted-foreground py-8">Aucun artiste trouvé</p>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                                {artists.map((artist) => (
                                                    <ArtistCard key={artist.id} artist={artist} />
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}

// Track Item Component
function TrackItem({ track, index, allTracks, isCurrentTrack, isPlaying, onPlay, formatDuration, formatPlays }: any) {
    return (
        <div
            className={cn(
                'group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors',
                isCurrentTrack && 'bg-muted/70'
            )}
        >
            <div className="w-8 flex justify-center">
                {isCurrentTrack && isPlaying ? (
                    <div className="flex gap-0.5 items-center">
                        <span className="w-0.5 h-3 bg-primary animate-pulse" />
                        <span className="w-0.5 h-4 bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
                        <span className="w-0.5 h-3 bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                ) : (
                    <>
                        <span className={cn('group-hover:hidden', isCurrentTrack ? 'text-primary font-bold' : 'text-muted-foreground')}>
                            {index + 1}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hidden group-hover:flex"
                            onClick={() => onPlay(track, index, allTracks)}
                        >
                            <Play className="w-4 h-4 fill-current" />
                        </Button>
                    </>
                )}
            </div>

            <img
                src={track.album.cover_url}
                alt={track.album.title}
                className="w-12 h-12 rounded object-cover cursor-pointer"
                onClick={() => onPlay(track, index, allTracks)}
            />
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onPlay(track, index, allTracks)}>
                <h4 className={cn('font-semibold truncate', isCurrentTrack ? 'text-primary' : 'text-foreground')}>
                    {track.title}
                </h4>
                <p className="text-sm text-muted-foreground truncate">
                    {track.album.artist.stage_name}
                </p>
            </div>

            <div className="hidden md:block text-sm text-muted-foreground truncate max-w-xs">
                <Link href={`/artstream/album/${track.album.id}`} className="hover:text-foreground hover:underline">
                    {track.album.title}
                </Link>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>{formatPlays(track.plays)}</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(track.duration_seconds)}</span>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <AddToPlaylistDialog
                    trackId={track.id}
                    trackTitle={track.title}
                    trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Music className="w-4 h-4" />
                        </Button>
                    }
                />
            </div>
        </div>
    );
}

// Album Card Component
function AlbumCard({ album }: { album: SearchAlbum }) {
    return (
        <Link href={`/artstream/album/${album.id}`} className="group space-y-3">
            <div className="aspect-square rounded-lg overflow-hidden relative bg-muted">
                <img
                    src={album.cover_url}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                        size="icon"
                        className="rounded-full bg-primary hover:bg-primary/90"
                    >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                    </Button>
                </div>
            </div>
            <div>
                <h3 className="font-semibold truncate text-sm">{album.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{album.artist.stage_name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs capitalize">{album.genre}</Badge>
                    <span className="text-xs text-muted-foreground">{album.year}</span>
                </div>
            </div>
        </Link>
    );
}

// Artist Card Component
function ArtistCard({ artist }: { artist: SearchArtist }) {
    return (
        <Link href={`/artists/${artist.id}`} className="group space-y-3">
            <div className="aspect-square rounded-full overflow-hidden relative bg-muted">
                <img
                    src={artist.profile_photo || '/default-avatar.png'}
                    alt={artist.stage_name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                />
            </div>
            <div className="text-center">
                <h3 className="font-semibold truncate">{artist.stage_name}</h3>
                <p className="text-xs text-muted-foreground">
                    {artist.albums_count} album{artist.albums_count !== 1 ? 's' : ''}
                </p>
            </div>
        </Link>
    );
}
