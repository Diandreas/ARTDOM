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
    User,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { index as albumsIndex } from '@/actions/App/Http/Controllers/Artist/AlbumUploadController';
import { DashboardSkeleton } from '@/components/Skeletons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppLocale } from '@/hooks/use-app-locale';
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

export default function ArtistDashboard({
    stats,
    services,
    albums,
    topAlbum,
    recentReservations,
    artistProfile,
}: DashboardProps) {
    const { t } = useAppLocale();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <MainLayout>
                <Head title={t('Dashboard')} />
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
            <Head title={t('Artist Dashboard')} />

            <div className="pb-24 md:pb-6">
                {/* Header Section */}
                <div className="bg-gradient-earth border-b border-border/40 px-4 py-4 md:py-8">
                    <div className="container mx-auto max-w-7xl">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                            <div>
                                <h1 className="font-heading flex items-center gap-2 text-xl font-bold text-foreground md:text-3xl">
                                    {artistProfile.stage_name}
                                    {artistProfile.is_verified && (
                                        <Badge className="bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                                            <Star className="mr-1 h-2.5 w-2.5 fill-current" />
                                            {t('Verified')}
                                        </Badge>
                                    )}
                                </h1>
                                <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">
                                    {(artistProfile.categories || []).join(
                                        ' • ',
                                    )}
                                </p>
                            </div>
                            {/* Mobile: icon-only buttons in a row */}
                            <div className="flex gap-2 md:gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1.5 px-2 text-xs md:h-10 md:px-4 md:text-sm"
                                    asChild
                                >
                                    <Link href="/artist/profile">
                                        <Edit className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                        <span className="hidden sm:inline">
                                            {t('Edit profile')}
                                        </span>
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1.5 px-2 text-xs md:h-10 md:px-4 md:text-sm"
                                    asChild
                                >
                                    <Link href={albumsIndex.url()}>
                                        <Music className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                        <span className="hidden sm:inline">
                                            {t('My Albums')}
                                        </span>
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1.5 border-primary px-2 text-xs text-primary hover:bg-primary/10 md:h-10 md:px-4 md:text-sm"
                                    asChild
                                >
                                    <Link href="/artist/subscription">
                                        <Award className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                        <span className="hidden sm:inline">
                                            Premium
                                        </span>
                                    </Link>
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-8 gap-1.5 bg-primary px-2 text-xs hover:bg-primary/90 md:h-10 md:px-4 md:text-sm"
                                    asChild
                                >
                                    <Link href="/artist/wallet">
                                        <Wallet className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                        <span className="hidden sm:inline">
                                            {t('Wallet')}
                                        </span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <section className="px-4 py-4 md:py-8">
                    <div className="container mx-auto max-w-7xl">
                        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-1 md:px-6 md:pt-6 md:pb-2">
                                    <CardTitle className="text-xs font-medium md:text-sm">
                                        {t('Total earnings')}
                                    </CardTitle>
                                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground md:h-4 md:w-4" />
                                </CardHeader>
                                <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
                                    <div className="text-base font-bold text-foreground md:text-2xl">
                                        {(
                                            stats.total_earnings || 0
                                        ).toLocaleString()}
                                        <span className="ml-1 text-xs font-normal text-muted-foreground md:text-sm">
                                            FCFA
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-[10px] text-muted-foreground md:text-xs">
                                        {t('Cumulative')}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-1 md:px-6 md:pt-6 md:pb-2">
                                    <CardTitle className="text-xs font-medium md:text-sm">
                                        {t('This month')}
                                    </CardTitle>
                                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground md:h-4 md:w-4" />
                                </CardHeader>
                                <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
                                    <div className="text-base font-bold text-primary md:text-2xl">
                                        {(
                                            stats.monthly_earnings || 0
                                        ).toLocaleString()}
                                        <span className="ml-1 text-xs font-normal text-muted-foreground md:text-sm">
                                            FCFA
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-[10px] text-muted-foreground md:text-xs">
                                        {t('Current month')}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-1 md:px-6 md:pt-6 md:pb-2">
                                    <CardTitle className="text-xs font-medium md:text-sm">
                                        {t('Pending')}
                                    </CardTitle>
                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground md:h-4 md:w-4" />
                                </CardHeader>
                                <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
                                    <div className="text-base font-bold text-amber-500 md:text-2xl">
                                        {stats.pending_reservations || 0}
                                    </div>
                                    <p className="mt-0.5 text-[10px] text-muted-foreground md:text-xs">
                                        {t('Reservations')}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-1 md:px-6 md:pt-6 md:pb-2">
                                    <CardTitle className="text-xs font-medium md:text-sm">
                                        {t('Plays')}
                                    </CardTitle>
                                    <Play className="h-3.5 w-3.5 text-muted-foreground md:h-4 md:w-4" />
                                </CardHeader>
                                <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
                                    <div className="text-base font-bold text-foreground md:text-2xl">
                                        {formatNumber(stats.total_plays || 0)}
                                    </div>
                                    <p className="mt-0.5 text-[10px] text-muted-foreground md:text-xs">
                                        {t('Across your albums')}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Top Album */}
                {topAlbum && (
                    <section className="bg-muted/30 px-4 py-4 md:py-8">
                        <div className="container mx-auto max-w-7xl">
                            <h2 className="font-heading mb-3 text-base font-bold text-foreground md:mb-6 md:text-2xl">
                                {t('Most played album')}
                            </h2>
                            <Card className="overflow-hidden">
                                <div className="flex flex-row">
                                    <div className="h-20 w-20 shrink-0 bg-muted md:h-48 md:w-48">
                                        <img
                                            src={topAlbum.cover_url}
                                            alt={topAlbum.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between p-3 md:p-6">
                                        <div>
                                            <h3 className="font-heading line-clamp-1 text-base font-bold text-foreground md:text-2xl">
                                                {topAlbum.title}
                                            </h3>
                                            <p className="mt-0.5 text-xs text-muted-foreground md:text-base">
                                                {topAlbum.year}
                                            </p>
                                            <div className="mt-2 flex gap-3 text-xs md:mt-4 md:gap-4 md:text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        {t('Tracks')}:
                                                    </span>
                                                    <span className="ml-1 font-medium text-foreground">
                                                        {topAlbum.tracks_count}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        {t('Plays')}:
                                                    </span>
                                                    <span className="ml-1 font-medium text-primary">
                                                        {formatNumber(
                                                            topAlbum.total_plays,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="mt-2 h-8 w-fit gap-2 text-xs md:mt-4 md:h-10 md:text-sm"
                                        >
                                            <Play className="h-3 w-3 fill-current md:h-4 md:w-4" />
                                            {t('Listen')}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>
                )}

                {/* Recent Reservations */}
                <section className="px-4 py-4 md:py-8">
                    <div className="container mx-auto max-w-7xl">
                        <h2 className="font-heading mb-3 text-base font-bold text-foreground md:mb-6 md:text-2xl">
                            {t('Recent reservations')}
                        </h2>
                        <Card>
                            <CardContent className="p-0">
                                {recentReservations &&
                                recentReservations.length > 0 ? (
                                    <div className="divide-y">
                                        {recentReservations.map((res: any) => (
                                            <div
                                                key={res.id}
                                                className="flex items-center justify-between p-3 transition-colors hover:bg-muted/50 md:p-4"
                                            >
                                                <div className="flex min-w-0 items-center gap-2 md:gap-4">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 md:h-10 md:w-10">
                                                        <User className="h-4 w-4 text-primary md:h-5 md:w-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-semibold md:text-sm">
                                                            {res.client.name}
                                                        </p>
                                                        <p className="truncate text-[10px] text-muted-foreground md:text-xs">
                                                            {res.service.title}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2 md:gap-4">
                                                    <div className="xs:block hidden text-right">
                                                        <Badge
                                                            variant={
                                                                res.status ===
                                                                'pending'
                                                                    ? 'outline'
                                                                    : 'default'
                                                            }
                                                            className="text-[10px] capitalize md:text-xs"
                                                        >
                                                            {res.status}
                                                        </Badge>
                                                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                                                            {new Date(
                                                                res.created_at,
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-xs md:h-8 md:px-3"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/artist/orders/${res.id}`}
                                                        >
                                                            {t('Manage')}
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-sm text-muted-foreground md:py-12">
                                        {t('No reservations at the moment.')}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Services List */}
                <section className="px-4 py-4 md:py-8">
                    <div className="container mx-auto max-w-7xl">
                        <div className="mb-3 flex items-center justify-between md:mb-6">
                            <h2 className="font-heading text-base font-bold text-foreground md:text-2xl">
                                {t('My services')}
                            </h2>
                            <Button
                                size="sm"
                                className="h-8 gap-1.5 px-2 text-xs md:h-10 md:px-4 md:text-sm"
                                asChild
                            >
                                <Link href="/artist/services">
                                    <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                    <span className="hidden sm:inline">
                                        {t('New service')}
                                    </span>
                                    <span className="sm:hidden">
                                        {t('Add')}
                                    </span>
                                </Link>
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                            {(services || []).slice(0, 6).map((service) => (
                                <Card
                                    key={service.id}
                                    className="transition-shadow hover:shadow-lg"
                                >
                                    <CardHeader className="p-3 pb-1 md:p-6 md:pb-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="line-clamp-1 text-sm md:text-lg">
                                                {service.title}
                                            </CardTitle>
                                            <Badge
                                                variant={
                                                    service.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className={`shrink-0 text-[10px] md:text-xs ${service.is_active ? 'bg-green-600' : ''}`}
                                            >
                                                {service.is_active
                                                    ? t('Active')
                                                    : t('Inactive')}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-1 md:p-6 md:pt-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-base font-bold text-primary md:text-2xl">
                                                {service.price.toLocaleString()}
                                                <span className="ml-1 text-xs font-normal text-muted-foreground">
                                                    FCFA
                                                </span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 w-7 p-0 md:h-9 md:w-9"
                                            >
                                                <Edit className="h-3 w-3 md:h-4 md:w-4" />
                                            </Button>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="mt-2 text-[10px] capitalize md:text-xs"
                                        >
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
