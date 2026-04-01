import { Head, Link, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, User, Package, Search } from 'lucide-react';
import { useState } from 'react';
import {
    index,
    show,
} from '@/actions/App/Http/Controllers/Client/ReservationController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';

interface Stats {
    upcoming: number;
    past: number;
    cancelled: number;
}

interface Artist {
    id: string;
    stage_name: string;
    profile_photo: string | null;
}

interface Service {
    id: string;
    title: string;
}

interface Reservation {
    id: string;
    reservation_number: string;
    status: string;
    scheduled_at: string;
    total_amount: number;
    service: Service;
    artist: Artist;
}

interface Filters {
    status?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
}

interface ReservationsProps {
    reservations: Reservation[];
    stats: Stats;
    filters: Filters;
}

export default function ClientReservations({
    reservations,
    stats,
    filters,
}: ReservationsProps) {
    const { t, dateLocale } = useAppLocale();
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const statusLabels: Record<
        string,
        {
            label: string;
            variant: 'default' | 'secondary' | 'destructive' | 'outline';
        }
    > = {
        pending: { label: t('Pending'), variant: 'secondary' },
        confirmed: { label: t('Confirmed'), variant: 'default' },
        completed: { label: t('Completed'), variant: 'outline' },
        cancelled: { label: t('Cancelled'), variant: 'destructive' },
    };

    const handleTabChange = (value: string) => {
        router.get(
            index.url({ status: value === 'all' ? undefined : value }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            index.url({ ...filters, search: searchQuery }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };
    return (
        <MainLayout>
            <Head title={t('My reservations')} />

            <div className="container mx-auto max-w-7xl px-4 py-8 pb-24 md:px-6 md:pb-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-heading mb-2 text-3xl font-bold text-foreground">
                        {t('My reservations')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('Manage your reservations and track their status')}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-primary">
                                {stats.upcoming}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('Upcoming')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">
                                {stats.past}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('Completed')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-muted-foreground">
                                {stats.cancelled}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('Cancelled')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={t('Search by reservation number...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </form>

                {/* Tabs */}
                <Tabs
                    value={filters.status || 'all'}
                    onValueChange={handleTabChange}
                    className="w-full"
                >
                    <TabsList className="mb-6">
                        <TabsTrigger value="all">{t('All')}</TabsTrigger>
                        <TabsTrigger value="upcoming">
                            {t('Upcoming')}
                        </TabsTrigger>
                        <TabsTrigger value="past">{t('Completed')}</TabsTrigger>
                        <TabsTrigger value="cancelled">
                            {t('Cancelled')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value={filters.status || 'all'}
                        className="mt-0"
                    >
                        {reservations.length === 0 ? (
                            <Card>
                                <CardContent className="pt-12 pb-12 text-center">
                                    <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                                        {t('No reservations')}
                                    </h3>
                                    <p className="mb-6 text-muted-foreground">
                                        {filters.status === 'upcoming' &&
                                            t(
                                                'You have no upcoming reservations.',
                                            )}
                                        {filters.status === 'past' &&
                                            t(
                                                'You have no completed reservations.',
                                            )}
                                        {filters.status === 'cancelled' &&
                                            t(
                                                'You have no cancelled reservations.',
                                            )}
                                        {!filters.status &&
                                            t(
                                                'You have not made any reservations yet.',
                                            )}
                                    </p>
                                    <Link href="/artists">
                                        <Button>{t('Discover artists')}</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {reservations.map((reservation) => (
                                    <Card
                                        key={reservation.id}
                                        className="transition-shadow hover:shadow-lg"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex gap-4">
                                                {/* Artist Photo */}
                                                <div className="flex-shrink-0">
                                                    {reservation.artist
                                                        .profile_photo ? (
                                                        <img
                                                            src={
                                                                reservation
                                                                    .artist
                                                                    .profile_photo
                                                            }
                                                            alt={
                                                                reservation
                                                                    .artist
                                                                    .stage_name
                                                            }
                                                            className="h-20 w-20 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                                                            <User className="h-8 w-8 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Reservation Info */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-2 flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-foreground">
                                                                {
                                                                    reservation
                                                                        .service
                                                                        .title
                                                                }
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {t('with')}{' '}
                                                                {
                                                                    reservation
                                                                        .artist
                                                                        .stage_name
                                                                }
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                statusLabels[
                                                                    reservation
                                                                        .status
                                                                ]?.variant ||
                                                                'outline'
                                                            }
                                                        >
                                                            {statusLabels[
                                                                reservation
                                                                    .status
                                                            ]?.label ||
                                                                reservation.status}
                                                        </Badge>
                                                    </div>

                                                    <div className="mb-3 grid gap-2 text-sm sm:grid-cols-2">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Calendar className="h-4 w-4" />
                                                            {format(
                                                                parseISO(
                                                                    reservation.scheduled_at,
                                                                ),
                                                                'd MMM yyyy',
                                                                {
                                                                    locale: dateLocale,
                                                                },
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Clock className="h-4 w-4" />
                                                            {format(
                                                                parseISO(
                                                                    reservation.scheduled_at,
                                                                ),
                                                                'HH:mm',
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="text-lg font-bold text-primary">
                                                            {reservation.total_amount.toLocaleString(
                                                                'fr-FR',
                                                            )}{' '}
                                                            FCFA
                                                        </div>
                                                        <Link
                                                            href={show.url(
                                                                reservation.id,
                                                            )}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                {t(
                                                                    'View details',
                                                                )}
                                                            </Button>
                                                        </Link>
                                                    </div>

                                                    <div className="mt-2 text-xs text-muted-foreground">
                                                        {t('No.')}{' '}
                                                        {
                                                            reservation.reservation_number
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="cancelled" className="mt-0">
                        <Card>
                            <CardContent className="pt-12 pb-12 text-center">
                                <p className="text-muted-foreground">
                                    {t('No cancelled reservations')}
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
