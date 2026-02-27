import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';

type UserPayload = {
    id: string;
    full_name: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    phone?: string | null;
    city?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    profile_photo?: string | null;
    type: string;
    status: string;
    stage_name?: string | null;
    email_verified: boolean;
    created_at?: string | null;
    last_connection_at?: string | null;
    two_factor_enabled: boolean;
};

type ArtistStats = {
    reservations_count: number;
    avg_rating: number;
    followers_count: number;
    generated_revenue: number;
} | null;

type ActivityItem = {
    type: string;
    title: string;
    description: string;
    date: string | null;
};

type TransactionItem = {
    id: string;
    type: string;
    amount: number;
    commission: number | null;
    status: string;
    date: string | null;
};

type ContentItem = {
    id: string;
    title: string;
    published: boolean;
};

type ReviewItem = {
    id: string;
    target_user_id: string;
    rating: number;
    comment?: string | null;
    is_reported?: boolean;
    date: string | null;
};

type SessionItem = {
    id: string;
    ip?: string | null;
    device?: string | null;
    last_activity_at?: string | null;
};

type Props = {
    user: UserPayload;
    artistStats: ArtistStats;
    activity: ActivityItem[];
    transactions: TransactionItem[];
    clientFinancialDetails: {
        payments: Array<{
            id: string;
            reservation_id?: string | null;
            reservation_number?: string | null;
            amount: number;
            currency?: string | null;
            method?: string | null;
            provider_ref?: string | null;
            status: string;
            paid_at?: string | null;
            created_at?: string | null;
        }>;
        reservations: Array<{
            id: string;
            reservation_number?: string | null;
            artist_name?: string | null;
            service_title?: string | null;
            status: string;
            scheduled_at?: string | null;
            total_amount: number;
            commission_amount: number;
            artist_earnings: number;
            created_at?: string | null;
        }>;
        totals: {
            payments_total: number;
            reservations_total: number;
            commissions_total: number;
        };
    };
    artistEarningsReport: {
        summary: {
            gross_revenue: number;
            platform_commissions: number;
            net_earnings: number;
            paid_withdrawals: number;
            pending_withdrawals: number;
        };
        earnings_by_month: Array<{
            month: string;
            revenue: number;
            commissions: number;
            net: number;
        }>;
        reservation_earnings: Array<{
            id: string;
            reservation_number?: string | null;
            client_name: string;
            service_title?: string | null;
            status: string;
            total_amount: number;
            commission_amount: number;
            artist_earnings: number;
            scheduled_at?: string | null;
            created_at?: string | null;
        }>;
        withdrawals: Array<{
            id: string;
            amount: number;
            fee: number;
            status: string;
            requested_at?: string | null;
            processed_at?: string | null;
            created_at?: string | null;
        }>;
    };
    contents: {
        albums: ContentItem[];
        videos: ContentItem[];
        services: ContentItem[];
        tracks: ContentItem[];
    };
    reviews: {
        given: ReviewItem[];
        received: ReviewItem[];
    };
    security: {
        sessions: SessionItem[];
        failed_attempts: number;
        password_change_logs: string[];
        active_sessions_count: number;
    };
};

const statusMap: Record<string, string> = {
    active: 'Actif',
    suspended: 'Suspendu',
    pending: 'En attente',
    banned: 'Banni',
};

export default function Show({ user, artistStats, activity, transactions, clientFinancialDetails, artistEarningsReport, contents, reviews, security }: Props) {
    return (
        <AdminLayout title={`Utilisateur - ${user.full_name}`} subtitle="Details complets du compte utilisateur.">
            <Head title={`Admin - Utilisateur ${user.full_name}`} />

            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline">
                        <Link href={`/admin/users/${user.id}/edit`}>Modifier</Link>
                    </Button>
                    <Button variant="outline" onClick={() => router.post(`/admin/users/${user.id}/activate`)}>Activer</Button>
                    <Button variant="outline" onClick={() => router.post(`/admin/users/${user.id}/suspend`)}>Suspendre</Button>
                    <Button variant="outline" onClick={() => router.post(`/admin/users/${user.id}/ban`)}>Bannir</Button>
                    <Button variant="destructive" onClick={() => router.delete(`/admin/users/${user.id}`)}>Supprimer</Button>
                    <Button variant="outline" onClick={() => router.post(`/admin/users/${user.id}/impersonate`)}>Se connecter en tant que</Button>
                    <Button variant="ghost" asChild>
                        <Link href="/admin/users">Retour liste</Link>
                    </Button>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
                        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                        <TabsTrigger value="activity">Activite</TabsTrigger>
                        <TabsTrigger value="transactions">Transactions</TabsTrigger>
                        <TabsTrigger value="contents">Contenus</TabsTrigger>
                        <TabsTrigger value="reviews">Avis</TabsTrigger>
                        <TabsTrigger value="security">Securite</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations personnelles</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <p><span className="font-medium">Nom:</span> {user.full_name}</p>
                                <p>
                                    <span className="font-medium">Email:</span> {user.email}{' '}
                                    {user.email_verified ? <Badge variant="secondary">Verifie</Badge> : <Badge variant="outline">Non verifie</Badge>}
                                </p>
                                <p><span className="font-medium">Telephone:</span> {user.phone ?? '-'}</p>
                                <p><span className="font-medium">Ville:</span> {user.city ?? '-'}</p>
                                <p><span className="font-medium">Date naissance:</span> {user.date_of_birth ?? '-'}</p>
                                <p><span className="font-medium">Genre:</span> {user.gender ?? '-'}</p>
                                <p><span className="font-medium">Type:</span> {user.type}</p>
                                <p><span className="font-medium">Statut:</span> <Badge>{statusMap[user.status] ?? user.status}</Badge></p>
                                <p><span className="font-medium">Inscription:</span> {user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</p>
                                <p><span className="font-medium">Derniere connexion:</span> {user.last_connection_at ? new Date(user.last_connection_at).toLocaleString() : '-'}</p>
                            </CardContent>
                        </Card>

                        {artistStats ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistiques artiste</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                    <p><span className="font-medium">Reservations:</span> {artistStats.reservations_count}</p>
                                    <p><span className="font-medium">Note moyenne:</span> {artistStats.avg_rating}/5</p>
                                    <p><span className="font-medium">Abonnes:</span> {artistStats.followers_count}</p>
                                    <p><span className="font-medium">Revenus:</span> {Math.round(artistStats.generated_revenue).toLocaleString()} FCFA</p>
                                </CardContent>
                            </Card>
                        ) : null}
                    </TabsContent>

                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle>Timeline activite</CardTitle>
                                <CardDescription>Connexions, reservations, achats et publications.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {activity.map((item, index) => (
                                    <div key={`${item.type}-${index}`} className="rounded border p-3">
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                        <p className="text-xs text-muted-foreground">{item.date ? new Date(item.date).toLocaleString() : '-'}</p>
                                    </div>
                                ))}
                                {activity.length === 0 ? <p className="text-sm text-muted-foreground">Aucune activite.</p> : null}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="transactions">
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Historique transactions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {transactions.map((transaction) => (
                                        <div key={transaction.id} className="rounded border p-3 text-sm">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <p className="font-medium">{transaction.type}</p>
                                                <Badge variant="outline">{transaction.status}</Badge>
                                            </div>
                                            <p>Montant: {Math.round(transaction.amount).toLocaleString()} FCFA</p>
                                            <p>Commission: {transaction.commission !== null ? `${Math.round(transaction.commission).toLocaleString()} FCFA` : '-'}</p>
                                            <p className="text-muted-foreground">{transaction.date ? new Date(transaction.date).toLocaleString() : '-'}</p>
                                        </div>
                                    ))}
                                    {transactions.length === 0 ? <p className="text-sm text-muted-foreground">Aucune transaction.</p> : null}
                                </CardContent>
                            </Card>

                            {user.type === 'client' ? (
                                <>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Details client - Paiements</CardTitle>
                                            <CardDescription>
                                                Total paye: {Math.round(clientFinancialDetails.totals.payments_total).toLocaleString()} FCFA
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {clientFinancialDetails.payments.map((payment) => (
                                                <div key={payment.id} className="rounded border p-3 text-sm">
                                                    <div className="mb-1 flex items-center justify-between gap-2">
                                                        <p className="font-medium">{payment.reservation_number || payment.id}</p>
                                                        <Badge variant="outline">{payment.status}</Badge>
                                                    </div>
                                                    <p>Montant: {Math.round(payment.amount).toLocaleString()} {payment.currency || 'FCFA'}</p>
                                                    <p>Methode: {payment.method || '-'}</p>
                                                    <p className="text-muted-foreground">{payment.created_at ? new Date(payment.created_at).toLocaleString() : '-'}</p>
                                                </div>
                                            ))}
                                            {clientFinancialDetails.payments.length === 0 ? <p className="text-sm text-muted-foreground">Aucun paiement client.</p> : null}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Details client - Reservations</CardTitle>
                                            <CardDescription>
                                                Total reservations: {Math.round(clientFinancialDetails.totals.reservations_total).toLocaleString()} FCFA - Commissions:{' '}
                                                {Math.round(clientFinancialDetails.totals.commissions_total).toLocaleString()} FCFA
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {clientFinancialDetails.reservations.map((reservation) => (
                                                <div key={reservation.id} className="rounded border p-3 text-sm">
                                                    <div className="mb-1 flex items-center justify-between gap-2">
                                                        <p className="font-medium">{reservation.reservation_number || reservation.id}</p>
                                                        <Badge variant="outline">{reservation.status}</Badge>
                                                    </div>
                                                    <p>Artiste: {reservation.artist_name || '-'}</p>
                                                    <p>Service: {reservation.service_title || '-'}</p>
                                                    <p>Total: {Math.round(reservation.total_amount).toLocaleString()} FCFA</p>
                                                    <p>Commission: {Math.round(reservation.commission_amount).toLocaleString()} FCFA</p>
                                                </div>
                                            ))}
                                            {clientFinancialDetails.reservations.length === 0 ? <p className="text-sm text-muted-foreground">Aucune reservation client.</p> : null}
                                        </CardContent>
                                    </Card>
                                </>
                            ) : null}

                            {user.type === 'artist' ? (
                                <>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Rapport de gains artiste</CardTitle>
                                            <CardDescription>
                                                Net: {Math.round(artistEarningsReport.summary.net_earnings).toLocaleString()} FCFA - Commissions:{' '}
                                                {Math.round(artistEarningsReport.summary.platform_commissions).toLocaleString()} FCFA
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5 text-sm">
                                            <div className="rounded border p-3">
                                                <p className="text-muted-foreground">Brut</p>
                                                <p className="font-semibold">{Math.round(artistEarningsReport.summary.gross_revenue).toLocaleString()} FCFA</p>
                                            </div>
                                            <div className="rounded border p-3">
                                                <p className="text-muted-foreground">Commissions</p>
                                                <p className="font-semibold">{Math.round(artistEarningsReport.summary.platform_commissions).toLocaleString()} FCFA</p>
                                            </div>
                                            <div className="rounded border p-3">
                                                <p className="text-muted-foreground">Net</p>
                                                <p className="font-semibold">{Math.round(artistEarningsReport.summary.net_earnings).toLocaleString()} FCFA</p>
                                            </div>
                                            <div className="rounded border p-3">
                                                <p className="text-muted-foreground">Retraits payes</p>
                                                <p className="font-semibold">{Math.round(artistEarningsReport.summary.paid_withdrawals).toLocaleString()} FCFA</p>
                                            </div>
                                            <div className="rounded border p-3">
                                                <p className="text-muted-foreground">Retraits en attente</p>
                                                <p className="font-semibold">{Math.round(artistEarningsReport.summary.pending_withdrawals).toLocaleString()} FCFA</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Historique gains par reservation</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {artistEarningsReport.reservation_earnings.map((earning) => (
                                                <div key={earning.id} className="rounded border p-3 text-sm">
                                                    <div className="mb-1 flex items-center justify-between gap-2">
                                                        <p className="font-medium">{earning.reservation_number || earning.id}</p>
                                                        <Badge variant="outline">{earning.status}</Badge>
                                                    </div>
                                                    <p>Client: {earning.client_name}</p>
                                                    <p>Service: {earning.service_title || '-'}</p>
                                                    <p>Brut: {Math.round(earning.total_amount).toLocaleString()} FCFA</p>
                                                    <p>Commission: {Math.round(earning.commission_amount).toLocaleString()} FCFA - Net: {Math.round(earning.artist_earnings).toLocaleString()} FCFA</p>
                                                </div>
                                            ))}
                                            {artistEarningsReport.reservation_earnings.length === 0 ? <p className="text-sm text-muted-foreground">Aucun gain de reservation.</p> : null}
                                        </CardContent>
                                    </Card>
                                </>
                            ) : null}
                        </div>
                    </TabsContent>

                    <TabsContent value="contents">
                        <div className="grid gap-4 xl:grid-cols-2">
                            {([
                                ['Albums', contents.albums],
                                ['Videos', contents.videos],
                                ['Services', contents.services],
                                ['Pistes', contents.tracks],
                            ] as Array<[string, ContentItem[]]>).map(([title, rows]) => (
                                <Card key={title}>
                                    <CardHeader>
                                        <CardTitle>{title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {rows.map((row) => (
                                            <div key={row.id} className="flex items-center justify-between rounded border p-2 text-sm">
                                                <span>{row.title}</span>
                                                <Badge variant={row.published ? 'secondary' : 'outline'}>{row.published ? 'Publie' : 'Non publie'}</Badge>
                                            </div>
                                        ))}
                                        {rows.length === 0 ? <p className="text-sm text-muted-foreground">Aucun element.</p> : null}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews">
                        <div className="grid gap-4 xl:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Avis donnes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {reviews.given.map((review) => (
                                        <div key={review.id} className="rounded border p-3 text-sm">
                                            <p>Note: <span className="font-medium">{review.rating}/5</span></p>
                                            <p className="text-muted-foreground">{review.comment || '-'}</p>
                                        </div>
                                    ))}
                                    {reviews.given.length === 0 ? <p className="text-sm text-muted-foreground">Aucun avis donne.</p> : null}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Avis recus</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {reviews.received.map((review) => (
                                        <div key={review.id} className="rounded border p-3 text-sm">
                                            <div className="mb-1 flex items-center justify-between">
                                                <p>Note: <span className="font-medium">{review.rating}/5</span></p>
                                                {review.is_reported ? <Badge variant="destructive">Signale</Badge> : null}
                                            </div>
                                            <p className="text-muted-foreground">{review.comment || '-'}</p>
                                        </div>
                                    ))}
                                    {reviews.received.length === 0 ? <p className="text-sm text-muted-foreground">Aucun avis recu.</p> : null}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Securite</CardTitle>
                                <CardDescription>Sessions, tentatives echouees et 2FA.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-sm">
                                    <div className="rounded border p-3">
                                        <p className="text-muted-foreground">Sessions actives</p>
                                        <p className="text-lg font-semibold">{security.active_sessions_count}</p>
                                    </div>
                                    <div className="rounded border p-3">
                                        <p className="text-muted-foreground">Tentatives echouees</p>
                                        <p className="text-lg font-semibold">{security.failed_attempts}</p>
                                    </div>
                                    <div className="rounded border p-3">
                                        <p className="text-muted-foreground">2FA</p>
                                        <p className="text-lg font-semibold">{user.two_factor_enabled ? 'Active' : 'Inactive'}</p>
                                    </div>
                                    <div className="rounded border p-3">
                                        <p className="text-muted-foreground">Logs mdp</p>
                                        <p className="text-lg font-semibold">{security.password_change_logs.length}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {security.sessions.map((session) => (
                                        <div key={session.id} className="flex flex-wrap items-center justify-between gap-2 rounded border p-2 text-sm">
                                            <span>{session.ip ?? 'IP inconnue'}</span>
                                            <span className="text-muted-foreground">{session.device ? session.device.slice(0, 90) : 'Device inconnu'}</span>
                                            <span className="text-muted-foreground">{session.last_activity_at ? new Date(session.last_activity_at).toLocaleString() : '-'}</span>
                                            <Button variant="outline" size="sm">Deconnecter</Button>
                                        </div>
                                    ))}
                                    {security.sessions.length === 0 ? <p className="text-sm text-muted-foreground">Aucune session.</p> : null}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
