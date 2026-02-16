import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Play, Heart, MoreVertical, Share2, Globe, Lock, Music, Clock, Trash2, ChevronLeft } from 'lucide-react';
import { useAudio, type Track as AudioTrack } from '@/contexts/AudioContext';
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
    file_url: string;
    album: Album;
}

interface Playlist {
    id: number;
    title: string;
    cover_url: string | null;
    is_public: boolean;
    tracks_count: number;
}

interface PlaylistViewProps {
    playlist: Playlist;
    tracks: Track[];
}

export default function PlaylistView({ playlist, tracks }: PlaylistViewProps) {
    const { setQueue, playTrack, currentTrack, isPlaying } = useAudio();
    const [removingTrackId, setRemovingTrackId] = useState<number | null>(null);

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
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

    const convertToAudioTrack = (track: Track): AudioTrack => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.album.artist.stage_name,
        image: track.album.cover_url,
        url: track.file_url,
        duration: track.duration_seconds,
        album: track.album.title,
    });

    const handlePlayAll = () => {
        if (tracks.length === 0) return;

        const audioTracks = tracks.map(convertToAudioTrack);
        setQueue(audioTracks, 0, true);
        router.visit('/artstream/player');
    };

    const handlePlayTrack = (track: Track, index: number) => {
        const audioTracks = tracks.map(convertToAudioTrack);
        setQueue(audioTracks, index, true);
        router.visit('/artstream/player');
    };

    const handleRemoveTrack = (trackId: number) => {
        setRemovingTrackId(trackId);

        router.delete(`/playlists/${playlist.id}/tracks/${trackId}`, {
            preserveScroll: true,
            onFinish: () => setRemovingTrackId(null),
        });
    };

    const getDefaultCover = () => {
        return 'bg-gradient-to-br from-purple-500 to-pink-500';
    };

    const isCurrentTrack = (trackId: number) => {
        return currentTrack && currentTrack.id === trackId.toString();
    };

    return (
        <MainLayout>
            <Head title={`${playlist.title} - Playlist`} />

            <div className="pb-24 md:pb-6">
                {/* Header */}
                <div className="bg-gradient-to-b from-primary/20 to-background border-b border-border/40">
                    <div className="container max-w-7xl mx-auto px-4 py-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="mb-4 gap-2"
                        >
                            <Link href="/playlists">
                                <ChevronLeft className="w-4 h-4" />
                                Retour aux playlists
                            </Link>
                        </Button>

                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                            {/* Cover */}
                            <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden shadow-2xl mx-auto md:mx-0 shrink-0">
                                {playlist.cover_url ? (
                                    <img
                                        src={playlist.cover_url}
                                        alt={playlist.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className={`w-full h-full ${getDefaultCover()} flex items-center justify-center`}>
                                        <Music className="w-20 h-20 text-white/80" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <Badge variant="outline" className="gap-1">
                                    {playlist.is_public ? (
                                        <>
                                            <Globe className="w-3 h-3" />
                                            Playlist publique
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-3 h-3" />
                                            Playlist privée
                                        </>
                                    )}
                                </Badge>

                                <h1 className="text-3xl md:text-5xl font-black font-heading text-foreground">
                                    {playlist.title}
                                </h1>

                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground justify-center md:justify-start">
                                    <span>{playlist.tracks_count} titre{playlist.tracks_count !== 1 ? 's' : ''}</span>
                                    {tracks.length > 0 && (
                                        <>
                                            <span>•</span>
                                            <span>{getTotalDuration()}</span>
                                        </>
                                    )}
                                </div>

                                <div className="flex gap-3 justify-center md:justify-start pt-2">
                                    <Button
                                        size="lg"
                                        onClick={handlePlayAll}
                                        disabled={tracks.length === 0}
                                        className="rounded-full gap-2"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        Lire
                                    </Button>
                                    <Button size="lg" variant="outline" className="rounded-full gap-2">
                                        <Heart className="w-5 h-5" />
                                    </Button>
                                    <Button size="lg" variant="outline" className="rounded-full gap-2">
                                        <Share2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tracks List */}
                <section className="py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        {tracks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                                    <Music className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Playlist vide</h2>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    Cette playlist ne contient aucun morceau. Parcourez ArtStream pour ajouter des titres.
                                </p>
                                <Button asChild>
                                    <Link href="/artstream">
                                        Parcourir ArtStream
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {tracks.map((track, index) => (
                                    <div
                                        key={track.id}
                                        className={cn(
                                            'group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors',
                                            isCurrentTrack(track.id) && 'bg-muted/70',
                                            removingTrackId === track.id && 'opacity-50'
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
                                            {track.album.title}
                                        </div>

                                        {/* Duration */}
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDuration(track.duration_seconds)}</span>
                                        </div>

                                        {/* Actions */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handlePlayTrack(track, index)}>
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Lire
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Heart className="w-4 h-4 mr-2" />
                                                    J'aime
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/artstream/album/${track.album.id}`}>
                                                        Voir l'album
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleRemoveTrack(track.id)}
                                                    disabled={removingTrackId === track.id}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Retirer de la playlist
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
