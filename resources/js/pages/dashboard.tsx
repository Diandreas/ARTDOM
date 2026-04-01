import { Head, Link, router } from '@inertiajs/react';
import {
    Music,
    Calendar,
    Users,
    Star,
    DollarSign,
    Play,
    TrendingUp,
    Shuffle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import type { Track } from '@/contexts/AudioContext';
import { useAudio } from '@/contexts/AudioContext';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';

interface TrendingTrack {
    id: string;
    title: string;
    artist: string;
    image: string;
    url: string;
    album: string;
    plays: number;
    is_favorited: boolean;
}

interface DashboardProps {
    stats: {
        reservations_count: number;
        favorites_count: number;
        total_spent: number;
    };
    recentReservations: any[];
    trendingTracks: TrendingTrack[];
    isTrending: boolean;
}

export default function ClientDashboard({
    stats,
    recentReservations,
    trendingTracks,
    isTrending,
}: DashboardProps) {
    const { t } = useAppLocale();
    const { playTrack, setQueue, currentTrack, isPlaying, togglePlay } =
        useAudio();

    const handlePlayTrack = (track: TrendingTrack, index: number) => {
        const queue: Track[] = trendingTracks.map((t) => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            image: t.image,
            url: t.url,
            is_favorited: t.is_favorited,
        }));

        if (currentTrack?.id === track.id) {
            togglePlay();
        } else {
            setQueue(queue, index, true);
        }
    };

    const handlePlayAll = () => {
        if (trendingTracks.length === 0) return;
        handlePlayTrack(trendingTracks[0], 0);
    };

    return (
        <MainLayout>
            <Head title={t('Client Dashboard')} />
            <div className="container px-4 py-4 pb-8 md:px-6">
                <div className="mb-4">
                    <h1 className="font-heading text-2xl font-bold">
                        {t('My dashboard')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            'Manage your reservations and discover new artists.',
                        )}
                    </p>
                </div>

                {/* Stats */}
                <div className="mb-4 grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-1">
                            <CardTitle className="text-sm font-medium">
                                {t('Reservations')}
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="px-4 pt-0 pb-4">
                            <div className="text-xl font-bold">
                                {stats.reservations_count}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('Total reservations')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-1">
                            <CardTitle className="text-sm font-medium">
                                {t('Favorite artists')}
                            </CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="px-4 pt-0 pb-4">
                            <div className="text-xl font-bold">
                                {stats.favorites_count}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('Saved favorites')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-1">
                            <CardTitle className="text-sm font-medium">
                                {t('Total spending')}
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="px-4 pt-0 pb-4">
                            <div className="text-xl font-bold">
                                {stats.total_spent.toFixed(2)} €
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('All reservations')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Trending Tracks Slider */}
                {trendingTracks.length > 0 && (
                    <section className="mb-4">
                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isTrending ? (
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                ) : (
                                    <Shuffle className="h-4 w-4 text-primary" />
                                )}
                                <h2 className="font-heading text-lg font-bold">
                                    {isTrending
                                        ? t('Trending music')
                                        : t('Selection for you')}
                                </h2>
                                {!isTrending && (
                                    <Badge
                                        variant="outline"
                                        className="px-1.5 py-0 text-[10px]"
                                    >
                                        {t('Random')}
                                    </Badge>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handlePlayAll}
                                className="h-7 px-2 text-xs text-primary"
                            >
                                <Play className="mr-1 h-3 w-3 fill-current" />
                                {t('Play all')}
                            </Button>
                        </div>

                        <Carousel
                            opts={{
                                align: 'start',
                                loop: trendingTracks.length > 5,
                            }}
                            className="w-full"
                        >
                            <CarouselContent>
                                {trendingTracks.map((track, index) => {
                                    const isCurrentlyPlaying =
                                        currentTrack?.id === track.id &&
                                        isPlaying;
                                    const isCurrentTrack =
                                        currentTrack?.id === track.id;

                                    return (
                                        <CarouselItem
                                            key={track.id}
                                            className="basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                                        >
                                            <div
                                                className="group cursor-pointer"
                                                onClick={() =>
                                                    handlePlayTrack(
                                                        track,
                                                        index,
                                                    )
                                                }
                                            >
                                                <div
                                                    className={`relative mb-2 aspect-square overflow-hidden rounded-md bg-muted ${isCurrentTrack ? 'ring-2 ring-primary' : ''}`}
                                                >
                                                    <img
                                                        src={track.image}
                                                        alt={track.title}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
                                                        <Button
                                                            size="icon"
                                                            className="h-8 w-8 scale-0 rounded-full bg-primary opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 hover:bg-primary/90"
                                                        >
                                                            {isCurrentlyPlaying ? (
                                                                <span className="flex h-3 items-end gap-0.5">
                                                                    <span
                                                                        className="w-0.5 animate-bounce rounded-full bg-white"
                                                                        style={{
                                                                            height: '60%',
                                                                            animationDelay:
                                                                                '0ms',
                                                                        }}
                                                                    />
                                                                    <span
                                                                        className="w-0.5 animate-bounce rounded-full bg-white"
                                                                        style={{
                                                                            height: '100%',
                                                                            animationDelay:
                                                                                '150ms',
                                                                        }}
                                                                    />
                                                                    <span
                                                                        className="w-0.5 animate-bounce rounded-full bg-white"
                                                                        style={{
                                                                            height: '40%',
                                                                            animationDelay:
                                                                                '300ms',
                                                                        }}
                                                                    />
                                                                </span>
                                                            ) : (
                                                                <Play className="h-4 w-4 fill-current" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                    {isTrending &&
                                                        track.plays > 0 && (
                                                            <div className="absolute top-1.5 left-1.5">
                                                                <Badge className="bg-primary/90 px-1 py-0 text-[10px] text-primary-foreground">
                                                                    <TrendingUp className="mr-0.5 h-2.5 w-2.5" />
                                                                    {track.plays >=
                                                                    1000
                                                                        ? `${(track.plays / 1000).toFixed(1)}k`
                                                                        : track.plays}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                </div>
                                                <h3
                                                    className={`mb-0 truncate text-xs font-semibold ${isCurrentTrack ? 'text-primary' : 'text-foreground'}`}
                                                >
                                                    {track.title}
                                                </h3>
                                                <p className="truncate text-[10px] text-muted-foreground">
                                                    {track.artist}
                                                </p>
                                                <p className="truncate text-[10px] text-muted-foreground/70">
                                                    {track.album}
                                                </p>
                                            </div>
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>
                            <CarouselPrevious className="-left-4 hidden h-6 w-6 border-border bg-background hover:bg-muted md:flex" />
                            <CarouselNext className="-right-4 hidden h-6 w-6 border-border bg-background hover:bg-muted md:flex" />
                        </Carousel>
                    </section>
                )}

                {/* Actions rapides + Réservations récentes */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base">
                                {t('Quick actions')}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {t('Explore and book artists')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 p-4 pt-0">
                            <Link href="/artstream" className="block w-full">
                                <Button
                                    className="h-8 w-full text-xs"
                                    variant="outline"
                                    size="sm"
                                >
                                    <Music className="mr-2 h-3.5 w-3.5" />
                                    {t('Discover ArtStream')}
                                </Button>
                            </Link>
                            <Link href="/artists" className="block w-full">
                                <Button
                                    className="h-8 w-full text-xs"
                                    variant="outline"
                                    size="sm"
                                >
                                    <Users className="mr-2 h-3.5 w-3.5" />
                                    {t('Browse artists')}
                                </Button>
                            </Link>
                            <Link
                                href="/client/reservations"
                                className="block w-full"
                            >
                                <Button
                                    className="h-8 w-full text-xs"
                                    variant="default"
                                    size="sm"
                                >
                                    <Calendar className="mr-2 h-3.5 w-3.5" />
                                    {t('My Reservations')}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base">
                                {t('Recent reservations')}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {t('Your last 5 reservations')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {recentReservations &&
                            recentReservations.length > 0 ? (
                                <div className="max-h-[140px] space-y-2 overflow-y-auto pr-1">
                                    {recentReservations.map((res: any) => (
                                        <div
                                            key={res.id}
                                            className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                                        >
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        res.artist
                                                            ?.profile_photo ||
                                                        '/placeholder-avatar.png'
                                                    }
                                                    alt={res.artist?.name}
                                                    className="h-8 w-8 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="text-xs font-medium">
                                                        {res.service?.title}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {res.artist
                                                            ?.artistProfile
                                                            ?.stage_name ||
                                                            res.artist?.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge
                                                    variant={
                                                        res.status === 'pending'
                                                            ? 'outline'
                                                            : 'default'
                                                    }
                                                    className="px-1.5 py-0 text-[10px]"
                                                >
                                                    {res.status}
                                                </Badge>
                                                <p className="mt-0.5 text-[10px] text-muted-foreground">
                                                    <Link
                                                        href={`/client/reservations/${res.id}`}
                                                        className="hover:underline"
                                                    >
                                                        {t('View details')}
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-4 text-center">
                                    <p className="mb-3 text-xs text-muted-foreground">
                                        {t('No reservations at the moment.')}
                                    </p>
                                    <Link href="/artists">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs"
                                        >
                                            {t('Discover artists')}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
