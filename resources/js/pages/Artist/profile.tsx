import { Head, Link, router } from '@inertiajs/react';
import { Star, MapPin, Music, Clock, Play, TrendingUp, AlertTriangle, Zap, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';
import { report } from '@/manual-actions/ArtistReportController';

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
    level: string;
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
    auth: {
        user: {
            id: string;
            name: string;
            role: string;
        } | null;
    };
    artist: Artist;
    services: Service[];
    albums: Album[];
    stats: Stats;
    can_report?: boolean;
}

export default function ArtistProfile({ auth, artist, services, albums, stats, can_report = false }: ProfileProps) {
    const { t } = useAppLocale();
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [isReporting, setIsReporting] = useState(false);

    // Final can_report check
    const showReportButton = can_report || (auth.user?.role === 'client');

    const locationTypes: Record<string, string> = {
        home: t('At home'),
        online: t('Online'),
        public: t('Public place'),
        any: t('Flexible'),
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const handleReportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsReporting(true);
        router.post(report({ artist: artist.id }), {
            reason: reportReason,
        }, {
            onSuccess: () => {
                setIsReportDialogOpen(false);
                setReportReason('');
                setIsReporting(false);
            },
            onError: () => {
                setIsReporting(false);
            },
        });
    };

    return (
        <MainLayout>
            <Head title={`${artist.stage_name} - ${t('Artist Profile')}`} />

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
                            {artist.level === 'emerging_star' && (
                                <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none">
                                    <Trophy className="mr-1 h-3 w-3" />
                                    {t('Star en émergence')}
                                </Badge>
                            )}
                            {artist.level === 'rising_star' && (
                                <Badge variant="secondary">
                                    <Zap className="mr-1 h-3 w-3 fill-current" />
                                    {t('Artiste perçant')}
                                </Badge>
                            )}
                            {artist.level === 'talent' && (
                                <Badge variant="outline" className="bg-muted/50">
                                    {t('Talent')}
                                </Badge>
                            )}
                            {artist.is_verified && (
                                <Badge className="bg-primary text-primary-foreground">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    {t('Verified')}
                                </Badge>
                            )}
                        </div>
                        <p className="text-lg text-muted-foreground">{artist.name}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {artist.city}
                            </div>
                            <div className="flex items-center gap-1">
                                <Music className="w-4 h-4" />
                                {stats.total_albums} {stats.total_albums > 1 ? t('albums') : t('album')}
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
                        <Button className="flex-1 md:flex-none bg-primary hover:bg-primary/90" asChild>
                            <Link href={services.length > 0 ? `/service/${services[0].id}` : '#'}>
                                {t('Book')}
                            </Link>
                        </Button>

                        {showReportButton && (
                            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" className="gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        {t('Report')}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t('Report')} {artist.stage_name}</DialogTitle>
                                        <DialogDescription>
                                            {t('Please explain the reason for your report. An administrator will review your request.')}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleReportSubmit}>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="reason">{t('Reason for report')}</Label>
                                                <Textarea
                                                    id="reason"
                                                    placeholder={t('Describe the issue you encountered with this artist...')}
                                                    value={reportReason}
                                                    onChange={(e) => setReportReason(e.target.value)}
                                                    required
                                                    rows={5}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="ghost" onClick={() => setIsReportDialogOpen(false)}>
                                                {t('Cancel')}
                                            </Button>
                                            <Button type="submit" variant="destructive" disabled={isReporting || !reportReason.trim()}>
                                                {isReporting ? t('Sending...') : t('Send report')}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">{stats.total_services}</div>
                            <p className="text-xs text-muted-foreground">{t('Services')}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">{stats.total_albums}</div>
                            <p className="text-xs text-muted-foreground">{t('Albums')}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-primary">{formatNumber(stats.total_plays)}</div>
                            <p className="text-xs text-muted-foreground">{t('Plays')}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">
                                {artist.base_rate.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">FCFA/{t('service')}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="bio" className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto">
                        <TabsTrigger value="bio">{t('Biography')}</TabsTrigger>
                        <TabsTrigger value="services">{t('Services')} ({services.length})</TabsTrigger>
                        <TabsTrigger value="albums">{t('Albums')} ({albums.length})</TabsTrigger>
                        {artist.portfolio_urls.length > 0 && (
                            <TabsTrigger value="portfolio">{t('Portfolio')}</TabsTrigger>
                        )}
                    </TabsList>

                    {/* Bio Tab */}
                    <TabsContent value="bio" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('About')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
                                    {artist.bio || t('This artist has not added a biography yet.')}
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
                                                    {t('View details')}
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="pt-6 text-center text-muted-foreground">
                                    {t('No service available at the moment.')}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Albums Tab */}
                    <TabsContent value="albums" className="mt-6">
                        {albums.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {albums.map((album) => (
                                    <Link key={album.id} href={`/artstream/album/${album.id}`}>
                                        <div className="group cursor-pointer">
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
                                                    {album.tracks_count} {t('tracks')}
                                                </Badge>
                                            </div>
                                            <h3 className="font-semibold text-sm truncate text-foreground">{album.title}</h3>
                                            <p className="text-xs text-muted-foreground">{album.year}</p>
                                            <div className="flex items-center gap-1 text-xs text-primary mt-1">
                                                <TrendingUp className="w-3 h-3" />
                                                {formatNumber(album.total_plays)} {t('plays')}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="pt-6 text-center text-muted-foreground">
                                    {t('No album available at the moment.')}
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
