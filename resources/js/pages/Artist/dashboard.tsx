import { Head, Link, usePage } from '@inertiajs/react';
import {
    TrendingUp,
    Music,
    DollarSign,
    Star,
    Edit,
    Plus,
    Wallet,
    Award,
    Play,
    Calendar,
    User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { index as albumsIndex } from '@/actions/App/Http/Controllers/Artist/AlbumUploadController';
import { DashboardSkeleton } from '@/components/Skeletons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/MainLayout';


interface Service {
    id: string;
    title: string;
    price: number;
    is_active: boolean;
    category: string;
}

interface Album {
    id: string;
    title: string;
    cover_url: string;
    total_plays: number;
    tracks_count: number;
    year: number;
}

interface DashboardProps {
    stats: any;
    services: Service[];
    albums: Album[];
    topAlbum: Album | null;
    recentReservations: any[];
    artistProfile: any;
}

export default function ArtistDashboard({ stats, services, albums, topAlbum, recentReservations, artistProfile }: DashboardProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <MainLayout>
                <Head title="Tableau de bord" />
                <DashboardSkeleton />
            </MainLayout>
        );
    }

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    return (
        <MainLayout>
            <Head title="Dashboard Artiste" />

            <div className="pb-24 md:pb-6">
                {/* Header Section */}
                <div className="bg-gradient-earth border-b border-border/40 py-4 md:py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                            <div>
                                <h1 className="text-xl md:text-3xl font-bold font-heading text-foreground flex items-center gap-2">
                                    {artistProfile.stage_name}
                                    {artistProfile.is_verified && (
                                        <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                                            <Star className="w-2.5 h-2.5 mr-1 fill-current" />
                                            Vérifié
                                        </Badge>
                                    )}
                                </h1>
                                <p className="text-muted-foreground text-xs md:text-sm mt-0.5">
                                    {(artistProfile.categories || []).join(' • ')}
                                </p>
                                {artistProfile.rating > 0 && (
                                    <div className="flex items-center gap-2 mt-1 text-xs md:text-sm">
                                        <div className="flex items-center gap-1 text-primary">
                                            <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                            <span className="font-medium">{artistProfile.rating.toFixed(1)}</span>
                                        </div>
                                        <span className="text-muted-foreground">
                                            ({artistProfile.total_reviews} avis)
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* Mobile: icon-only buttons in a row */}
                            <div className="flex gap-2 md:gap-3">
                                <Button variant="outline" size="sm" className="gap-1.5 text-xs md:text-sm h-8 md:h-10 px-2 md:px-4" asChild>
                                    <Link href="/artist/profile">
                                        <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        <span className="hidden sm:inline">Modifier profil</span>
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm" className="gap-1.5 text-xs md:text-sm h-8 md:h-10 px-2 md:px-4" asChild>
                                    <Link href={albumsIndex.url()}>
                                        <Music className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        <span className="hidden sm:inline">Mes Albums</span>
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm" className="gap-1.5 text-xs md:text-sm h-8 md:h-10 px-2 md:px-4 border-primary text-primary hover:bg-primary/10" asChild>
                                    <Link href="/artist/subscription">
                                        <Award className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        <span className="hidden sm:inline">Premium</span>
                                    </Link>
                                </Button>
                                <Button size="sm" className="gap-1.5 text-xs md:text-sm h-8 md:h-10 px-2 md:px-4 bg-primary hover:bg-primary/90" asChild>
                                    <Link href="/artist/wallet">
                                        <Wallet className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        <span className="hidden sm:inline">Portefeuille</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <section className="py-4 md:py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3 md:pb-2 md:pt-6 md:px-6">
                                    <CardTitle className="text-xs md:text-sm font-medium">Revenus totaux</CardTitle>
                                    <DollarSign className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
                                    <div className="text-base md:text-2xl font-bold text-foreground">
                                        {(stats.total_earnings || 0).toLocaleString()}
                                        <span className="text-xs md:text-sm font-normal text-muted-foreground ml-1">FCFA</span>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Cumulatif</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3 md:pb-2 md:pt-6 md:px-6">
                                    <CardTitle className="text-xs md:text-sm font-medium">Ce mois</CardTitle>
                                    <TrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
                                    <div className="text-base md:text-2xl font-bold text-primary">
                                        {(stats.monthly_earnings || 0).toLocaleString()}
                                        <span className="text-xs md:text-sm font-normal text-muted-foreground ml-1">FCFA</span>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Mois en cours</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3 md:pb-2 md:pt-6 md:px-6">
                                    <CardTitle className="text-xs md:text-sm font-medium">En attente</CardTitle>
                                    <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
                                    <div className="text-base md:text-2xl font-bold text-amber-500">
                                        {stats.pending_reservations || 0}
                                    </div>
                                    <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Réservations</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3 md:pb-2 md:pt-6 md:px-6">
                                    <CardTitle className="text-xs md:text-sm font-medium">Écoutes</CardTitle>
                                    <Play className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
                                    <div className="text-base md:text-2xl font-bold text-foreground">
                                        {formatNumber(stats.total_plays || 0)}
                                    </div>
                                    <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Sur vos albums</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Top Album */}
                {topAlbum && (
                    <section className="py-4 md:py-8 px-4 bg-muted/30">
                        <div className="container max-w-7xl mx-auto">
                            <h2 className="text-base md:text-2xl font-bold font-heading mb-3 md:mb-6 text-foreground">
                                Album le plus écouté
                            </h2>
                            <Card className="overflow-hidden">
                                <div className="flex flex-row">
                                    <div className="w-20 h-20 md:w-48 md:h-48 bg-muted shrink-0">
                                        <img
                                            src={topAlbum.cover_url}
                                            alt={topAlbum.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 p-3 md:p-6 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-base md:text-2xl font-bold font-heading text-foreground line-clamp-1">
                                                {topAlbum.title}
                                            </h3>
                                            <p className="text-muted-foreground text-xs md:text-base mt-0.5">{topAlbum.year}</p>
                                            <div className="flex gap-3 md:gap-4 mt-2 md:mt-4 text-xs md:text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Titres:</span>
                                                    <span className="ml-1 font-medium text-foreground">{topAlbum.tracks_count}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Écoutes:</span>
                                                    <span className="ml-1 font-medium text-primary">{formatNumber(topAlbum.total_plays)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button size="sm" className="gap-2 mt-2 md:mt-4 w-fit text-xs md:text-sm h-8 md:h-10">
                                            <Play className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                            Écouter
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>
                )}

                {/* Recent Reservations */}
                <section className="py-4 md:py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <h2 className="text-base md:text-2xl font-bold font-heading mb-3 md:mb-6 text-foreground">Réservations récentes</h2>
                        <Card>
                            <CardContent className="p-0">
                                {recentReservations && recentReservations.length > 0 ? (
                                    <div className="divide-y">
                                        {recentReservations.map((res: any) => (
                                            <div key={res.id} className="p-3 md:p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-2 md:gap-4 min-w-0">
                                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        <User className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-xs md:text-sm truncate">{res.client.name}</p>
                                                        <p className="text-[10px] md:text-xs text-muted-foreground truncate">{res.service.title}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                                                    <div className="text-right hidden xs:block">
                                                        <Badge variant={res.status === 'pending' ? 'outline' : 'default'} className="capitalize text-[10px] md:text-xs">
                                                            {res.status}
                                                        </Badge>
                                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                                            {new Date(res.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-xs h-7 md:h-8 px-2 md:px-3" asChild>
                                                        <Link href={`/artist/orders/${res.id}`}>Gérer</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 md:py-12 text-muted-foreground text-sm">
                                        Aucune réservation pour le moment.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Services List */}
                <section className="py-4 md:py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-3 md:mb-6">
                            <h2 className="text-base md:text-2xl font-bold font-heading text-foreground">Mes services</h2>
                            <Button size="sm" className="gap-1.5 text-xs md:text-sm h-8 md:h-10 px-2 md:px-4" asChild>
                                <Link href="/artist/services">
                                    <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    <span className="hidden sm:inline">Nouveau service</span>
                                    <span className="sm:hidden">Ajouter</span>
                                </Link>
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                            {(services || []).slice(0, 6).map((service) => (
                                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="p-3 md:p-6 pb-1 md:pb-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-sm md:text-lg line-clamp-1">{service.title}</CardTitle>
                                            <Badge
                                                variant={service.is_active ? 'default' : 'secondary'}
                                                className={`shrink-0 text-[10px] md:text-xs ${service.is_active ? 'bg-green-600' : ''}`}
                                            >
                                                {service.is_active ? 'Actif' : 'Inactif'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-3 md:p-6 pt-1 md:pt-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-base md:text-2xl font-bold text-primary">
                                                {service.price.toLocaleString()}
                                                <span className="text-xs font-normal text-muted-foreground ml-1">FCFA</span>
                                            </div>
                                            <Button variant="outline" size="sm" className="h-7 w-7 md:h-9 md:w-9 p-0">
                                                <Edit className="w-3 h-3 md:w-4 md:h-4" />
                                            </Button>
                                        </div>
                                        <Badge variant="outline" className="mt-2 capitalize text-[10px] md:text-xs">
                                            {service.category}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
