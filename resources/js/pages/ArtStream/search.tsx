import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Play,
    Heart,
    Clock,
    TrendingUp,
    Music,
    Disc,
    User,
    X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import AddToPlaylistDialog from '@/components/Player/AddToPlaylistDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAudio, type Track as AudioTrack } from '@/contexts/AudioContext';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';
import { cn } from '@/lib/utils';

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

export default function SearchPage({
    tracks,
    albums,
    artists,
    query: initialQuery,
}: SearchProps) {
    const { t } = useAppLocale();
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

        const updated = [
            query,
            ...recentSearches.filter((q) => q !== query),
        ].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem(
            'artstream_recent_searches',
            JSON.stringify(updated),
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim().length < 2) return;

        saveRecentSearch(searchQuery.trim());
        router.get(
            '/artstream/search',
            { q: searchQuery.trim() },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
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

    const handlePlayTrack = (
        track: Track,
        index: number,
        allTracks: Track[],
    ) => {
        const audioTracks = allTracks.map(convertToAudioTrack);
        setQueue(audioTracks, index, true);
        router.visit('/artstream/player');
    };

    const isCurrentTrack = (trackId: number) => {
        return currentTrack && currentTrack.id === trackId.toString();
    };

    const hasResults =
        tracks.length > 0 || albums.length > 0 || artists.length > 0;
    const totalResults = tracks.length + albums.length + artists.length;

    return (
        <MainLayout>
            <Head
                title={`${t('Search')}${initialQuery ? `: ${initialQuery}` : ''} - ArtStream`}
            />

            <div className="pb-24 md:pb-6">
                {/* Search Header */}
                <div className="border-b border-border/40 bg-gradient-to-b from-primary/10 to-background px-4 py-8 md:py-12">
                    <div className="container mx-auto max-w-7xl">
                        <h1 className="font-heading mb-6 text-3xl font-black text-foreground md:text-4xl">
                            {t('Search')}
                        </h1>

                        {/* Search Form */}
                        <form
                            onSubmit={handleSearch}
                            className="relative max-w-2xl"
                        >
                            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={t(
                                    'Search for tracks, albums, or artists...',
                                )}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-12 pr-4 pl-12 text-base"
                                autoFocus
                            />
                        </form>

                        {/* Recent Searches */}
                        {!initialQuery && recentSearches.length > 0 && (
                            <div className="mt-6">
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-muted-foreground">
                                        {t('Recent searches')}
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearRecentSearches}
                                        className="h-7 text-xs"
                                    >
                                        {t('Clear')}
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((search, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleRecentSearchClick(search)
                                            }
                                            className="rounded-full"
                                        >
                                            <Search className="mr-1 h-3 w-3" />
                                            {search}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results */}
                <section className="px-4 py-8">
                    <div className="container mx-auto max-w-7xl">
                        {!initialQuery ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                                    <Search className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <h2 className="mb-2 text-2xl font-bold">
                                    {t('Search your music')}
                                </h2>
                                <p className="text-muted-foreground">
                                    {t(
                                        'Find your favorite tracks, albums, and artists',
                                    )}
                                </p>
                            </div>
                        ) : !hasResults ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                                    <Search className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <h2 className="mb-2 text-2xl font-bold">
                                    {t('No results')}
                                </h2>
                                <p className="mb-4 text-muted-foreground">
                                    {t('No results for')} "{initialQuery}"
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('Try different keywords')}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <p className="text-sm text-muted-foreground">
                                        {totalResults}{' '}
                                        {totalResults !== 1
                                            ? t('results')
                                            : t('result')}{' '}
                                        {t('for')} "{initialQuery}"
                                    </p>
                                </div>

                                <Tabs defaultValue="all" className="w-full">
                                    <TabsList className="mb-6">
                                        <TabsTrigger value="all">
                                            {t('All')} ({totalResults})
                                        </TabsTrigger>
                                        <TabsTrigger value="tracks">
                                            <Music className="mr-2 h-4 w-4" />
                                            {t('Tracks')} ({tracks.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="albums">
                                            <Disc className="mr-2 h-4 w-4" />
                                            {t('Albums')} ({albums.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="artists">
                                            <User className="mr-2 h-4 w-4" />
                                            {t('Artists')} ({artists.length})
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* All Results Tab */}
                                    <TabsContent
                                        value="all"
                                        className="mt-0 space-y-8"
                                    >
                                        {/* Top Tracks */}
                                        {tracks.length > 0 && (
                                            <div>
                                                <h3 className="mb-4 text-xl font-bold">
                                                    {t('Top tracks')}
                                                </h3>
                                                <div className="space-y-1">
                                                    {tracks
                                                        .slice(0, 5)
                                                        .map((track, index) => (
                                                            <TrackItem
                                                                key={track.id}
                                                                track={track}
                                                                index={index}
                                                                allTracks={
                                                                    tracks
                                                                }
                                                                isCurrentTrack={isCurrentTrack(
                                                                    track.id,
                                                                )}
                                                                isPlaying={
                                                                    isPlaying
                                                                }
                                                                onPlay={
                                                                    handlePlayTrack
                                                                }
                                                                formatDuration={
                                                                    formatDuration
                                                                }
                                                                formatPlays={
                                                                    formatPlays
                                                                }
                                                            />
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Albums */}
                                        {albums.length > 0 && (
                                            <div>
                                                <h3 className="mb-4 text-xl font-bold">
                                                    {t('Albums')}
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                                                    {albums
                                                        .slice(0, 6)
                                                        .map((album) => (
                                                            <AlbumCard
                                                                key={album.id}
                                                                album={album}
                                                            />
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Artists */}
                                        {artists.length > 0 && (
                                            <div>
                                                <h3 className="mb-4 text-xl font-bold">
                                                    {t('Artists')}
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                                                    {artists
                                                        .slice(0, 6)
                                                        .map((artist) => (
                                                            <ArtistCard
                                                                key={artist.id}
                                                                artist={artist}
                                                            />
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Tracks Tab */}
                                    <TabsContent
                                        value="tracks"
                                        className="mt-0"
                                    >
                                        {tracks.length === 0 ? (
                                            <p className="py-8 text-center text-muted-foreground">
                                                {t('No tracks found')}
                                            </p>
                                        ) : (
                                            <div className="space-y-1">
                                                {tracks.map((track, index) => (
                                                    <TrackItem
                                                        key={track.id}
                                                        track={track}
                                                        index={index}
                                                        allTracks={tracks}
                                                        isCurrentTrack={isCurrentTrack(
                                                            track.id,
                                                        )}
                                                        isPlaying={isPlaying}
                                                        onPlay={handlePlayTrack}
                                                        formatDuration={
                                                            formatDuration
                                                        }
                                                        formatPlays={
                                                            formatPlays
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Albums Tab */}
                                    <TabsContent
                                        value="albums"
                                        className="mt-0"
                                    >
                                        {albums.length === 0 ? (
                                            <p className="py-8 text-center text-muted-foreground">
                                                {t('No albums found')}
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                                                {albums.map((album) => (
                                                    <AlbumCard
                                                        key={album.id}
                                                        album={album}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Artists Tab */}
                                    <TabsContent
                                        value="artists"
                                        className="mt-0"
                                    >
                                        {artists.length === 0 ? (
                                            <p className="py-8 text-center text-muted-foreground">
                                                {t('No artists found')}
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                                                {artists.map((artist) => (
                                                    <ArtistCard
                                                        key={artist.id}
                                                        artist={artist}
                                                    />
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
function TrackItem({
    track,
    index,
    allTracks,
    isCurrentTrack,
    isPlaying,
    onPlay,
    formatDuration,
    formatPlays,
}: any) {
    return (
        <div
            className={cn(
                'group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50',
                isCurrentTrack && 'bg-muted/70',
            )}
        >
            <div className="flex w-8 justify-center">
                {isCurrentTrack && isPlaying ? (
                    <div className="flex items-center gap-0.5">
                        <span className="h-3 w-0.5 animate-pulse bg-primary" />
                        <span
                            className="h-4 w-0.5 animate-pulse bg-primary"
                            style={{ animationDelay: '150ms' }}
                        />
                        <span
                            className="h-3 w-0.5 animate-pulse bg-primary"
                            style={{ animationDelay: '300ms' }}
                        />
                    </div>
                ) : (
                    <>
                        <span
                            className={cn(
                                'group-hover:hidden',
                                isCurrentTrack
                                    ? 'font-bold text-primary'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {index + 1}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden h-8 w-8 group-hover:flex"
                            onClick={() => onPlay(track, index, allTracks)}
                        >
                            <Play className="h-4 w-4 fill-current" />
                        </Button>
                    </>
                )}
            </div>

            <img
                src={track.album.cover_url}
                alt={track.album.title}
                className="h-12 w-12 cursor-pointer rounded object-cover"
                onClick={() => onPlay(track, index, allTracks)}
            />
            <div
                className="min-w-0 flex-1 cursor-pointer"
                onClick={() => onPlay(track, index, allTracks)}
            >
                <h4
                    className={cn(
                        'truncate font-semibold',
                        isCurrentTrack ? 'text-primary' : 'text-foreground',
                    )}
                >
                    {track.title}
                </h4>
                <p className="truncate text-sm text-muted-foreground">
                    {track.album.artist.stage_name}
                </p>
            </div>

            <div className="hidden max-w-xs truncate text-sm text-muted-foreground md:block">
                <Link
                    href={`/artstream/album/${track.album.id}`}
                    className="hover:text-foreground hover:underline"
                >
                    {track.album.title}
                </Link>
            </div>

            <div className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
                <TrendingUp className="h-4 w-4" />
                <span>{formatPlays(track.plays)}</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(track.duration_seconds)}</span>
            </div>

            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <AddToPlaylistDialog
                    trackId={track.id}
                    trackTitle={track.title}
                    trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Music className="h-4 w-4" />
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
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                    src={album.cover_url}
                    alt={album.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                        size="icon"
                        className="rounded-full bg-primary hover:bg-primary/90"
                    >
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                    </Button>
                </div>
            </div>
            <div>
                <h3 className="truncate text-sm font-semibold">
                    {album.title}
                </h3>
                <p className="truncate text-xs text-muted-foreground">
                    {album.artist.stage_name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs capitalize">
                        {album.genre}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        {album.year}
                    </span>
                </div>
            </div>
        </Link>
    );
}

// Artist Card Component
function ArtistCard({ artist }: { artist: SearchArtist }) {
    return (
        <Link href={`/artists/${artist.id}`} className="group space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-full bg-muted">
                <img
                    src={artist.profile_photo || '/default-avatar.png'}
                    alt={artist.stage_name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="text-center">
                <h3 className="truncate font-semibold">{artist.stage_name}</h3>
                <p className="text-xs text-muted-foreground">
                    {artist.albums_count} album
                    {artist.albums_count !== 1 ? 's' : ''}
                </p>
            </div>
        </Link>
    );
}
