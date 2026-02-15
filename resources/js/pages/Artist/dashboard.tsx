import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    Package
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

interface Stats {
    services_count: number;
    active_services: number;
    albums_count: number;
    total_plays: number;
    avg_album_plays: number;
}

interface ArtistProfile {
    stage_name: string;
    bio: string;
    categories: string[];
    base_rate: number;
    is_verified: boolean;
    rating: number;
    total_reviews: number;
}

interface DashboardProps {
    stats: Stats;
    services: Service[];
    albums: Album[];
    topAlbum: Album | null;
    artistProfile: ArtistProfile;
}

export default function ArtistDashboard({ stats, services, albums, topAlbum, artistProfile }: DashboardProps) {
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
                                    {artistProfile.categories.join(' • ')}
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
                            {/* Services Card */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Services actifs</CardTitle>
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">
                                        {stats.active_services}/{stats.services_count}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Services disponibles
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Albums Card */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Albums</CardTitle>
                                    <Music className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">{stats.albums_count}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Publiés sur la plateforme
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Total Plays Card */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Écoutes totales</CardTitle>
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">
                                        {formatNumber(stats.total_plays)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Sur tous vos albums
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Average Plays Card */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Moyenne par album</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">
                                        {formatNumber(stats.avg_album_plays)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Écoutes en moyenne
                                    </p>
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
                            {services.slice(0, 6).map((service) => (
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
                        {services.length > 6 && (
                            <div className="text-center mt-6">
                                <Button variant="outline">Voir tous les services ({services.length})</Button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Recent Albums */}
                {albums.length > 0 && (
                    <section className="py-8 px-4 bg-muted/30">
                        <div className="container max-w-7xl mx-auto">
                            <h2 className="text-2xl font-bold font-heading mb-6 text-foreground">Mes albums</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {albums.map((album) => (
                                    <div key={album.id} className="group cursor-pointer">
                                        <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3 relative">
                                            <img
                                                src={album.cover_url}
                                                alt={album.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button size="icon" className="rounded-full">
                                                    <Play className="w-4 h-4 fill-current ml-0.5" />
                                                </Button>
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-sm truncate text-foreground">{album.title}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {formatNumber(album.total_plays)} écoutes
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </MainLayout>
    );
}
