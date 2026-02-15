import { Head, Link } from '@inertiajs/react';
import { index as albumsIndex } from '@/routes/artist/albums';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    TrendingUp,
    Music,
    DollarSign,
    Eye,
    Star,
    Edit,
    Plus,
    BarChart3,
    Play,
    Package,
    Calendar,
    User
} from 'lucide-react';

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
                <div className="bg-gradient-earth border-b border-border/40 py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold font-heading text-foreground flex items-center gap-2">
                                    {artistProfile.stage_name}
                                    {artistProfile.is_verified && (
                                        <Badge className="bg-primary text-primary-foreground">
                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                            Vérifié
                                        </Badge>
                                    )}
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    {(artistProfile.categories || []).join(' • ')}
                                </p>
                                {artistProfile.rating > 0 && (
                                    <div className="flex items-center gap-2 mt-2 text-sm">
                                        <div className="flex items-center gap-1 text-primary">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="font-medium">{artistProfile.rating.toFixed(1)}</span>
                                        </div>
                                        <span className="text-muted-foreground">
                                            ({artistProfile.total_reviews} avis)
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="gap-2">
                                    <Edit className="w-4 h-4" />
                                    Modifier profil
                                </Button>
                                <Link href={albumsIndex.url()}>
                                    <Button variant="outline" className="gap-2">
                                        <Music className="w-4 h-4" />
                                        Mes Albums
                                    </Button>
                                </Link>
                                <Button className="gap-2 bg-primary hover:bg-primary/90">
                                    <BarChart3 className="w-4 h-4" />
                                    Statistiques
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <section className="py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">
                                        {(stats.total_earnings || 0).toLocaleString()} FCFA
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Cumulatif</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Revenus ce mois</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-primary">
                                        {(stats.monthly_earnings || 0).toLocaleString()} FCFA
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Mois en cours</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Réservations en attente</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-amber-500">
                                        {stats.pending_reservations || 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Demandes à traiter</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Écoutes totales</CardTitle>
                                    <Play className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">
                                        {formatNumber(stats.total_plays || 0)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Sur vos albums</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Top Album */}
                {topAlbum && (
                    <section className="py-8 px-4 bg-muted/30">
                        <div className="container max-w-7xl mx-auto">
                            <h2 className="text-2xl font-bold font-heading mb-6 text-foreground">
                                Album le plus écouté
                            </h2>
                            <Card className="overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-48 h-48 bg-muted">
                                        <img
                                            src={topAlbum.cover_url}
                                            alt={topAlbum.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 p-6">
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                            <div>
                                                <h3 className="text-2xl font-bold font-heading text-foreground">
                                                    {topAlbum.title}
                                                </h3>
                                                <p className="text-muted-foreground mt-1">{topAlbum.year}</p>
                                                <div className="flex gap-4 mt-4 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Titres:</span>
                                                        <span className="ml-2 font-medium text-foreground">
                                                            {topAlbum.tracks_count}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Écoutes:</span>
                                                        <span className="ml-2 font-medium text-primary">
                                                            {formatNumber(topAlbum.total_plays)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button className="gap-2">
                                                <Play className="w-4 h-4 fill-current" />
                                                Écouter
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>
                )}

                {/* Recent Reservations */}
                <section className="py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold font-heading mb-6 text-foreground">Réservations récentes</h2>
                        <Card>
                            <CardContent className="p-0">
                                {recentReservations && recentReservations.length > 0 ? (
                                    <div className="divide-y">
                                        {recentReservations.map((res: any) => (
                                            <div key={res.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{res.client.name}</p>
                                                        <p className="text-xs text-muted-foreground">{res.service.title}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <Badge variant={res.status === 'pending' ? 'outline' : 'default'} className="capitalize">
                                                            {res.status}
                                                        </Badge>
                                                        <p className="text-[10px] text-muted-foreground mt-1">
                                                            {new Date(res.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/client/reservations/${res.id}`}>Gérer</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        Aucune réservation pour le moment.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Services List */}
                <section className="py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold font-heading text-foreground">Mes services</h2>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Nouveau service
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(services || []).slice(0, 6).map((service) => (
                                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg">{service.title}</CardTitle>
                                            <Badge
                                                variant={service.is_active ? 'default' : 'secondary'}
                                                className={service.is_active ? 'bg-green-600' : ''}
                                            >
                                                {service.is_active ? 'Actif' : 'Inactif'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="text-2xl font-bold text-primary">
                                                {service.price.toLocaleString()} FCFA
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <Badge variant="outline" className="mt-3 capitalize">
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
