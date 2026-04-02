import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, User, Package, ChevronRight } from 'lucide-react';
import { show } from '@/actions/App/Http/Controllers/Artist/OrderController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppLocale } from '@/hooks/use-app-locale';
import MainLayout from '@/layouts/MainLayout';

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

export default function ArtistOrders({ pending, confirmed, completed }: OrdersProps) {
    const { t, dateLocale, locale } = useAppLocale();

    const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
        pending: { label: t('New request'), variant: 'secondary' },
        confirmed: { label: t('Confirmed'), variant: 'default' },
        in_progress: { label: t('In progress'), variant: 'default' },
        completed: { label: t('Completed'), variant: 'outline' },
        cancelled: { label: t('Cancelled'), variant: 'destructive' },
    };

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
                                    {t('Client')}: {reservation.client.name}
                                </p>
                            </div>
                            <Badge variant={statusLabels[reservation.status]?.variant || 'outline'}>
                                {statusLabels[reservation.status]?.label || reservation.status}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm mb-3 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {format(parseISO(reservation.scheduled_at), 'd MMM yyyy', { locale: dateLocale })}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {format(parseISO(reservation.scheduled_at), 'HH:mm')}
                            </div>
                            <div className="font-medium text-foreground">
                                {reservation.total_amount.toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR')} FCFA
                            </div>
                        </div>

                        <div className="flex justify-end mt-2">
                            <Link href={show.url(reservation.id)}>
                                <Button variant="outline" size="sm" className="gap-2">
                                    {t('Manage order')}
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
            <Head title={t('My Orders - Artist Space')} />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-heading mb-2 text-foreground">{t('My Orders')}</h1>
                    <p className="text-muted-foreground">{t('Manage your service requests and agenda')}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-primary">{pending.length}</div>
                            <p className="text-xs text-muted-foreground">{t('New requests')}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">{confirmed.length}</div>
                            <p className="text-xs text-muted-foreground">{t('Confirmed')}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-muted-foreground">{completed.length}</div>
                            <p className="text-xs text-muted-foreground">{t('Completed')}</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="pending">
                            {t('Pending')}
                            {pending.length > 0 && (
                                <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                                    {pending.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="confirmed">{t('Confirmed')}</TabsTrigger>
                        <TabsTrigger value="completed">{t('History')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="mt-0">
                        {pending.length === 0 ? (
                            <Card>
                                <CardContent className="pt-12 pb-12 text-center">
                                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">{t('You have no new requests at the moment.')}</p>
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
                                    <p className="text-muted-foreground">{t('No confirmed service is waiting to be delivered.')}</p>
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
                                    <p className="text-muted-foreground">{t('Your history is empty.')}</p>
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
