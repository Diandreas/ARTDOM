import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Calendar, Users, Star, DollarSign, Play, TrendingUp, Shuffle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAudio, Track } from '@/contexts/AudioContext';

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
            <div className="container px-4 md:px-6 py-8 pb-24">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-heading">Mon Dashboard</h1>
                    <p className="text-muted-foreground">Gérez vos réservations et découvrez de nouveaux artistes.</p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.reservations_count}</div>
                            <p className="text-xs text-muted-foreground">Total des réservations</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Artistes Favoris</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.favorites_count}</div>
                            <p className="text-xs text-muted-foreground">Favoris enregistrés</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_spent.toFixed(2)} €</div>
                            <p className="text-xs text-muted-foreground">Toutes réservations</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Trending Tracks Slider */}
                {trendingTracks.length > 0 && (
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                {isTrending ? (
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                ) : (
                                    <Shuffle className="h-5 w-5 text-primary" />
                                )}
                                <h2 className="text-xl font-bold font-heading">
                                    {isTrending ? 'Musiques en tendance' : 'Sélection pour vous'}
                                </h2>
                                {!isTrending && (
                                    <Badge variant="outline" className="text-xs">Aléatoire</Badge>
                                )}
                            </div>
                            <Button variant="ghost" size="sm" onClick={handlePlayAll} className="text-primary">
                                <Play className="h-4 w-4 mr-1 fill-current" />
                                Tout jouer
                            </Button>
                        </div>

                        <Carousel opts={{ align: 'start', loop: trendingTracks.length > 5 }} className="w-full">
                            <CarouselContent>
                                {trendingTracks.map((track, index) => {
                                    const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;
                                    const isCurrentTrack = currentTrack?.id === track.id;

                                    return (
                                        <CarouselItem key={track.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                            <div
                                                className="group cursor-pointer"
                                                onClick={() => handlePlayTrack(track, index)}
                                            >
                                                <div className={`aspect-square relative overflow-hidden rounded-lg bg-muted mb-3 ${isCurrentTrack ? 'ring-2 ring-primary' : ''}`}>
                                                    <img
                                                        src={track.image}
                                                        alt={track.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                                        <Button
                                                            size="icon"
                                                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full bg-primary hover:bg-primary/90 scale-0 group-hover:scale-100"
                                                        >
                                                            {isCurrentlyPlaying ? (
                                                                <span className="flex gap-0.5 items-end h-4">
                                                                    <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '60%', animationDelay: '0ms' }} />
                                                                    <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '100%', animationDelay: '150ms' }} />
                                                                    <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '40%', animationDelay: '300ms' }} />
                                                                </span>
                                                            ) : (
                                                                <Play className="w-5 h-5 fill-current" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                    {isTrending && track.plays > 0 && (
                                                        <div className="absolute top-2 left-2">
                                                            <Badge className="bg-primary/90 text-primary-foreground text-xs px-1.5 py-0.5">
                                                                <TrendingUp className="w-3 h-3 mr-1" />
                                                                {track.plays >= 1000 ? `${(track.plays / 1000).toFixed(1)}k` : track.plays}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className={`font-semibold text-sm mb-0.5 truncate ${isCurrentTrack ? 'text-primary' : 'text-foreground'}`}>
                                                    {track.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                                                <p className="text-xs text-muted-foreground/70 truncate">{track.album}</p>
                                            </div>
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex -left-4 bg-background border-border hover:bg-muted" />
                            <CarouselNext className="hidden md:flex -right-4 bg-background border-border hover:bg-muted" />
                        </Carousel>
                    </section>
                )}

                {/* Actions rapides + Réservations récentes */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions Rapides</CardTitle>
                            <CardDescription>Explorez et réservez des artistes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/artstream">
                                <Button className="w-full" variant="outline">
                                    <Music className="mr-2 h-4 w-4" />
                                    Découvrir ArtStream
                                </Button>
                            </Link>
                            <Link href="/artists">
                                <Button className="w-full" variant="outline">
                                    <Users className="mr-2 h-4 w-4" />
                                    Parcourir les Artistes
                                </Button>
                            </Link>
                            <Link href="/client/reservations">
                                <Button className="w-full" variant="default">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Mes Réservations
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Réservations Récentes</CardTitle>
                            <CardDescription>Vos 5 dernières réservations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentReservations && recentReservations.length > 0 ? (
                                <div className="space-y-4">
                                    {recentReservations.map((res: any) => (
                                        <div key={res.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={res.artist?.profile_photo || '/placeholder-avatar.png'}
                                                    alt={res.artist?.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-sm">{res.service?.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {res.artist?.artistProfile?.stage_name || res.artist?.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant={res.status === 'pending' ? 'outline' : 'default'}>
                                                    {res.status}
                                                </Badge>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    <Link href={`/client/reservations/${res.id}`} className="hover:underline">
                                                        Voir détails
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Aucune réservation pour le moment.
                                    </p>
                                    <Link href="/artists">
                                        <Button variant="outline" size="sm">
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
