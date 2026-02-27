import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    global: {
        payments_completed_total: number;
        payments_completed_month: number;
        payments_completed_year: number;
        subscriptions_revenue_total: number;
        subscriptions_revenue_month: number;
        reservations_gross_total: number;
        platform_commissions_total: number;
        artists_earnings_total: number;
        withdrawals_paid_total: number;
        withdrawals_pending_total: number;
    };
    monthlyFlow: Array<{
        month: string;
        payments_total: number;
        subscriptions_total: number;
        reservations_gross: number;
        platform_commissions: number;
        artists_net: number;
        withdrawals_paid: number;
        total_flow: number;
    }>;
    topArtists: Array<{
        artist_id: string;
        artist_name: string;
        gross_revenue: number;
        commissions: number;
        net_earnings: number;
        reservations_count: number;
    }>;
};

const money = (value: number): string => `${Math.round(value).toLocaleString()} FCFA`;

export default function FinancialOverview({ global, monthlyFlow, topArtists }: Props) {
    const maxFlow = Math.max(...monthlyFlow.map((item) => item.total_flow), 1);

    return (
        <AdminLayout title="Statistiques financieres" subtitle="Vue globale de l'argent qui circule sur la plateforme.">
            <Head title="Admin - Statistiques financieres" />

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Paiements completes</CardDescription>
                            <CardTitle>{money(global.payments_completed_total)}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                            Mois: {money(global.payments_completed_month)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Abonnements</CardDescription>
                            <CardTitle>{money(global.subscriptions_revenue_total)}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                            Mois: {money(global.subscriptions_revenue_month)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>CA Reservations (brut)</CardDescription>
                            <CardTitle>{money(global.reservations_gross_total)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Commissions plateforme</CardDescription>
                            <CardTitle>{money(global.platform_commissions_total)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Gains artistes (nets)</CardDescription>
                            <CardTitle>{money(global.artists_earnings_total)}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                            Retraits payes: {money(global.withdrawals_paid_total)}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Flux mensuel (6 mois)</CardTitle>
                        <CardDescription>Paiements, abonnements, brut reservations, commissions, net artistes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {monthlyFlow.map((item) => (
                            <div key={item.month} className="rounded border p-3 text-sm">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="font-medium">{item.month}</span>
                                    <Badge variant="outline">{money(item.total_flow)}</Badge>
                                </div>
                                <div className="mb-2 h-2 rounded bg-muted">
                                    <div className="h-2 rounded bg-primary" style={{ width: `${(item.total_flow / maxFlow) * 100}%` }} />
                                </div>
                                <p>Paiements: {money(item.payments_total)} - Subscriptions: {money(item.subscriptions_total)}</p>
                                <p>Reservations brut: {money(item.reservations_gross)} - Commissions: {money(item.platform_commissions)}</p>
                                <p>Net artistes: {money(item.artists_net)} - Retraits payes: {money(item.withdrawals_paid)}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top artistes par gains nets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {topArtists.map((artist) => (
                            <div key={artist.artist_id} className="rounded border p-3 text-sm">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="font-medium">{artist.artist_name}</p>
                                    <Badge>{artist.reservations_count} reservations</Badge>
                                </div>
                                <p>Brut: {money(artist.gross_revenue)} - Commission: {money(artist.commissions)}</p>
                                <p>Net: {money(artist.net_earnings)}</p>
                            </div>
                        ))}
                        {topArtists.length === 0 ? <p className="text-sm text-muted-foreground">Aucune donnee artiste.</p> : null}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
