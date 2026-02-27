import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Pagination<T> = {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type ReservationRow = {
    id: string;
    reservation_number?: string | null;
    client_id: string;
    client_name: string;
    artist_name?: string | null;
    service_title?: string | null;
    status: string;
    total_amount: number;
    created_at?: string | null;
    scheduled_at?: string | null;
};

type CartItemRow = {
    id: string;
    service_title?: string | null;
    quantity: number;
    unit_price: number;
    scheduled_at?: string | null;
};

type CartRow = {
    id: string;
    client_id: string;
    client_name: string;
    items_count: number;
    coupon_code?: string | null;
    discount: number;
    total_amount: number;
    updated_at?: string | null;
    items: CartItemRow[];
};

type SubscriptionRow = {
    id: string;
    client_id: string;
    client_name: string;
    plan: string;
    price: number;
    is_active: boolean;
    starts_at?: string | null;
    ends_at?: string | null;
    cancelled_at?: string | null;
    payment_status?: string | null;
    created_at?: string | null;
};

type ActivityRow = {
    type: string;
    title: string;
    description: string;
    client_id: string;
    occurred_at: string;
};

type ClientOption = {
    id: string;
    label: string;
};

type Props = {
    filters: {
        client_id: string;
        reservation_status: string;
        subscription_status: string;
    };
    clients: ClientOption[];
    reservations: Pagination<ReservationRow>;
    carts: Pagination<CartRow>;
    subscriptions: Pagination<SubscriptionRow>;
    activity: ActivityRow[];
    summary: {
        reservations_count: number;
        carts_count: number;
        subscriptions_count: number;
    };
};

const reservationStatuses = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'];

export default function ClientActivity({ filters, clients, reservations, carts, subscriptions, activity, summary }: Props) {
    const applyFilters = (next: Partial<Props['filters']>) => {
        router.get('/admin/client-activity', {
            client_id: next.client_id ?? filters.client_id,
            reservation_status: next.reservation_status ?? filters.reservation_status,
            subscription_status: next.subscription_status ?? filters.subscription_status,
        });
    };

    return (
        <AdminLayout title="Volet client" subtitle="Consultation globale des actions clients.">
            <Head title="Admin - Volet client" />

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Filtres</CardTitle>
                        <CardDescription>Filtrer par client, statut reservation et abonnement.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Client</Label>
                            <Select value={filters.client_id || 'all'} onValueChange={(value) => applyFilters({ client_id: value === 'all' ? '' : value })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous</SelectItem>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.id}>{client.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Statut reservation</Label>
                            <Select value={filters.reservation_status || 'all'} onValueChange={(value) => applyFilters({ reservation_status: value })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {reservationStatuses.map((status) => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Statut subscription</Label>
                            <Select value={filters.subscription_status || 'all'} onValueChange={(value) => applyFilters({ subscription_status: value })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">all</SelectItem>
                                    <SelectItem value="active">active</SelectItem>
                                    <SelectItem value="inactive">inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card><CardHeader className="pb-2"><CardDescription>Reservations</CardDescription><CardTitle>{summary.reservations_count}</CardTitle></CardHeader></Card>
                    <Card><CardHeader className="pb-2"><CardDescription>Paniers</CardDescription><CardTitle>{summary.carts_count}</CardTitle></CardHeader></Card>
                    <Card><CardHeader className="pb-2"><CardDescription>Abonnements</CardDescription><CardTitle>{summary.subscriptions_count}</CardTitle></CardHeader></Card>
                </div>

                <Tabs defaultValue="reservations" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="reservations">Reservations</TabsTrigger>
                        <TabsTrigger value="carts">Carts</TabsTrigger>
                        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                        <TabsTrigger value="actions">Actions client</TabsTrigger>
                    </TabsList>

                    <TabsContent value="reservations">
                        <Card>
                            <CardHeader><CardTitle>Toutes les reservations</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {reservations.data.map((reservation) => (
                                    <div key={reservation.id} className="rounded border p-3 text-sm">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-medium">{reservation.reservation_number || reservation.id}</p>
                                            <Badge variant="outline">{reservation.status}</Badge>
                                        </div>
                                        <p>Client: {reservation.client_name}</p>
                                        <p>Artiste: {reservation.artist_name || '-'}</p>
                                        <p>Service: {reservation.service_title || '-'}</p>
                                        <p>Montant: {Math.round(reservation.total_amount).toLocaleString()} FCFA</p>
                                    </div>
                                ))}
                                {reservations.data.length === 0 ? <p className="text-sm text-muted-foreground">Aucune reservation.</p> : null}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="carts">
                        <Card>
                            <CardHeader><CardTitle>Tous les carts</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                {carts.data.map((cart) => (
                                    <div key={cart.id} className="rounded border p-3 text-sm">
                                        <div className="mb-2 flex items-center justify-between">
                                            <p className="font-medium">Panier #{cart.id.slice(0, 8)}</p>
                                            <Badge variant="outline">{cart.items_count} item(s)</Badge>
                                        </div>
                                        <p>Client: {cart.client_name}</p>
                                        <p>Total: {Math.round(cart.total_amount).toLocaleString()} FCFA (reduction {Math.round(cart.discount).toLocaleString()} FCFA)</p>
                                        {cart.items.length > 0 ? (
                                            <div className="mt-2 space-y-1">
                                                {cart.items.map((item) => (
                                                    <p key={item.id} className="text-muted-foreground">- {item.service_title || 'Service'} x{item.quantity} ({Math.round(item.unit_price).toLocaleString()} FCFA)</p>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                                {carts.data.length === 0 ? <p className="text-sm text-muted-foreground">Aucun panier.</p> : null}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="subscriptions">
                        <Card>
                            <CardHeader><CardTitle>Toutes les subscriptions</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {subscriptions.data.map((subscription) => (
                                    <div key={subscription.id} className="rounded border p-3 text-sm">
                                        <div className="mb-1 flex items-center justify-between">
                                            <p className="font-medium">{subscription.plan}</p>
                                            <Badge variant={subscription.is_active ? 'secondary' : 'outline'}>{subscription.is_active ? 'active' : 'inactive'}</Badge>
                                        </div>
                                        <p>Client: {subscription.client_name}</p>
                                        <p>Prix: {Math.round(subscription.price).toLocaleString()} FCFA</p>
                                        <p>Paiement: {subscription.payment_status || '-'}</p>
                                    </div>
                                ))}
                                {subscriptions.data.length === 0 ? <p className="text-sm text-muted-foreground">Aucun abonnement.</p> : null}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="actions">
                        <Card>
                            <CardHeader><CardTitle>Actions client liees</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {activity.map((item, index) => (
                                    <div key={`${item.type}-${index}`} className="rounded border p-3 text-sm">
                                        <div className="mb-1 flex items-center justify-between">
                                            <p className="font-medium">{item.title}</p>
                                            <Badge variant="outline">{item.type}</Badge>
                                        </div>
                                        <p>{item.description}</p>
                                        <p className="text-muted-foreground">{new Date(item.occurred_at).toLocaleString()}</p>
                                    </div>
                                ))}
                                {activity.length === 0 ? <p className="text-sm text-muted-foreground">Aucune action client.</p> : null}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
