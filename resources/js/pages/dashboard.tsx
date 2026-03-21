import { Head, Link, router } from '@inertiajs/react';
import { Music, Calendar, Users, Star, DollarSign, Play, TrendingUp, Shuffle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { Track } from '@/contexts/AudioContext';
import { useAudio } from '@/contexts/AudioContext';
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

export default function ClientDashboard({ stats, recentReservations, trendingTracks, isTrending }: DashboardProps) {
    const { playTrack, setQueue, currentTrack, isPlaying, togglePlay } = useAudio();

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
            <Head title="Dashboard Client" />
            <div className="container px-4 md:px-6 py-4 pb-8">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold font-heading">Mon Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Gérez vos réservations et découvrez de nouveaux artistes.</p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pb-4 px-4 pt-0">
                            <div className="text-xl font-bold">{stats.reservations_count}</div>
                            <p className="text-xs text-muted-foreground">Total des réservations</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                            <CardTitle className="text-sm font-medium">Artistes Favoris</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pb-4 px-4 pt-0">
                            <div className="text-xl font-bold">{stats.favorites_count}</div>
                            <p className="text-xs text-muted-foreground">Favoris enregistrés</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
                            <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="pb-4 px-4 pt-0">
                            <div className="text-xl font-bold">{stats.total_spent.toFixed(2)} €</div>
                            <p className="text-xs text-muted-foreground">Toutes réservations</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Trending Tracks Slider */}
                {trendingTracks.length > 0 && (
                    <section className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {isTrending ? (
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                ) : (
                                    <Shuffle className="h-4 w-4 text-primary" />
                                )}
                                <h2 className="text-lg font-bold font-heading">
                                    {isTrending ? 'Musiques en tendance' : 'Sélection pour vous'}
                                </h2>
                                {!isTrending && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">Aléatoire</Badge>
                                )}
                            </div>
                            <Button variant="ghost" size="sm" onClick={handlePlayAll} className="text-primary h-7 px-2 text-xs">
                                <Play className="h-3 w-3 mr-1 fill-current" />
                                Tout jouer
                            </Button>
                        </div>

                        <Carousel opts={{ align: 'start', loop: trendingTracks.length > 5 }} className="w-full">
                            <CarouselContent>
                                {trendingTracks.map((track, index) => {
                                    const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;
                                    const isCurrentTrack = currentTrack?.id === track.id;

                                    return (
                                        <CarouselItem key={track.id} className="basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                                            <div
                                                className="group cursor-pointer"
                                                onClick={() => handlePlayTrack(track, index)}
                                            >
                                                <div className={`aspect-square relative overflow-hidden rounded-md bg-muted mb-2 ${isCurrentTrack ? 'ring-2 ring-primary' : ''}`}>
                                                    <img
                                                        src={track.image}
                                                        alt={track.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                                        <Button
                                                            size="icon"
                                                            className="opacity-0 w-8 h-8 group-hover:opacity-100 transition-all duration-300 rounded-full bg-primary hover:bg-primary/90 scale-0 group-hover:scale-100"
                                                        >
                                                            {isCurrentlyPlaying ? (
                                                                <span className="flex gap-0.5 items-end h-3">
                                                                    <span className="w-0.5 bg-white rounded-full animate-bounce" style={{ height: '60%', animationDelay: '0ms' }} />
                                                                    <span className="w-0.5 bg-white rounded-full animate-bounce" style={{ height: '100%', animationDelay: '150ms' }} />
                                                                    <span className="w-0.5 bg-white rounded-full animate-bounce" style={{ height: '40%', animationDelay: '300ms' }} />
                                                                </span>
                                                            ) : (
                                                                <Play className="w-4 h-4 fill-current" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                    {isTrending && track.plays > 0 && (
                                                        <div className="absolute top-1.5 left-1.5">
                                                            <Badge className="bg-primary/90 text-primary-foreground text-[10px] px-1 py-0">
                                                                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                                                                {track.plays >= 1000 ? `${(track.plays / 1000).toFixed(1)}k` : track.plays}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className={`font-semibold text-xs mb-0 truncate ${isCurrentTrack ? 'text-primary' : 'text-foreground'}`}>
                                                    {track.title}
                                                </h3>
                                                <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                                                <p className="text-[10px] text-muted-foreground/70 truncate">{track.album}</p>
                                            </div>
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex -left-4 w-6 h-6 bg-background border-border hover:bg-muted" />
                            <CarouselNext className="hidden md:flex -right-4 w-6 h-6 bg-background border-border hover:bg-muted" />
                        </Carousel>
                    </section>
                )}

                {/* Actions rapides + Réservations récentes */}
                <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base">Actions Rapides</CardTitle>
                            <CardDescription className="text-xs">Explorez et réservez des artistes</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                            <Link href="/artstream" className="block w-full">
                                <Button className="w-full h-8 text-xs" variant="outline" size="sm">
                                    <Music className="mr-2 h-3.5 w-3.5" />
                                    Découvrir ArtStream
                                </Button>
                            </Link>
                            <Link href="/artists" className="block w-full">
                                <Button className="w-full h-8 text-xs" variant="outline" size="sm">
                                    <Users className="mr-2 h-3.5 w-3.5" />
                                    Parcourir les Artistes
                                </Button>
                            </Link>
                            <Link href="/client/reservations" className="block w-full">
                                <Button className="w-full h-8 text-xs" variant="default" size="sm">
                                    <Calendar className="mr-2 h-3.5 w-3.5" />
                                    Mes Réservations
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base">Réservations Récentes</CardTitle>
                            <CardDescription className="text-xs">Vos 5 dernières réservations</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {recentReservations && recentReservations.length > 0 ? (
                                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                                    {recentReservations.map((res: any) => (
                                        <div key={res.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={res.artist?.profile_photo || '/placeholder-avatar.png'}
                                                    alt={res.artist?.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-xs">{res.service?.title}</p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {res.artist?.artistProfile?.stage_name || res.artist?.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant={res.status === 'pending' ? 'outline' : 'default'} className="text-[10px] px-1.5 py-0">
                                                    {res.status}
                                                </Badge>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                                    <Link href={`/client/reservations/${res.id}`} className="hover:underline">
                                                        Voir détails
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-xs text-muted-foreground mb-3">
                                        Aucune réservation pour le moment.
                                    </p>
                                    <Link href="/artists">
                                        <Button variant="outline" size="sm" className="h-8 text-xs">
                                            Découvrir des artistes
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
