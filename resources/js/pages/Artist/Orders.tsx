import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, User, Package, ChevronRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Client {
    id: string;
    clientProfile?: {
        avatar?: string;
    };
    name: string;
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
    client: Client;
}

interface OrdersProps {
    pending: Reservation[];
    confirmed: Reservation[];
    completed: Reservation[];
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Nouvelle demande', variant: 'secondary' },
    confirmed: { label: 'Confirmée', variant: 'default' },
    in_progress: { label: 'En cours', variant: 'default' },
    completed: { label: 'Terminée', variant: 'outline' },
    cancelled: { label: 'Annulée', variant: 'destructive' },
};

export default function ArtistOrders({ pending, confirmed, completed }: OrdersProps) {
    const renderReservationCard = (reservation: Reservation) => (
        <Card key={reservation.id} className="hover:shadow-md transition-shadow mb-4">
            <CardContent className="p-6">
                <div className="flex gap-4">
                    <div className="flex-shrink-0">
                        {reservation.client.clientProfile?.avatar ? (
                            <img
                                src={reservation.client.clientProfile.avatar}
                                alt={reservation.client.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <User className="w-8 h-8 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-semibold text-lg text-foreground truncate">
                                    {reservation.service.title}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate">
                                    Client: {reservation.client.name}
                                </p>
                            </div>
                            <Badge variant={statusLabels[reservation.status]?.variant || 'outline'}>
                                {statusLabels[reservation.status]?.label || reservation.status}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm mb-3 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {format(parseISO(reservation.scheduled_at), 'd MMM yyyy', { locale: fr })}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {format(parseISO(reservation.scheduled_at), 'HH:mm')}
                            </div>
                            <div className="font-medium text-foreground">
                                {reservation.total_amount.toLocaleString('fr-FR')} FCFA
                            </div>
                        </div>

                        <div className="flex justify-end mt-2">
                            <Link href={route('artist.orders.show', reservation.id)}>
                                <Button variant="outline" size="sm" className="gap-2">
                                    Gérer la commande
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <MainLayout>
            <Head title="Mes Commandes - Espace Artiste" />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-heading mb-2 text-foreground">Mes Commandes</h1>
                    <p className="text-muted-foreground">Gérez vos demandes de prestations et votre agenda</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-primary">{pending.length}</div>
                            <p className="text-xs text-muted-foreground">Nouvelles demandes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">{confirmed.length}</div>
                            <p className="text-xs text-muted-foreground">Confirmées</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-muted-foreground">{completed.length}</div>
                            <p className="text-xs text-muted-foreground">Terminées</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="pending">
                            En attente
                            {pending.length > 0 && (
                                <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                                    {pending.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
                        <TabsTrigger value="completed">Historique</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="mt-0">
                        {pending.length === 0 ? (
                            <Card>
                                <CardContent className="pt-12 pb-12 text-center">
                                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">Vous n'avez aucune nouvelle demande pour le moment.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {pending.map(renderReservationCard)}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="confirmed" className="mt-0">
                        {confirmed.length === 0 ? (
                            <Card>
                                <CardContent className="pt-12 pb-12 text-center">
                                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">Aucune prestation confirmée en attente de réalisation.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {confirmed.map(renderReservationCard)}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="completed" className="mt-0">
                        {completed.length === 0 ? (
                            <Card>
                                <CardContent className="pt-12 pb-12 text-center">
                                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">Votre historique est vide.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {completed.map(renderReservationCard)}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
