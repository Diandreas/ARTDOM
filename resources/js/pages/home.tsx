import { Link } from '@inertiajs/react';
import React from 'react';
import {
    Star,
    MapPin,
    Mic,
    Play,
    Zap,
    Trophy,
    Flame,
    Crown,
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
    level: string;
}

interface Album {
    id: string;
    title: string;
    cover_url: string;
    genre: string;
    year: number;
    price: number;
    ai_type?: 'human' | 'partial_ai' | 'full_ai';
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

interface Slide {
    id: number;
    title: string | null;
    subtitle: string | null;
    image_url: string;
    link_url: string | null;
    link_label: string | null;
}

interface HeroSectionItem {
    id: number;
    media_type: 'image' | 'video_upload' | 'video_youtube' | 'artist';
    title: string | null;
    subtitle: string | null;
    image_url: string | null;
    video_url: string | null;
    youtube_url: string | null;
    link_url: string | null;
    link_label: string | null;
    artist: {
        id: string;
        stage_name: string;
        profile_photo: string;
        level: string;
        is_verified: boolean;
    } | null;
}

interface HeroSettings {
    type: 'image' | 'carousel' | 'video';
    title: string | null;
    subtitle: string | null;
    image_url: string | null;
    video_url: string | null;
    link_url: string | null;
    link_label: string | null;
    is_active: boolean;
}

interface HomeProps {
    featuredArtists: Artist[];
    recentAlbums: Album[];
    carouselSlides: Slide[];
    heroSlides: Slide[];
    heroSettings: HeroSettings;
    heroSections: HeroSectionItem[];
}

function ArtistLevelBadge({ level, className = '' }: { level: string; className?: string }) {
    if (level === 'featured') {
        return (
            <Badge className={`border-none bg-purple-600 text-[10px] text-white hover:bg-purple-700 ${className}`}>
                <Crown className="mr-1 h-3 w-3" />
                Star
            </Badge>
        );
    }
    if (level === 'breakout' || level === 'emerging_star') {
        return (
            <Badge className={`border-none bg-orange-500 text-[10px] text-white hover:bg-orange-600 ${className}`}>
                <Trophy className="mr-1 h-3 w-3" />
                Breakout
            </Badge>
        );
    }
    if (level === 'rising' || level === 'rising_star') {
        return (
            <Badge variant="secondary" className={`text-[10px] ${className}`}>
                <Flame className="mr-1 h-3 w-3 fill-current" />
                Rising
            </Badge>
        );
    }
    if (level === 'emerging') {
        return (
            <Badge variant="secondary" className={`text-[10px] ${className}`}>
                <Zap className="mr-1 h-3 w-3 fill-current" />
                Emerging
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className={`border-white/20 bg-black/50 text-[10px] text-white ${className}`}>
            Talent
        </Badge>
    );
}

function getYoutubeEmbedUrl(url: string): string {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=0` : '';
}

export default function Home({
    featuredArtists,
    recentAlbums,
    carouselSlides,
    heroSlides,
    heroSettings,
    heroSections,
}: HomeProps) {
    const { t } = useAppLocale();

    const renderHero = () => {
        if (!heroSettings.is_active) return null;

        if (heroSettings.type === 'carousel' && heroSlides.length > 0) {
            return (
                <section className="px-4 py-4 md:py-8">
                    <div className="container mx-auto max-w-7xl">
                        <Carousel
                            opts={{ loop: true }}
                            className="w-full overflow-hidden rounded-2xl"
                        >
                            <CarouselContent>
                                {heroSlides.map((slide) => (
                                    <CarouselItem key={slide.id}>
                                        <div className="relative h-[240px] w-full md:h-[460px]">
                                            <img
                                                src={slide.image_url}
                                                alt={slide.title || ''}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                            <div className="relative z-10 flex h-full flex-col justify-end p-4 text-white md:p-12">
                                                <h2 className="font-heading mb-2 text-xl font-bold leading-tight md:mb-4 md:text-5xl">
                                                    {slide.title}
                                                </h2>
                                                {slide.subtitle && (
                                                    <p className="mb-3 hidden max-w-2xl text-sm text-white/90 md:mb-6 md:block md:text-lg">
                                                        {slide.subtitle}
                                                    </p>
                                                )}
                                                {slide.link_url && (
                                                    <div className="flex gap-4">
                                                        <Button
                                                            size="sm"
                                                            className="h-8 bg-primary px-4 text-xs text-primary-foreground hover:bg-primary/90 md:h-11 md:px-6 md:text-base"
                                                            asChild
                                                        >
                                                            <Link href={slide.link_url}>
                                                                {slide.link_label || t('Discover')}
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-4 bg-black/20 text-white border-none hover:bg-black/40" />
                            <CarouselNext className="right-4 bg-black/20 text-white border-none hover:bg-black/40" />
                        </Carousel>
                    </div>
                </section>
            );
        }

        return (
            <section className="px-4 py-4 md:py-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="bg-gradient-sunset relative overflow-hidden rounded-2xl p-5 text-white md:p-12 min-h-[180px] md:min-h-[300px] flex items-center">
                        {heroSettings.type === 'image' && heroSettings.image_url && (
                            <img
                                src={heroSettings.image_url}
                                alt="Hero"
                                className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-overlay"
                            />
                        )}
                        
                        {heroSettings.type === 'video' && heroSettings.video_url && (
                            <video
                                src={heroSettings.video_url}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-overlay"
                            />
                        )}

                        <div className="relative z-10 max-w-2xl">
                            <h2 className="font-heading mb-2 text-2xl font-bold leading-tight md:mb-4 md:text-5xl">
                                {heroSettings.title || t("Discover talents from Cote d'Ivoire")}
                            </h2>
                            <p className="mb-4 text-sm text-white/90 md:mb-6 md:text-lg">
                                {heroSettings.subtitle || t('Book your favorite artists for your events.')}
                            </p>
                            {heroSettings.link_url && (
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="bg-background text-foreground hover:bg-background/90"
                                    asChild
                                >
                                    <Link href={heroSettings.link_url}>
                                        {heroSettings.link_label || t('Explore artists')}
                                    </Link>
                                </Button>
                            )}
                        </div>
                        
                        {heroSettings.type === 'image' && !heroSettings.image_url && (
                            <div className="absolute -right-12 -bottom-12 opacity-20">
                                <Mic className="h-64 w-64" />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    };

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

                {/* Hero / Promotional Section */}
                {renderHero()}

                {/* Hero Sections Carousel (multi-sections personnalisées) */}
                {heroSections.length > 0 && (
                    <section className="px-4 py-4 md:py-6">
                        <div className="container mx-auto max-w-7xl">
                            <Carousel opts={{ loop: true, align: 'start' }} className="w-full overflow-hidden rounded-2xl">
                                <CarouselContent>
                                    {heroSections.map((section) => (
                                        <CarouselItem key={section.id}>
                                            <div className="relative h-[220px] w-full overflow-hidden rounded-2xl md:h-[420px]">
                                                {/* Background media */}
                                                {section.media_type === 'image' && section.image_url && (
                                                    <img
                                                        src={section.image_url}
                                                        alt={section.title || ''}
                                                        className="absolute inset-0 h-full w-full object-cover"
                                                    />
                                                )}
                                                {section.media_type === 'video_upload' && section.video_url && (
                                                    <video
                                                        src={section.video_url}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="absolute inset-0 h-full w-full object-cover"
                                                    />
                                                )}
                                                {section.media_type === 'video_youtube' && section.youtube_url && (
                                                    <iframe
                                                        src={getYoutubeEmbedUrl(section.youtube_url)}
                                                        className="absolute inset-0 h-full w-full scale-105"
                                                        allow="autoplay; encrypted-media"
                                                        allowFullScreen
                                                        title={section.title || 'Hero video'}
                                                    />
                                                )}
                                                {section.media_type === 'artist' && section.artist && (
                                                    <img
                                                        src={section.image_url || section.artist.profile_photo}
                                                        alt={section.artist.stage_name}
                                                        className="absolute inset-0 h-full w-full object-cover"
                                                    />
                                                )}
                                                {/* Fallback gradient */}
                                                {!section.image_url && !section.video_url && !section.youtube_url && !(section.media_type === 'artist' && section.artist?.profile_photo) && (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/60" />
                                                )}

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white md:p-12">
                                                    {section.media_type === 'artist' && section.artist && (
                                                        <ArtistLevelBadge level={section.artist.level} className="mb-2 w-fit" />
                                                    )}
                                                    {section.title && (
                                                        <h2 className="font-heading mb-2 text-xl font-bold leading-tight md:mb-3 md:text-4xl">
                                                            {section.title}
                                                        </h2>
                                                    )}
                                                    {section.subtitle && (
                                                        <p className="mb-3 hidden max-w-2xl text-sm text-white/90 md:block md:text-base">
                                                            {section.subtitle}
                                                        </p>
                                                    )}
                                                    {section.link_url && (
                                                        <Link href={section.link_url}>
                                                            <Button size="sm" className="h-8 bg-primary px-4 text-xs text-primary-foreground hover:bg-primary/90 md:h-10 md:px-6 md:text-sm">
                                                                {section.link_label || t('Discover')}
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {section.media_type === 'artist' && section.artist && !section.link_url && (
                                                        <Link href={`/artist/${section.artist.id}`}>
                                                            <Button size="sm" className="h-8 bg-primary px-4 text-xs text-primary-foreground hover:bg-primary/90 md:h-10 md:px-6 md:text-sm">
                                                                {t('View profile')}
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-4 border-none bg-black/20 text-white hover:bg-black/40" />
                                <CarouselNext className="right-4 border-none bg-black/20 text-white hover:bg-black/40" />
                            </Carousel>
                        </div>
                    </section>
                )}

                {/* Main Carousel (Featured/Custom) */}
                {carouselSlides.length > 0 && (
                    <section className="bg-muted/30 px-4 py-8">
                        <div className="container mx-auto max-w-7xl">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="font-heading text-2xl font-bold text-foreground">
                                    {t('Recommended for you')}
                                </h2>
                            </div>

                            <Carousel
                                opts={{
                                    align: 'start',
                                    loop: true,
                                }}
                                className="w-full"
                            >
                                <CarouselContent>
                                    {carouselSlides.map((slide) => (
                                        <CarouselItem
                                            key={slide.id}
                                            className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                                        >
                                            <Link href={slide.link_url || '#'}>
                                                <Card className="group cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                                                    <div className="relative aspect-video overflow-hidden bg-muted">
                                                        <img
                                                            src={slide.image_url}
                                                            alt={slide.title || ''}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                        <div className="absolute right-3 bottom-3 left-3">
                                                            <h3 className="mb-1 text-lg font-bold text-white">
                                                                {t(slide.title || '')}
                                                            </h3>
                                                            {slide.subtitle && (
                                                                <p className="text-sm text-white/90">
                                                                    {t(slide.subtitle)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
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
                )}

                {/* Featured Artists Grid (Original) */}
                {(() => {
                    const levelOrder = ['featured', 'breakout', 'emerging_star', 'rising', 'rising_star', 'emerging', 'talent'];
                    const levelConfig: Record<string, { label: string; icon: React.ReactNode; accent: string }> = {
                        featured:      { label: t('Star Artists'),    icon: <Crown className="h-5 w-5 text-purple-500" />,  accent: 'border-purple-500/30 bg-purple-500/5' },
                        breakout:      { label: t('Breakout Artists'), icon: <Trophy className="h-5 w-5 text-orange-500" />, accent: 'border-orange-500/30 bg-orange-500/5' },
                        emerging_star: { label: t('Breakout Artists'), icon: <Trophy className="h-5 w-5 text-orange-500" />, accent: 'border-orange-500/30 bg-orange-500/5' },
                        rising:        { label: t('Rising Artists'),   icon: <Flame className="h-5 w-5 text-red-400" />,    accent: 'border-red-400/30 bg-red-400/5' },
                        rising_star:   { label: t('Rising Artists'),   icon: <Flame className="h-5 w-5 text-red-400" />,    accent: 'border-red-400/30 bg-red-400/5' },
                        emerging:      { label: t('Emerging Artists'), icon: <Zap className="h-5 w-5 text-yellow-500" />,   accent: 'border-yellow-500/30 bg-yellow-500/5' },
                        talent:        { label: t('New Talents'),      icon: <Star className="h-5 w-5 text-primary" />,     accent: '' },
                    };

                    // Deduplicate level groups (breakout + emerging_star merge, rising + rising_star merge)
                    const canonicalLevels = ['featured', 'breakout', 'rising', 'emerging', 'talent'];
                    const levelAlias: Record<string, string> = { emerging_star: 'breakout', rising_star: 'rising' };

                    const grouped: Record<string, Artist[]> = {};
                    for (const artist of featuredArtists) {
                        const canonical = levelAlias[artist.level] ?? artist.level;
                        if (!grouped[canonical]) grouped[canonical] = [];
                        grouped[canonical].push(artist);
                    }

                    return canonicalLevels
                        .filter((lvl) => grouped[lvl]?.length > 0)
                        .map((lvl) => {
                            const cfg = levelConfig[lvl];
                            return (
                                <section key={lvl} className="px-4 py-8">
                                    <div className="container mx-auto max-w-7xl">
                                        <div className="mb-6 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {cfg.icon}
                                                <h2 className="font-heading text-2xl font-bold text-foreground">
                                                    {cfg.label}
                                                </h2>
                                            </div>
                                            <Link href="/artists" className="text-sm font-medium text-primary hover:underline">
                                                {t('See all')}
                                            </Link>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {grouped[lvl].map((artist) => (
                                                <Link key={artist.id} href={`/artist/${artist.id}`}>
                                                    <Card className={`group cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-xl border ${cfg.accent}`}>
                                                        <div className="relative aspect-square overflow-hidden bg-muted">
                                                            <img
                                                                src={artist.profile_photo}
                                                                alt={artist.stage_name}
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                                                <ArtistLevelBadge level={artist.level} />
                                                            </div>
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
                                                                    <span>{artist.city}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            );
                        });
                })()}

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
                                                    {album.ai_type && album.ai_type !== 'human' && (
                                                        <div className={`absolute bottom-1.5 left-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white ${album.ai_type === 'full_ai' ? 'bg-red-600/80' : 'bg-yellow-500/80'}`}>
                                                            {album.ai_type === 'full_ai' ? '🤖 IA' : '🤖 IA+'}
                                                        </div>
                                                    )}
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
