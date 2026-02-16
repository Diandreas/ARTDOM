import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Play, Heart, Clock, Music, Shuffle, TrendingUp } from 'lucide-react';
import { useAudio, type Track as AudioTrack } from '@/contexts/AudioContext';
import { cn } from '@/lib/utils';
import { toggle as toggleFavorite } from '@/actions/App/Http/Controllers/FavoriteController';
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
    album: Album;
}

interface FavoritesProps {
    tracks: Track[];
}

type SortOption = 'recent' | 'artist' | 'album' | 'title';

export default function Favorites({ tracks }: FavoritesProps) {
    const [sortBy, setSortBy] = useState<SortOption>('recent');
    const [unfavoritingId, setUnfavoritingId] = useState<number | null>(null);
    const { setQueue, playTrack, currentTrack, isPlaying } = useAudio();

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const formatPlays = (plays: number) => {
        if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
        if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`;
        return plays.toString();
    };

    const sortedTracks = useMemo(() => {
        const sorted = [...tracks];

        switch (sortBy) {
            case 'artist':
                return sorted.sort((a, b) =>
                    a.album.artist.stage_name.localeCompare(b.album.artist.stage_name)
                );
            case 'album':
                return sorted.sort((a, b) =>
                    a.album.title.localeCompare(b.album.title)
                );
            case 'title':
                return sorted.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );
            case 'recent':
            default:
                // Assuming tracks come in reverse chronological order by default
                return sorted;
        }
    }, [tracks, sortBy]);

    const convertToAudioTrack = (track: Track): AudioTrack => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.album.artist.stage_name,
        image: track.album.cover_url,
        url: track.file_url,
        duration: track.duration_seconds,
        album: track.album.title,
        is_favorited: true,
    });

    const handlePlayAll = () => {
        if (sortedTracks.length === 0) return;

        const audioTracks = sortedTracks.map(convertToAudioTrack);
        setQueue(audioTracks, 0, true);
        router.visit('/artstream/player');
    };

    const handlePlayTrack = (track: Track, index: number) => {
        const audioTracks = sortedTracks.map(convertToAudioTrack);
        setQueue(audioTracks, index, true);
        router.visit('/artstream/player');
    };

    const handleUnfavorite = (trackId: number) => {
        setUnfavoritingId(trackId);

        router.post(
            toggleFavorite.url({ track: trackId }),
            {},
            {
                preserveScroll: true,
                onFinish: () => setUnfavoritingId(null),
            }
        );
    };

    const isCurrentTrack = (trackId: number) => {
        return currentTrack && currentTrack.id === trackId.toString();
    };

    const getTotalDuration = () => {
        const total = tracks.reduce((acc, track) => acc + track.duration_seconds, 0);
        const hours = Math.floor(total / 3600);
        const minutes = Math.floor((total % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        }
        return `${minutes}min`;
    };

    return (
        <MainLayout>
            <Head title="Mes Favoris - ArtStream" />

            <div className="pb-24 md:pb-6">
                {/* Header */}
                <div className="bg-gradient-to-b from-rose-500/10 to-background border-b border-border/40 px-4 py-8 md:py-12">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                            {/* Icon */}
                            <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-2xl shrink-0">
                                <Heart className="w-24 h-24 md:w-28 md:h-28 text-white fill-current" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <Badge variant="outline" className="gap-1">
                                    <Music className="w-3 h-3" />
                                    Playlist
                                </Badge>

                                <h1 className="text-3xl md:text-5xl font-black font-heading text-foreground">
                                    Mes Favoris
                                </h1>

                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground justify-center md:justify-start">
                                    <span>{tracks.length} titre{tracks.length !== 1 ? 's' : ''}</span>
                                    {tracks.length > 0 && (
                                        <>
                                            <span>•</span>
                                            <span>{getTotalDuration()}</span>
                                        </>
                                    )}
                                </div>

                                {tracks.length > 0 && (
                                    <div className="flex gap-3 justify-center md:justify-start pt-2">
                                        <Button
                                            size="lg"
                                            onClick={handlePlayAll}
                                            className="rounded-full gap-2"
                                        >
                                            <Play className="w-5 h-5 fill-current" />
                                            Tout lire
                                        </Button>
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            onClick={() => {
                                                const audioTracks = sortedTracks.map(convertToAudioTrack);
                                                setQueue(audioTracks, 0, true);
                                                router.visit('/artstream/player');
                                            }}
                                            className="rounded-full gap-2"
                                        >
                                            <Shuffle className="w-5 h-5" />
                                            Aléatoire
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Bar */}
                {tracks.length > 0 && (
                    <div className="py-4 px-4 bg-muted/30 border-b border-border/40">
                        <div className="container max-w-7xl mx-auto flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Music className="w-4 h-4" />
                                <span>{sortedTracks.length} piste{sortedTracks.length !== 1 ? 's' : ''}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground hidden sm:inline">Trier par:</span>
                                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                                    <SelectTrigger className="w-[140px] h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recent">Récent</SelectItem>
                                        <SelectItem value="title">Titre</SelectItem>
                                        <SelectItem value="artist">Artiste</SelectItem>
                                        <SelectItem value="album">Album</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tracks List */}
                <section className="py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        {tracks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                                    <Heart className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Aucun favori</h2>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    Vous n'avez pas encore de morceaux favoris. Explorez ArtStream et ajoutez vos titres préférés !
                                </p>
                                <Button asChild>
                                    <Link href="/artstream">
                                        Parcourir ArtStream
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {sortedTracks.map((track, index) => (
                                    <div
                                        key={track.id}
                                        className={cn(
                                            'group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors',
                                            isCurrentTrack(track.id) && 'bg-muted/70',
                                            unfavoritingId === track.id && 'opacity-50'
                                        )}
                                    >
                                        {/* Number / Play Button */}
                                        <div className="w-8 flex justify-center">
                                            {isCurrentTrack(track.id) && isPlaying ? (
                                                <div className="flex gap-0.5 items-center">
                                                    <span className="w-0.5 h-3 bg-primary animate-pulse" style={{ animationDelay: '0ms' }} />
                                                    <span className="w-0.5 h-4 bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
                                                    <span className="w-0.5 h-3 bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
                                                </div>
                                            ) : (
                                                <>
                                                    <span className={cn(
                                                        'group-hover:hidden',
                                                        isCurrentTrack(track.id) ? 'text-primary font-bold' : 'text-muted-foreground'
                                                    )}>
                                                        {index + 1}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hidden group-hover:flex"
                                                        onClick={() => handlePlayTrack(track, index)}
                                                    >
                                                        <Play className="w-4 h-4 fill-current" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>

                                        {/* Cover & Info */}
                                        <img
                                            src={track.album.cover_url}
                                            alt={track.album.title}
                                            className="w-12 h-12 rounded object-cover cursor-pointer"
                                            onClick={() => handlePlayTrack(track, index)}
                                        />
                                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handlePlayTrack(track, index)}>
                                            <h4 className={cn(
                                                'font-semibold truncate',
                                                isCurrentTrack(track.id) ? 'text-primary' : 'text-foreground'
                                            )}>
                                                {track.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {track.album.artist.stage_name}
                                            </p>
                                        </div>

                                        {/* Album (desktop) */}
                                        <div className="hidden lg:block text-sm text-muted-foreground truncate max-w-xs">
                                            <Link
                                                href={`/artstream/album/${track.album.id}`}
                                                className="hover:text-foreground hover:underline"
                                            >
                                                {track.album.title}
                                            </Link>
                                        </div>

                                        {/* Plays (desktop) */}
                                        <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>{formatPlays(track.plays)}</span>
                                        </div>

                                        {/* Duration */}
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDuration(track.duration_seconds)}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-rose-500 hover:text-rose-600"
                                                onClick={() => handleUnfavorite(track.id)}
                                                disabled={unfavoritingId === track.id}
                                            >
                                                <Heart className="w-4 h-4 fill-current" />
                                            </Button>
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
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
