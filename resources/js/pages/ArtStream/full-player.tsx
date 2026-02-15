
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, Play, SkipBack, SkipForward, Repeat, Shuffle, Heart, ListMusic, Share2, Volume2 } from 'lucide-react';

export default function FullPlayer() {
    return (
        <div className="h-screen w-full bg-gradient-to-b from-primary/10 to-background flex flex-col">
            <Head title="Lecteur - ArtStream" />

            {/* Header */}
            <div className="p-4 flex justify-between items-center">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/artstream">
                        <ChevronDown className="w-6 h-6" />
                    </Link>
                </Button>
                <div className="text-center">
                    <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Lecture en cours</span>
                    <p className="text-sm font-semibold">Playlist: Afro Vibes</p>
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
                        src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop"
                        alt="Album Cover"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Track Info */}
                <div className="w-full flex justify-between items-center mb-2">
                    <div className="overflow-hidden">
                        <h1 className="text-2xl font-bold font-heading truncate">Loi (Rumba Version)</h1>
                        <p className="text-lg text-muted-foreground truncate">Koffi Olomide</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-primary">
                        <Heart className="w-6 h-6 fill-current" />
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="w-full space-y-2 mb-8">
                    <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground font-medium">
                        <span>1:45</span>
                        <span>4:12</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="w-full flex justify-between items-center mb-8">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Shuffle className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-12 w-12">
                        <SkipBack className="w-8 h-8 fill-current" />
                    </Button>
                    <Button size="icon" className="h-16 w-16 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90">
                        <Play className="w-8 h-8 fill-current ml-1" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-12 w-12">
                        <SkipForward className="w-8 h-8 fill-current" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Repeat className="w-5 h-5" />
                    </Button>
                </div>

                {/* Secondary Controls */}
                <div className="w-full flex justify-between items-center px-4">
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Volume2 className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Share2 className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <ListMusic className="w-5 h-5" />
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
