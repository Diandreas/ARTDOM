import { Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star, MapPin, Mic, Disc, Music, Palette, Camera, Users, Play, Heart } from 'lucide-react';

interface Artist {
    id: string;
    name: string;
    stage_name: string;
    city: string;
    profile_photo: string;
    categories: string[];
    rating: number;
    total_reviews: number;
    services_count: number;
    is_verified: boolean;
}

interface Album {
    id: string;
    title: string;
    cover_url: string;
    genre: string;
    year: number;
    price: number;
    artist: {
        id: string;
        name: string;
        stage_name: string;
    };
}

interface Category {
    key: string;
    label: string;
    icon: string;
}

interface HomeProps {
    featuredArtists: Artist[];
    recentAlbums: Album[];
    categories: Category[];
}

const categoryIcons: Record<string, any> = {
    mic: Mic,
    disc: Disc,
    dance: Users,
    guitar: Music,
    palette: Palette,
    camera: Camera,
};

export default function Home({ featuredArtists, recentAlbums, categories }: HomeProps) {
    return (
        <MainLayout>
            <div className="pb-20 md:pb-0">
                {/* Stories Section */}
                <section className="bg-gradient-earth py-6 px-4 border-b border-border/40">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                            {featuredArtists.slice(0, 8).map((artist) => (
                                <Link
                                    key={artist.id}
                                    href={`/artist/${artist.id}`}
                                    className="flex flex-col items-center gap-2 flex-shrink-0 group"
                                >
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full bg-gradient-sunset p-[2px]">
                                            <div className="w-full h-full rounded-full border-2 border-background overflow-hidden">
                                                <img
                                                    src={artist.profile_photo}
                                                    alt={artist.stage_name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        </div>
                                        {artist.is_verified && (
                                            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                                                <Star className="w-3 h-3 text-primary-foreground fill-current" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs text-center max-w-[80px] truncate text-foreground/90">
                                        {artist.stage_name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Promotional Banner */}
                <section className="py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-sunset p-8 md:p-12 text-white">
                            <div className="relative z-10 max-w-2xl">
                                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                                    Découvrez les talents de Côte d'Ivoire
                                </h2>
                                <p className="text-lg mb-6 text-white/90">
                                    Réservez vos artistes préférés pour vos événements. Musique, danse, art et plus encore.
                                </p>
                                <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                                    Explorer les artistes
                                </Button>
                            </div>
                            <div className="absolute -right-12 -bottom-12 opacity-20">
                                <Mic className="w-64 h-64" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Grid */}
                <section className="py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold font-heading mb-6 text-foreground">
                            Catégories
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categories.map((category) => {
                                const IconComponent = categoryIcons[category.icon];
                                return (
                                    <Link
                                        key={category.key}
                                        href={`/artists?category=${category.key}`}
                                        className="group"
                                    >
                                        <Card className="hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer h-full">
                                            <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    {IconComponent && (
                                                        <IconComponent className="w-6 h-6 text-primary" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-center text-foreground">
                                                    {category.label}
                                                </span>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Featured Artists Carousel */}
                <section className="py-8 px-4 bg-muted/30">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold font-heading text-foreground">
                                Artistes en vedette
                            </h2>
                            <Link href="/artists" className="text-primary text-sm font-medium hover:underline">
                                Voir tout
                            </Link>
                        </div>

                        <Carousel
                            opts={{
                                align: 'start',
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent>
                                {featuredArtists.map((artist) => (
                                    <CarouselItem key={artist.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                        <Link href={`/artist/${artist.id}`}>
                                            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
                                                <div className="aspect-square relative overflow-hidden bg-muted">
                                                    <img
                                                        src={artist.profile_photo}
                                                        alt={artist.stage_name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                    {artist.is_verified && (
                                                        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground border-none">
                                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                                            Vérifié
                                                        </Badge>
                                                    )}
                                                    <div className="absolute bottom-3 left-3 right-3">
                                                        <h3 className="text-white font-bold text-lg mb-1">
                                                            {artist.stage_name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-white/90 text-sm">
                                                            <MapPin className="w-3 h-3" />
                                                            <span>{artist.city}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <CardContent className="p-4">
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {artist.categories.slice(0, 2).map((cat) => (
                                                            <Badge key={cat} variant="secondary" className="text-xs">
                                                                {cat}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-1 text-primary">
                                                            <Star className="w-4 h-4 fill-current" />
                                                            <span className="font-medium">{artist.rating.toFixed(1)}</span>
                                                            <span className="text-muted-foreground">({artist.total_reviews})</span>
                                                        </div>
                                                        <span className="text-muted-foreground">
                                                            {artist.services_count} service{artist.services_count > 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex -left-4 bg-background border-border hover:bg-muted" />
                            <CarouselNext className="hidden md:flex -right-4 bg-background border-border hover:bg-muted" />
                        </Carousel>
                    </div>
                </section>

                {/* Recent Albums Carousel */}
                <section className="py-8 px-4">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold font-heading text-foreground">
                                Nouveautés musique
                            </h2>
                            <Link href="/artstream" className="text-primary text-sm font-medium hover:underline">
                                Voir tout
                            </Link>
                        </div>

                        <Carousel
                            opts={{
                                align: 'start',
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent>
                                {recentAlbums.map((album) => (
                                    <CarouselItem key={album.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                        <div className="group cursor-pointer">
                                            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted mb-3">
                                                <img
                                                    src={album.cover_url}
                                                    alt={album.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                                    <Button
                                                        size="icon"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full bg-primary hover:bg-primary/90 scale-0 group-hover:scale-100"
                                                    >
                                                        <Play className="w-5 h-5 fill-current" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-sm mb-1 truncate text-foreground">
                                                {album.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {album.artist.stage_name}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {album.genre}
                                                </Badge>
                                                <span className="text-xs text-primary font-medium">
                                                    {album.price.toLocaleString()} FCFA
                                                </span>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex -left-4 bg-background border-border hover:bg-muted" />
                            <CarouselNext className="hidden md:flex -right-4 bg-background border-border hover:bg-muted" />
                        </Carousel>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
