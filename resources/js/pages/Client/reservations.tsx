import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, User, Package } from 'lucide-react';

interface Stats {
    upcoming: number;
    past: number;
    cancelled: number;
}

interface ReservationsProps {
    reservations: any[];
    stats: Stats;
}

export default function ClientReservations({ reservations, stats }: ReservationsProps) {
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

                {/* Tabs */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="all">Toutes</TabsTrigger>
                        <TabsTrigger value="upcoming">À venir</TabsTrigger>
                        <TabsTrigger value="past">Terminées</TabsTrigger>
                        <TabsTrigger value="cancelled">Annulées</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-0">
                        {reservations.length === 0 ? (
                            <Card>
                                <CardContent className="pt-12 pb-12 text-center">
                                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                                        Aucune réservation
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Vous n'avez pas encore effectué de réservation.
                                    </p>
                                    <Link href="/artists">
                                        <Button>Découvrir les artistes</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {/* Liste des réservations ici */}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="upcoming" className="mt-0">
                        <Card>
                            <CardContent className="pt-12 pb-12 text-center">
                                <p className="text-muted-foreground">Aucune réservation à venir</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="past" className="mt-0">
                        <Card>
                            <CardContent className="pt-12 pb-12 text-center">
                                <p className="text-muted-foreground">Aucune réservation terminée</p>
                            </CardContent>
                        </Card>
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
