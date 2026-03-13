
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Heart, Maximize2, ListMusic, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import QueueSidebar from '@/components/Player/QueueSidebar';
import { toggle as toggleFavorite } from '@/actions/App/Http/Controllers/FavoriteController';

export default function MiniPlayer() {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const { currentTrack, isPlaying, togglePlay, progress, duration, seek, updateTrackFavorite } = useAudio();
    const [localProgress, setLocalProgress] = useState(progress);
    const [isDragging, setIsDragging] = useState(false);
    const [isFavoriting, setIsFavoriting] = useState(false);

    useEffect(() => {
        if (!isDragging) {
            setLocalProgress(progress);
        }
    }, [progress, isDragging]);

    if (!currentTrack) return null;

    const handleSeek = (value: number[]) => {
        setLocalProgress(value[0]);
        setIsDragging(true);
    };

    const handleSeekCommit = (value: number[]) => {
        seek(value[0]);
        setIsDragging(false);
    };

    const handleToggleFavorite = () => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        setIsFavoriting(true);
        const newState = !currentTrack.is_favorited;

        // Optimistic update
        updateTrackFavorite(currentTrack.id, newState);

        router.post(
            toggleFavorite.url({ track: currentTrack.id }),
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsFavoriting(false),
                onError: () => {
                    // Revert on error
                    updateTrackFavorite(currentTrack.id, !newState);
                },
            }
        );
    };

    const formatTime = (seconds: number) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const percentage = duration ? (localProgress / duration) * 100 : 0;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/40 p-2 md:p-3 shadow-2xl z-50 mb-16 md:mb-0">
            <div className="container flex items-center justify-between gap-4">
                {/* Track Info */}
                <div className="flex items-center gap-3 w-1/3 md:w-1/4 truncate">
                    <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-md overflow-hidden shrink-0 group">
                        <img
                            src={currentTrack.image}
                            alt={currentTrack.title}
                            className={cn("h-full w-full object-cover transition-transform duration-700", isPlaying ? "scale-110" : "scale-100")}
                        />
                    </div>
                    <div className="flex flex-col truncate">
                        <h4 className="text-sm font-bold truncate text-foreground">{currentTrack.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                            "hidden sm:flex h-8 w-8 transition-colors",
                            currentTrack.is_favorited ? "text-primary" : "text-muted-foreground hover:text-primary"
                        )}
                        onClick={handleToggleFavorite}
                        disabled={isFavoriting}
                    >
                        {isFavoriting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Heart className={cn("h-4 w-4", currentTrack.is_favorited && "fill-current")} />
                        )}
                    </Button>
                </div>

                {/* Controls & Progress */}
                <div className="flex flex-col items-center flex-1 max-w-md gap-1">
                    <div className="flex items-center gap-4">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-foreground/70 hover:text-foreground hidden sm:flex">
                            <SkipBack className="h-5 w-5 fill-current" />
                        </Button>
                        <Button
                            size="icon"
                            className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                            onClick={togglePlay}
                        >
                            {isPlaying ? (
                                <Pause className="h-5 w-5 fill-current" />
                            ) : (
                                <Play className="h-5 w-5 fill-current ml-0.5" />
                            )}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-foreground/70 hover:text-foreground">
                            <SkipForward className="h-5 w-5 fill-current" />
                        </Button>
                    </div>

                    <div className="w-full flex items-center gap-2 text-xs text-muted-foreground hidden sm:flex">
                        <span className="w-8 text-right font-mono">{formatTime(localProgress)}</span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full relative cursor-pointer group">
                            <div className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-100" style={{ width: `${percentage}%` }} />
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={localProgress}
                                onChange={(e) => handleSeek([parseFloat(e.target.value)])}
                                onMouseUp={(e) => handleSeekCommit([parseFloat((e.target as HTMLInputElement).value)])}
                                onTouchEnd={(e) => handleSeekCommit([parseFloat((e.target as HTMLInputElement).value)])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        <span className="w-8 font-mono">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Extra Actions */}
                <div className="w-1/3 md:w-1/4 flex justify-end items-center gap-2">
                    <QueueSidebar
                        trigger={
                            <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-foreground hidden sm:flex">
                                <ListMusic className="h-5 w-5" />
                            </Button>
                        }
                    />
                    <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-foreground" asChild>
                        <Link href="/artstream/player">
                            <Maximize2 className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Mobile progress bar (slim, at top of player) */}
            <div className="sm:hidden absolute top-0 left-0 right-0 h-0.5 bg-muted">
                <div className="h-full bg-primary transition-all duration-100" style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}
