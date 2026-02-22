import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, MapPin, User, Package, Search } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

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

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'En attente', variant: 'secondary' },
    confirmed: { label: 'Confirmée', variant: 'default' },
    completed: { label: 'Terminée', variant: 'outline' },
    cancelled: { label: 'Annulée', variant: 'destructive' },
};

export default function ClientReservations({ reservations, stats, filters }: ReservationsProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleTabChange = (value: string) => {
        router.get(
            route('client.reservations.index'),
            { status: value === 'all' ? undefined : value },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('client.reservations.index'),
            { ...filters, search: searchQuery },
            { preserveState: true, preserveScroll: true }
        );
    };
    return (
        <MainLayout>
            <Head title="Mes Réservations" />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-heading mb-2 text-foreground">Mes Réservations</h1>
                    <p className="text-muted-foreground">Gérez vos réservations et suivez leur statut</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-primary">{stats.upcoming}</div>
                            <p className="text-xs text-muted-foreground">À venir</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">{stats.past}</div>
                            <p className="text-xs text-muted-foreground">Terminées</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-muted-foreground">{stats.cancelled}</div>
                            <p className="text-xs text-muted-foreground">Annulées</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Rechercher par numéro de réservation..."
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
                        <TabsTrigger value="all">Toutes</TabsTrigger>
                        <TabsTrigger value="upcoming">À venir</TabsTrigger>
                        <TabsTrigger value="past">Terminées</TabsTrigger>
                        <TabsTrigger value="cancelled">Annulées</TabsTrigger>
                    </TabsList>

                    <TabsContent value={filters.status || 'all'} className="mt-0">
                        {reservations.length === 0 ? (
                            <Card>
                                <CardContent className="pt-12 pb-12 text-center">
                                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                                        Aucune réservation
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        {filters.status === 'upcoming' && 'Vous n\'avez aucune réservation à venir.'}
                                        {filters.status === 'past' && 'Vous n\'avez aucune réservation terminée.'}
                                        {filters.status === 'cancelled' && 'Vous n\'avez aucune réservation annulée.'}
                                        {!filters.status && 'Vous n\'avez pas encore effectué de réservation.'}
                                    </p>
                                    <Link href="/artists">
                                        <Button>Découvrir les artistes</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {reservations.map((reservation) => (
                                    <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex gap-4">
                                                {/* Artist Photo */}
                                                <div className="flex-shrink-0">
                                                    {reservation.artist.profile_photo ? (
                                                        <img
                                                            src={reservation.artist.profile_photo}
                                                            alt={reservation.artist.stage_name}
                                                            className="w-20 h-20 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                                                            <User className="w-8 h-8 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Reservation Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-semibold text-lg text-foreground">
                                                                {reservation.service.title}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                avec {reservation.artist.stage_name}
                                                            </p>
                                                        </div>
                                                        <Badge variant={statusLabels[reservation.status]?.variant || 'outline'}>
                                                            {statusLabels[reservation.status]?.label || reservation.status}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid sm:grid-cols-2 gap-2 text-sm mb-3">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Calendar className="w-4 h-4" />
                                                            {format(parseISO(reservation.scheduled_at), 'd MMM yyyy', {
                                                                locale: fr,
                                                            })}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Clock className="w-4 h-4" />
                                                            {format(parseISO(reservation.scheduled_at), 'HH:mm')}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="text-lg font-bold text-primary">
                                                            {reservation.total_amount.toLocaleString('fr-FR')} FCFA
                                                        </div>
                                                        <Link href={route('client.reservations.show', reservation.id)}>
                                                            <Button variant="outline" size="sm">
                                                                Voir les détails
                                                            </Button>
                                                        </Link>
                                                    </div>

                                                    <div className="text-xs text-muted-foreground mt-2">
                                                        N° {reservation.reservation_number}
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
                                <p className="text-muted-foreground">Aucune réservation annulée</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
