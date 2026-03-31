import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Repeat,
    Repeat1,
    Shuffle,
    Heart,
    ListMusic,
    Share2,
    Volume2,
    VolumeX,
    MessageCircle,
} from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { toggle as toggleFavorite } from '@/actions/App/Http/Controllers/FavoriteController';
import AddToPlaylistDialog from '@/components/Player/AddToPlaylistDialog';
import CommentsSidebar from '@/components/Player/CommentsSidebar';
import QueueSidebar from '@/components/Player/QueueSidebar';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { Track } from '@/contexts/AudioContext';
import { useAudio } from '@/contexts/AudioContext';
import { useAppLocale } from '@/hooks/use-app-locale';
import { cn } from '@/lib/utils';

interface FullPlayerProps {
    initialTrack?: Track & { comments?: any[] };
    albumTracks?: Track[];
}

export default function FullPlayer({
    initialTrack,
    albumTracks,
}: FullPlayerProps) {
    const { auth, toast: flashToast } = usePage().props as {
        auth?: { user?: any };
        toast?: { type: string; message: string };
    };
    const { t } = useAppLocale();
    const [isFavorited, setIsFavorited] = useState(false);
    const [localProgress, setLocalProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [freqBars, setFreqBars] = useState<number[]>(Array(28).fill(4));
    const hasLoadedInitialTrack = useRef(false);
    const webAudioCtxRef = useRef<globalThis.AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const animFrameRef = useRef<number>(0);

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
        audioRef,
    } = useAudio();

    // Web Audio analyser setup
    const setupAnalyser = useCallback(() => {
        if (!audioRef.current) return;
        if (sourceRef.current) return; // already connected

        try {
            const ctx = new (
                window.AudioContext || (window as any).webkitAudioContext
            )();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            const source = ctx.createMediaElementSource(audioRef.current);
            source.connect(analyser);
            analyser.connect(ctx.destination);
            webAudioCtxRef.current = ctx;
            analyserRef.current = analyser;
            sourceRef.current = source;
        } catch (e) {
            // CORS or browser restriction — fall back to CSS animation
        }
    }, [audioRef]);

    // Animation loop
    useEffect(() => {
        if (!isPlaying) {
            cancelAnimationFrame(animFrameRef.current);
            setFreqBars(Array(28).fill(4));
            return;
        }

        setupAnalyser();

        const draw = () => {
            if (!analyserRef.current) {
                // Fallback: random bars when analyser unavailable
                setFreqBars(
                    Array(28)
                        .fill(0)
                        .map(() => 15 + Math.random() * 85),
                );
                animFrameRef.current = requestAnimationFrame(draw);
                return;
            }
            const data = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(data);
            // Map 32 frequency bins → 28 bars
            const bars = Array(28)
                .fill(0)
                .map((_, i) => {
                    const binIndex = Math.floor((i * data.length) / 28);
                    return Math.max(4, (data[binIndex] / 255) * 100);
                });
            setFreqBars(bars);
            animFrameRef.current = requestAnimationFrame(draw);
        };

        animFrameRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [isPlaying, setupAnalyser]);

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
                const trackIndex = albumTracks.findIndex(
                    (t) => t.id === initialTrack.id,
                );
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
            },
        );
    };

    const handleShare = async () => {
        const track = currentTrack || initialTrack;
        const shareUrl = window.location.href;
        const shareTitle = track
            ? `${track.title} — ${track.artist}`
            : 'ARTEMO';

        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, url: shareUrl });
            } catch {
                // User cancelled share, do nothing
            }
        } else {
            await navigator.clipboard.writeText(shareUrl);
            toast.success(t('Link copied to clipboard'));
        }
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
            <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background">
                <Head title={t('Player - ArtStream')} />
                <div className="text-center">
                    <p className="mb-4 text-muted-foreground">
                        {t('No music playing')}
                    </p>
                    <Link href="/artstream">
                        <Button>{t('Browse ArtStream')}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Use currentTrack or fallback to initialTrack
    const displayTrack = currentTrack || initialTrack;

    return (
        <div className="flex h-screen w-full flex-col bg-gradient-to-b from-primary/10 to-background">
            <Head
                title={`${displayTrack?.title ?? 'ArtStream'} - ${displayTrack?.artist ?? 'ARTEMO'}`}
            />

            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.history.back()}
                >
                    <ChevronDown className="h-6 w-6" />
                </Button>
                <div className="text-center">
                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                        {t('Now playing')}
                    </span>
                    <p className="text-sm font-semibold">
                        {displayTrack?.album || t('Album')}
                    </p>
                </div>
                <div className="w-10" />
            </div>

            {/* Main Content */}
            <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center p-8">
                {/* Album Art */}
                <div className="group relative mb-8 aspect-square w-full overflow-hidden rounded-2xl bg-muted shadow-2xl">
                    <img
                        src={
                            displayTrack?.image ||
                            'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop'
                        }
                        alt={displayTrack?.title || t('Album cover')}
                        className={cn(
                            'h-full w-full object-cover transition-transform duration-700',
                            isPlaying && 'scale-105',
                        )}
                    />
                    {/* Visualizer overlay — real frequency data */}
                    <div className="absolute right-0 bottom-0 left-0 z-10 flex h-16 items-end justify-center gap-[3px] px-4 pb-3">
                        {freqBars.map((height, i) => (
                            <div
                                key={i}
                                className="w-1 rounded-full transition-all duration-75"
                                style={{
                                    height: `${height}%`,
                                    background: isPlaying
                                        ? `rgba(255,255,255,${0.4 + (height / 100) * 0.6})`
                                        : 'rgba(255,255,255,0.2)',
                                }}
                            />
                        ))}
                    </div>
                    {/* Gradient overlay for visualizer readability */}
                    <div className="absolute right-0 bottom-0 left-0 h-20 rounded-b-2xl bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Comments Ticker */}
                {displayTrack.comments && displayTrack.comments.length > 0 && (
                    <CommentsTicker comments={displayTrack.comments} />
                )}

                {/* Track Info */}
                <div className="mb-2 flex w-full items-center justify-between">
                    <div className="overflow-hidden">
                        <h1 className="font-heading truncate text-2xl font-bold">
                            {displayTrack?.title}
                        </h1>
                        <p className="truncate text-lg text-muted-foreground">
                            {displayTrack?.artist}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleFavorite}
                        className={cn(
                            isFavorited
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-primary',
                        )}
                    >
                        <Heart
                            className={cn(
                                'h-6 w-6',
                                isFavorited && 'fill-current',
                            )}
                        />
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 w-full space-y-2">
                    <Slider
                        value={[localProgress]}
                        max={duration || 100}
                        step={1}
                        onValueChange={handleProgressChange}
                        onValueCommit={handleProgressCommit}
                        className="w-full cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span>{formatTime(localProgress)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="mb-8 flex w-full items-center justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleShuffle}
                        className={cn(
                            'text-muted-foreground hover:text-primary',
                            isShuffled && 'text-primary',
                        )}
                    >
                        <Shuffle className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12"
                        onClick={previous}
                    >
                        <SkipBack className="h-8 w-8 fill-current" />
                    </Button>
                    <Button
                        size="icon"
                        className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90"
                        onClick={togglePlay}
                    >
                        {isPlaying ? (
                            <Pause className="h-8 w-8 fill-current" />
                        ) : (
                            <Play className="ml-1 h-8 w-8 fill-current" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12"
                        onClick={next}
                    >
                        <SkipForward className="h-8 w-8 fill-current" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleRepeat}
                        className={cn(
                            'text-muted-foreground hover:text-primary',
                            repeatMode !== 'off' && 'text-primary',
                        )}
                    >
                        {repeatMode === 'one' ? (
                            <Repeat1 className="h-5 w-5" />
                        ) : (
                            <Repeat className="h-5 w-5" />
                        )}
                    </Button>
                </div>

                {/* Secondary Controls */}
                <div className="flex w-full items-center justify-between px-4">
                    <div className="flex flex-1 items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMute}
                            className="text-muted-foreground"
                        >
                            {isMuted ? (
                                <VolumeX className="h-5 w-5" />
                            ) : (
                                <Volume2 className="h-5 w-5" />
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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                        onClick={handleShare}
                    >
                        <Share2 className="h-5 w-5" />
                    </Button>
                    {displayTrack && (
                        <CommentsSidebar
                            trackId={displayTrack.id}
                            comments={displayTrack.comments || []}
                        />
                    )}
                    {displayTrack && (
                        <AddToPlaylistDialog
                            trackId={displayTrack.id}
                            trackTitle={displayTrack.title}
                            trigger={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground"
                                >
                                    <ListMusic className="h-5 w-5" />
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

function CommentsTicker({ comments }: { comments: any[] }) {
    const tickerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (comments.length === 0) return;
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % comments.length);
                setVisible(true);
            }, 400);
        }, 4000);
        return () => clearInterval(interval);
    }, [comments.length]);

    const comment = comments[currentIndex];
    if (!comment) return null;

    return (
        <div
            ref={tickerRef}
            className="mb-3 flex w-full items-center gap-2 overflow-hidden rounded-xl bg-black/20 px-2 py-2 backdrop-blur-sm"
        >
            <MessageCircle className="h-3.5 w-3.5 shrink-0 text-primary" />
            <div
                className="flex-1 overflow-hidden transition-opacity duration-400"
                style={{
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                }}
            >
                <span className="mr-1.5 text-xs font-semibold text-primary">
                    {comment.user?.name}
                </span>
                <span className="truncate text-xs text-foreground/80">
                    {comment.content}
                </span>
            </div>
        </div>
    );
}
