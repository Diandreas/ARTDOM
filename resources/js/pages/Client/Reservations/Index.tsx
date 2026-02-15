import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import ReservationCard from '@/components/Reservation/ReservationCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Reservation {
    id: string;
    reservation_number: string;
    status: string;
    scheduled_at: string;
    location: string;
    total_amount: number;
    artist: {
        id: string;
        name: string;
        stage_name: string;
        profile_photo_url: string;
        artist_profile: {
            city: string;
        };
    };
    service: {
        id: string;
        title: string;
    };
    has_unread_messages?: boolean;
}

interface ReservationsIndexProps {
    upcoming: Reservation[];
    past: Reservation[];
    cancelled: Reservation[];
}

export default function Index({ upcoming, past, cancelled }: ReservationsIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filterReservations = (reservations: Reservation[]) => {
        if (!searchQuery) return reservations;

        return reservations.filter(
            (res) =>
                res.reservation_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                res.artist.stage_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                res.service.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const EmptyState = ({ message }: { message: string }) => (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-center">{message}</p>
            </CardContent>
        </Card>
    );

    return (
        <MainLayout>
            <Head title="Mes Réservations" />

            <div className="container max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-heading text-foreground mb-2">
                        Mes Réservations
                    </h1>
                    <p className="text-muted-foreground">
                        Gérez vos réservations et suivez leur statut
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Rechercher par numéro, artiste ou service..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
                        <TabsTrigger value="upcoming" className="relative">
                            À venir
                            {upcoming.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                                    {upcoming.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="past">
                            Passées
                            {past.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                                    {past.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="cancelled">Annulées</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-4">
                        {filterReservations(upcoming).length > 0 ? (
                            filterReservations(upcoming).map((reservation) => (
                                <ReservationCard key={reservation.id} reservation={reservation} />
                            ))
                        ) : (
                            <EmptyState message="Aucune réservation à venir. Explorez nos artistes pour réserver votre prochaine prestation !" />
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-4">
                        {filterReservations(past).length > 0 ? (
                            filterReservations(past).map((reservation) => (
                                <ReservationCard key={reservation.id} reservation={reservation} />
                            ))
                        ) : (
                            <EmptyState message="Aucune réservation passée." />
                        )}
                    </TabsContent>

                    <TabsContent value="cancelled" className="space-y-4">
                        {filterReservations(cancelled).length > 0 ? (
                            filterReservations(cancelled).map((reservation) => (
                                <ReservationCard key={reservation.id} reservation={reservation} />
                            ))
                        ) : (
                            <EmptyState message="Aucune réservation annulée." />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
