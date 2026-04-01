import { Link } from '@inertiajs/react';
import {
    Star,
    MapPin,
    Mic,
    Disc,
    Music,
    Palette,
    Camera,
    Users,
    Play,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';

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

export default function Home({
    featuredArtists,
    recentAlbums,
    categories,
}: HomeProps) {
    const { t } = useAppLocale();

    return (
        <MainLayout>
            <div className="pb-20 md:pb-0">
                {/* Stories Section */}
                <section className="bg-gradient-earth border-b border-border/40 px-4 py-6">
                    <div className="container mx-auto max-w-7xl">
                        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
                            {featuredArtists.slice(0, 8).map((artist) => (
                                <Link
                                    key={artist.id}
                                    href={`/artist/${artist.id}`}
                                    className="group flex flex-shrink-0 flex-col items-center gap-2"
                                >
                                    <div className="relative">
                                        <div className="bg-gradient-sunset h-16 w-16 rounded-full p-[2px]">
                                            <div className="h-full w-full overflow-hidden rounded-full border-2 border-background">
                                                <img
                                                    src={artist.profile_photo}
                                                    alt={artist.stage_name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>
                                        </div>
                                        {artist.is_verified && (
                                            <div className="absolute -right-1 -bottom-1 rounded-full bg-primary p-1">
                                                <Star className="h-3 w-3 fill-current text-primary-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="max-w-[80px] truncate text-center text-xs text-foreground/90">
                                        {artist.stage_name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Promotional Banner */}
                <section className="px-4 py-8">
                    <div className="container mx-auto max-w-7xl">
                        <div className="bg-gradient-sunset relative overflow-hidden rounded-2xl p-8 text-white md:p-12">
                            <div className="relative z-10 max-w-2xl">
                                <h2 className="font-heading mb-4 text-3xl font-bold md:text-4xl">
                                    {t("Discover talents from Cote d'Ivoire")}
                                </h2>
                                <p className="mb-6 text-lg text-white/90">
                                    {t(
                                        'Book your favorite artists for your events. Music, dance, art and more.',
                                    )}
                                </p>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="bg-background text-foreground hover:bg-background/90"
                                    asChild
                                >
                                    <Link href="/artists">
                                        {t('Explore artists')}
                                    </Link>
                                </Button>
                            </div>
                            <div className="absolute -right-12 -bottom-12 opacity-20">
                                <Mic className="h-64 w-64" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Grid */}
                <section className="px-4 py-8">
                    <div className="container mx-auto max-w-7xl">
                        <h2 className="font-heading mb-6 text-2xl font-bold text-foreground">
                            {t('Categories')}
                        </h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                            {categories.map((category) => {
                                const IconComponent =
                                    categoryIcons[category.icon];
                                return (
                                    <Link
                                        key={category.key}
                                        href={`/artists?category=${category.key}`}
                                        className="group"
                                    >
                                        <Card className="h-full cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                                            <CardContent className="flex flex-col items-center justify-center gap-3 p-6">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                                                    {IconComponent && (
                                                        <IconComponent className="h-6 w-6 text-primary" />
                                                    )}
                                                </div>
                                                <span className="text-center text-sm font-medium text-foreground">
                                                    {t(category.label)}
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
                <section className="bg-muted/30 px-4 py-8">
                    <div className="container mx-auto max-w-7xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="font-heading text-2xl font-bold text-foreground">
                                {t('Featured artists')}
                            </h2>
                            <Link
                                href="/artists"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                {t('See all')}
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
                                    <CarouselItem
                                        key={artist.id}
                                        className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                                    >
                                        <Link href={`/artist/${artist.id}`}>
                                            <Card className="group cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                                                <div className="relative aspect-square overflow-hidden bg-muted">
                                                    <img
                                                        src={
                                                            artist.profile_photo
                                                        }
                                                        alt={artist.stage_name}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                    {artist.is_verified && (
                                                        <Badge className="absolute top-3 right-3 border-none bg-primary text-primary-foreground">
                                                            <Star className="mr-1 h-3 w-3 fill-current" />
                                                            {t('Verified')}
                                                        </Badge>
                                                    )}
                                                    <div className="absolute right-3 bottom-3 left-3">
                                                        <h3 className="mb-1 text-lg font-bold text-white">
                                                            {artist.stage_name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-sm text-white/90">
                                                            <MapPin className="h-3 w-3" />
                                                            <span>
                                                                {artist.city}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <CardContent className="p-4">
                                                    <div className="mb-3 flex flex-wrap gap-2">
                                                        {artist.categories
                                                            .slice(0, 2)
                                                            .map((cat) => (
                                                                <Badge
                                                                    key={cat}
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {cat}
                                                                </Badge>
                                                            ))}
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-1 text-primary">
                                                            <Star className="h-4 w-4 fill-current" />
                                                            <span className="font-medium">
                                                                {artist.rating.toFixed(
                                                                    1,
                                                                )}
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                (
                                                                {
                                                                    artist.total_reviews
                                                                }
                                                                )
                                                            </span>
                                                        </div>
                                                        <span className="text-muted-foreground">
                                                            {
                                                                artist.services_count
                                                            }{' '}
                                                            {artist.services_count >
                                                            1
                                                                ? t('services')
                                                                : t('service')}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-4 hidden border-border bg-background hover:bg-muted md:flex" />
                            <CarouselNext className="-right-4 hidden border-border bg-background hover:bg-muted md:flex" />
                        </Carousel>
                    </div>
                </section>

                {/* Recent Albums Carousel */}
                <section className="px-4 py-8">
                    <div className="container mx-auto max-w-7xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="font-heading text-2xl font-bold text-foreground">
                                {t('New music releases')}
                            </h2>
                            <Link
                                href="/artstream"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                {t('See all')}
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
                                    <CarouselItem
                                        key={album.id}
                                        className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                                    >
                                        <Link
                                            href={`/artstream/album/${album.id}`}
                                            className="block"
                                        >
                                            <div className="group cursor-pointer">
                                                <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
                                                    <img
                                                        src={album.cover_url}
                                                        alt={album.title}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
                                                        <Button
                                                            size="icon"
                                                            className="scale-0 rounded-full bg-primary opacity-0 transition-opacity duration-300 group-hover:scale-100 group-hover:opacity-100 hover:bg-primary/90"
                                                        >
                                                            <Play className="h-5 w-5 fill-current" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <h3 className="mb-1 truncate text-sm font-semibold text-foreground">
                                                    {album.title}
                                                </h3>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {album.artist.stage_name}
                                                </p>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {album.genre}
                                                    </Badge>
                                                    <span className="text-xs font-medium text-primary">
                                                        {album.price.toLocaleString()}{' '}
                                                        FCFA
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-4 hidden border-border bg-background hover:bg-muted md:flex" />
                            <CarouselNext className="-right-4 hidden border-border bg-background hover:bg-muted md:flex" />
                        </Carousel>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
