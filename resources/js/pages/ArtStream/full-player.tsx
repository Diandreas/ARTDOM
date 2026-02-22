
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, Heart, ListMusic, Share2, Volume2, VolumeX } from 'lucide-react';
import AddToPlaylistDialog from '@/components/Player/AddToPlaylistDialog';
import QueueSidebar from '@/components/Player/QueueSidebar';
import { useAudio, Track } from '@/contexts/AudioContext';
import { cn } from '@/lib/utils';
import { toggle as toggleFavorite } from '@/actions/App/Http/Controllers/FavoriteController';

interface FullPlayerProps {
    initialTrack?: Track;
    albumTracks?: Track[];
}

export default function FullPlayer({ initialTrack, albumTracks }: FullPlayerProps) {
    const { auth, toast: flashToast } = usePage().props as { auth?: { user?: any }; toast?: { type: string; message: string } };
    const [isFavorited, setIsFavorited] = useState(false);
    const [localProgress, setLocalProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const hasLoadedInitialTrack = useRef(false);

    const {
        currentTrack,
        isPlaying,
        togglePlay,
        progress,
        duration,
        seek,
        next,
        previous,
        repeatMode,
        toggleRepeat,
        isShuffled,
        toggleShuffle,
        volume,
        setVolume,
        isMuted,
        toggleMute,
        playTrack,
        setQueue,
    } = useAudio();

    // Sync local progress with audio progress when not dragging
    useEffect(() => {
        if (!isDragging) {
            setLocalProgress(progress);
        }
    }, [progress, isDragging]);

    // Display toast from flash messages
    useEffect(() => {
        if (flashToast) {
            if (flashToast.type === 'success') {
                toast.success(flashToast.message);
            } else if (flashToast.type === 'error') {
                toast.error(flashToast.message);
            } else {
                toast(flashToast.message);
            }
        }
    }, [flashToast]);

    // Load initial track from URL parameters without autoplay (only once)
    useEffect(() => {
        if (initialTrack && !currentTrack && !hasLoadedInitialTrack.current) {
            if (albumTracks && albumTracks.length > 0) {
                const trackIndex = albumTracks.findIndex(t => t.id === initialTrack.id);
                // Load queue without autoplay (false parameter)
                setQueue(albumTracks, trackIndex, false);
                hasLoadedInitialTrack.current = true;
            }
        }
    }, [initialTrack, albumTracks, currentTrack, setQueue]);

    // Update favorite status when track changes
    useEffect(() => {
        const track = currentTrack || initialTrack;
        if (track) {
            setIsFavorited(track.is_favorited || false);
        }
    }, [currentTrack, initialTrack]);

    const handleToggleFavorite = () => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        const track = currentTrack || initialTrack;
        if (!track) return;

        // Optimistically update UI
        const newState = !isFavorited;
        setIsFavorited(newState);

        router.post(
            toggleFavorite.url({ track: track.id }),
            {},
            {
                preserveScroll: true,
                onError: () => {
                    // Revert on error
                    setIsFavorited(!newState);
                },
            }
        );
    };

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleProgressChange = (value: number[]) => {
        setLocalProgress(value[0]);
        setIsDragging(true);
    };

    const handleProgressCommit = (value: number[]) => {
        const targetTime = value[0];
        setLocalProgress(targetTime);
        seek(targetTime);
        setIsDragging(false);
    };

    const handleVolumeChange = (value: number[]) => {
        setVolume(value[0] / 100);
    };

    // Show empty state only if there's no current track AND no initial track
    if (!currentTrack && !initialTrack) {
        return (
            <div className="h-screen w-full bg-gradient-to-b from-primary/10 to-background flex flex-col items-center justify-center">
                <Head title="Lecteur - ArtStream" />
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Aucune musique en lecture</p>
                    <Link href="/artstream">
                        <Button>Parcourir ArtStream</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Use currentTrack or fallback to initialTrack
    const displayTrack = currentTrack || initialTrack;

    return (
        <div className="h-screen w-full bg-gradient-to-b from-primary/10 to-background flex flex-col">
            <Head title={`${displayTrack.title} - ${displayTrack.artist}`} />

            {/* Header */}
            <div className="p-4 flex justify-between items-center">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/artstream">
                        <ChevronDown className="w-6 h-6" />
                    </Link>
                </Button>
                <div className="text-center">
                    <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Lecture en cours</span>
                    <p className="text-sm font-semibold">{displayTrack.album || 'Album'}</p>
                </div>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-6 h-6" />
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto w-full">
                {/* Album Art */}
                <div className="w-full aspect-square bg-muted rounded-2xl shadow-2xl mb-8 overflow-hidden relative group">
                    <img
                        src={displayTrack.image || 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop'}
                        alt={displayTrack.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Track Info */}
                <div className="w-full flex justify-between items-center mb-2">
                    <div className="overflow-hidden">
                        <h1 className="text-2xl font-bold font-heading truncate">{displayTrack.title}</h1>
                        <p className="text-lg text-muted-foreground truncate">{displayTrack.artist}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleFavorite}
                        className={cn(
                            isFavorited ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                        )}
                    >
                        <Heart className={cn('w-6 h-6', isFavorited && 'fill-current')} />
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="w-full space-y-2 mb-8">
                    <Slider
                        value={[localProgress]}
                        max={duration || 100}
                        step={1}
                        onValueChange={handleProgressChange}
                        onValueCommit={handleProgressCommit}
                        className="w-full cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground font-medium">
                        <span>{formatTime(localProgress)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="w-full flex justify-between items-center mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleShuffle}
                        className={cn(
                            'text-muted-foreground hover:text-primary',
                            isShuffled && 'text-primary'
                        )}
                    >
                        <Shuffle className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-12 w-12" onClick={previous}>
                        <SkipBack className="w-8 h-8 fill-current" />
                    </Button>
                    <Button
                        size="icon"
                        className="h-16 w-16 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={togglePlay}
                    >
                        {isPlaying ? (
                            <Pause className="w-8 h-8 fill-current" />
                        ) : (
                            <Play className="w-8 h-8 fill-current ml-1" />
                        )}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-12 w-12" onClick={next}>
                        <SkipForward className="w-8 h-8 fill-current" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleRepeat}
                        className={cn(
                            'text-muted-foreground hover:text-primary',
                            repeatMode !== 'off' && 'text-primary'
                        )}
                    >
                        {repeatMode === 'one' ? (
                            <Repeat1 className="w-5 h-5" />
                        ) : (
                            <Repeat className="w-5 h-5" />
                        )}
                    </Button>
                </div>

                {/* Secondary Controls */}
                <div className="w-full flex justify-between items-center px-4">
                    <div className="flex items-center gap-2 flex-1">
                        <Button variant="ghost" size="icon" onClick={toggleMute} className="text-muted-foreground">
                            {isMuted ? (
                                <VolumeX className="w-5 h-5" />
                            ) : (
                                <Volume2 className="w-5 h-5" />
                            )}
                        </Button>
                        <Slider
                            value={[isMuted ? 0 : volume * 100]}
                            max={100}
                            step={1}
                            onValueChange={handleVolumeChange}
                            className="w-24 cursor-pointer"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Share2 className="w-5 h-5" />
                    </Button>
                    {displayTrack && (
                        <AddToPlaylistDialog
                            trackId={parseInt(displayTrack.id)}
                            trackTitle={displayTrack.title}
                            trigger={
                                <Button variant="ghost" size="icon" className="text-muted-foreground">
                                    <ListMusic className="w-5 h-5" />
                                </Button>
                            }
                        />
                    )}
                    <QueueSidebar />
                </div>
            </div>
        </div>
    );
}

function MoreHorizontal({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
    )
}
