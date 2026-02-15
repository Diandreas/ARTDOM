import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Music, Share2, MessageCircle, Clock, Play, TrendingUp } from 'lucide-react';

interface Artist {
    id: string;
    name: string;
    email: string;
    city: string;
    profile_photo: string;
    stage_name: string;
    bio: string;
    categories: string[];
    base_rate: number;
    is_verified: boolean;
    rating: number;
    total_reviews: number;
    portfolio_urls: string[];
    social_links: Record<string, string>;
}

interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    price_type: string;
    duration_minutes: number;
    category: string;
    location_type: string;
}

interface Album {
    id: string;
    title: string;
    cover_url: string;
    year: number;
    genre: string;
    total_plays: number;
    tracks_count: number;
    price: number;
}

interface Stats {
    total_services: number;
    total_albums: number;
    total_plays: number;
}

interface ProfileProps {
    artist: Artist;
    services: Service[];
    albums: Album[];
    stats: Stats;
}

const locationTypes: Record<string, string> = {
    home: 'À domicile',
    online: 'En ligne',
    public: 'Lieu public',
    any: 'Flexible',
};

export default function ArtistProfile({ artist, services, albums, stats }: ProfileProps) {
    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    return (
        <MainLayout>
            <Head title={`${artist.stage_name} - Profil Artiste`} />

            {/* Cover Image Placeholder */}
            <div className="h-48 md:h-80 w-full relative overflow-hidden bg-gradient-sunset">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>

            <div className="container max-w-7xl mx-auto px-4 md:px-6 relative -mt-16 md:-mt-24 pb-24 md:pb-12">
                {/* Header Profile */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
                    <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-background shadow-xl">
                        <AvatarImage src={artist.profile_photo} alt={artist.stage_name} className="object-cover" />
                        <AvatarFallback className="text-3xl">{artist.stage_name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2 mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground">
                                {artist.stage_name}
                            </h1>
                            {artist.is_verified && (
                                <Badge className="bg-primary text-primary-foreground">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    Vérifié
                                </Badge>
                            )}
                        </div>
                        <p className="text-lg text-muted-foreground">{artist.name}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {artist.city}
                            </div>
                            {artist.rating > 0 && (
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-primary fill-primary" />
                                    <span className="font-bold text-foreground">{artist.rating.toFixed(1)}</span>
                                    <span>({artist.total_reviews} avis)</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Music className="w-4 h-4" />
                                {stats.total_albums} album{stats.total_albums > 1 ? 's' : ''}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {artist.categories.map((category) => (
                                <Badge key={category} variant="secondary" className="capitalize">
                                    {category}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button className="flex-1 md:flex-none bg-primary hover:bg-primary/90">
                            Réserver
                        </Button>
                        <Button variant="outline" size="icon">
                            <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">{stats.total_services}</div>
                            <p className="text-xs text-muted-foreground">Services</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">{stats.total_albums}</div>
                            <p className="text-xs text-muted-foreground">Albums</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-primary">{formatNumber(stats.total_plays)}</div>
                            <p className="text-xs text-muted-foreground">Écoutes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">
                                {artist.base_rate.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">FCFA/prestation</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="bio" className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto">
                        <TabsTrigger value="bio">Biographie</TabsTrigger>
                        <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
                        <TabsTrigger value="albums">Albums ({albums.length})</TabsTrigger>
                        {artist.portfolio_urls.length > 0 && (
                            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                        )}
                    </TabsList>

                    {/* Bio Tab */}
                    <TabsContent value="bio" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>À propos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
                                    {artist.bio || "Cet artiste n'a pas encore ajouté de biographie."}
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Services Tab */}
                    <TabsContent value="services" className="mt-6">
                        {services.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {services.map((service) => (
                                    <Card key={service.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex justify-between items-start gap-4">
                                                <CardTitle className="text-lg">{service.title}</CardTitle>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-primary">
                                                        {service.price.toLocaleString()} FCFA
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                {service.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {service.duration_minutes} min
                                                </div>
                                                <Badge variant="outline" className="capitalize">
                                                    {locationTypes[service.location_type] || service.location_type}
                                                </Badge>
                                            </div>
                                            <Link href={`/service/${service.id}`}>
                                                <Button className="w-full" variant="outline">
                                                    Voir détails
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="pt-6 text-center text-muted-foreground">
                                    Aucun service disponible pour le moment.
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Albums Tab */}
                    <TabsContent value="albums" className="mt-6">
                        {albums.length > 0 ? (
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
                                            <Badge className="absolute top-2 right-2 bg-black/70 text-white border-none text-xs">
                                                {album.tracks_count} titres
                                            </Badge>
                                        </div>
                                        <h3 className="font-semibold text-sm truncate text-foreground">{album.title}</h3>
                                        <p className="text-xs text-muted-foreground">{album.year}</p>
                                        <div className="flex items-center gap-1 text-xs text-primary mt-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {formatNumber(album.total_plays)} écoutes
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="pt-6 text-center text-muted-foreground">
                                    Aucun album disponible pour le moment.
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Portfolio Tab */}
                    {artist.portfolio_urls.length > 0 && (
                        <TabsContent value="portfolio" className="mt-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {artist.portfolio_urls.map((url, index) => (
                                    <div
                                        key={index}
                                        className="aspect-square rounded-lg overflow-hidden bg-muted relative group cursor-pointer"
                                    >
                                        <img
                                            src={url}
                                            alt={`Portfolio ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </MainLayout>
    );
}
