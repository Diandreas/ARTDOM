
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, Heart, ListMusic, Share2, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { cn } from '@/lib/utils';

export default function FullPlayer() {
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
    } = useAudio();

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleProgressChange = (value: number[]) => {
        seek(value[0]);
    };

    const handleVolumeChange = (value: number[]) => {
        setVolume(value[0] / 100);
    };

    if (!currentTrack) {
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

    return (
        <div className="h-screen w-full bg-gradient-to-b from-primary/10 to-background flex flex-col">
            <Head title={`${currentTrack.title} - ${currentTrack.artist}`} />

            {/* Header */}
            <div className="p-4 flex justify-between items-center">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/artstream">
                        <ChevronDown className="w-6 h-6" />
                    </Link>
                </Button>
                <div className="text-center">
                    <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Lecture en cours</span>
                    <p className="text-sm font-semibold">{currentTrack.album || 'Album'}</p>
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
                        src={currentTrack.image || 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop'}
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Track Info */}
                <div className="w-full flex justify-between items-center mb-2">
                    <div className="overflow-hidden">
                        <h1 className="text-2xl font-bold font-heading truncate">{currentTrack.title}</h1>
                        <p className="text-lg text-muted-foreground truncate">{currentTrack.artist}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-primary">
                        <Heart className="w-6 h-6 fill-current" />
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="w-full space-y-2 mb-8">
                    <Slider
                        value={[progress]}
                        max={duration || 100}
                        step={1}
                        onValueChange={handleProgressChange}
                        className="w-full cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground font-medium">
                        <span>{formatTime(progress)}</span>
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
                    <Button variant="ghost" size="icon" className="text-muted-foreground" asChild>
                        <Link href="/artstream">
                            <ListMusic className="w-5 h-5" />
                        </Link>
                    </Button>
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
