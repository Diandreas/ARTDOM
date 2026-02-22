import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import {
    AlertTriangle,
    ArrowRight,
    Bell,
    ChartBar,
    ChartLine,
    LifeBuoy,
    ShieldAlert,
    UserCheck2,
    Users,
} from 'lucide-react';

type Kpis = {
    users: {
        total: number;
        clients: number;
        artists: number;
        new: {
            last_24h: number;
            last_7d: number;
            last_30d: number;
        };
    };
    artists: {
        active: number;
        pending: number;
        suspended: number;
    };
    revenue: {
        day: number;
        week: number;
        month: number;
        year: number;
        total: number;
    };
    commissions: {
        day: number;
        week: number;
        month: number;
        year: number;
        total: number;
    };
    reservations: {
        confirmed: number;
        pending: number;
        completed: number;
    };
    contents: {
        albums: number;
        videos: number;
        courses: number;
    };
    reports_pending: number;
    tickets: {
        open: number;
        in_progress: number;
    };
};

type RevenueCurvePoint = {
    day: string;
    reservations: number;
    sales: number;
    subscriptions: number;
    total: number;
};

type SignupBarPoint = {
    day: string;
    clients: number;
    artists: number;
};

type CategoryPoint = {
    category: string;
    count: number;
};

type ConversionFunnel = {
    visitors: number | null;
    signups: number;
    buyers: number;
    signup_rate: number | null;
    buyer_rate_from_signup: number;
    tracking_enabled: boolean;
};

type Charts = {
    revenue_curve: RevenueCurvePoint[];
    signups_bar: SignupBarPoint[];
    category_donut: CategoryPoint[];
    conversion_funnel: ConversionFunnel;
    days: string[];
};

type TimelineEvent = {
    type: string;
    title: string;
    description: string;
    occurred_at: string;
};

type Alerts = {
    artists_pending_validation: number;
    urgent_reports: number;
    withdrawals_pending_over_48h: number;
    tickets_without_response_over_24h: number;
};

type QuickAction = {
    label: string;
    description: string;
    href: string;
};

type Props = {
    kpis: Kpis;
    charts: Charts;
    activityTimeline: TimelineEvent[];
    criticalAlerts: Alerts;
    quickActions: QuickAction[];
};

const formatMoney = (value: number): string => {
    return `${Math.round(value).toLocaleString()} FCFA`;
};

export default function Dashboard({ kpis, charts, activityTimeline, criticalAlerts, quickActions }: Props) {
    const maxRevenue = Math.max(...charts.revenue_curve.map((point) => point.total), 1);
    const maxSignup = Math.max(...charts.signups_bar.map((point) => point.clients + point.artists), 1);
    const totalCategoryCount = charts.category_donut.reduce((sum, item) => sum + item.count, 0);

    return (
        <AdminLayout
            title="Dashboard Principal"
            subtitle="Pilotage global en temps reel de tous les modules."
        >
            <Head title="Admin Dashboard Principal" />

            <div className="space-y-8">
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">1.1 KPIs Temps Reel</h2>
                        <Badge variant="secondary">Mise a jour live</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Utilisateurs totaux</CardDescription>
                                <CardTitle>{kpis.users.total}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                Clients: {kpis.users.clients} - Artistes: {kpis.users.artists}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Nouveaux inscrits</CardDescription>
                                <CardTitle>
                                    24h: {kpis.users.new.last_24h} - 7j: {kpis.users.new.last_7d}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                30 jours: {kpis.users.new.last_30d}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Artistes</CardDescription>
                                <CardTitle>{kpis.users.artists}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                Actifs: {kpis.artists.active} - En attente: {kpis.artists.pending} - Suspendus:{' '}
                                {kpis.artists.suspended}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Revenus</CardDescription>
                                <CardTitle>{formatMoney(kpis.revenue.month)}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                Jour: {formatMoney(kpis.revenue.day)} - Semaine: {formatMoney(kpis.revenue.week)}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Commissions plateforme</CardDescription>
                                <CardTitle>{formatMoney(kpis.commissions.total)}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                Mois: {formatMoney(kpis.commissions.month)}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Reservations</CardDescription>
                                <CardTitle>{kpis.reservations.confirmed}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                En attente: {kpis.reservations.pending} - Terminees: {kpis.reservations.completed}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Contenus publies</CardDescription>
                                <CardTitle>
                                    {kpis.contents.albums + kpis.contents.videos + kpis.contents.courses}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                Albums: {kpis.contents.albums} - Videos: {kpis.contents.videos} - Cours:{' '}
                                {kpis.contents.courses}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Signalements / Tickets</CardDescription>
                                <CardTitle>
                                    {kpis.reports_pending} / {kpis.tickets.open}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                Tickets en cours: {kpis.tickets.in_progress}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">1.2 Graphiques</h2>
                    <div className="grid gap-4 xl:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ChartLine className="h-4 w-4" />
                                    Courbe revenus
                                </CardTitle>
                                <CardDescription>Reservations + Ventes + Abonnements (7j)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {charts.revenue_curve.map((point) => (
                                    <div key={point.day} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span>{point.day}</span>
                                            <span>{formatMoney(point.total)}</span>
                                        </div>
                                        <div className="h-2 rounded bg-muted">
                                            <div
                                                className="h-2 rounded bg-primary"
                                                style={{ width: `${(point.total / maxRevenue) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ChartBar className="h-4 w-4" />
                                    Inscriptions clients vs artistes
                                </CardTitle>
                                <CardDescription>Par jour (7j)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {charts.signups_bar.map((point) => {
                                    const total = point.clients + point.artists;

                                    return (
                                        <div key={point.day} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span>{point.day}</span>
                                                <span>
                                                    C: {point.clients} - A: {point.artists}
                                                </span>
                                            </div>
                                            <div className="flex h-2 overflow-hidden rounded bg-muted">
                                                <div
                                                    className="bg-primary"
                                                    style={{ width: `${(point.clients / maxSignup) * 100}%` }}
                                                />
                                                <div
                                                    className="bg-secondary"
                                                    style={{ width: `${(point.artists / maxSignup) * 100}%` }}
                                                />
                                                {total === 0 ? <div className="w-full bg-muted" /> : null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Donut categories artistes</CardTitle>
                                <CardDescription>Repartition des categories principales</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {charts.category_donut.map((item) => (
                                    <div key={item.category} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="capitalize">{item.category}</span>
                                            <span>{item.count}</span>
                                        </div>
                                        <div className="h-2 rounded bg-muted">
                                            <div
                                                className="h-2 rounded bg-primary/80"
                                                style={{
                                                    width: `${totalCategoryCount > 0 ? (item.count / totalCategoryCount) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {charts.category_donut.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">Aucune categorie disponible.</p>
                                ) : null}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Taux conversion</CardTitle>
                                <CardDescription>Visiteurs - Inscrits - Acheteurs</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="rounded border p-3">
                                    <p className="text-muted-foreground">Visiteurs</p>
                                    <p className="text-lg font-semibold">
                                        {charts.conversion_funnel.visitors ?? 'Tracking non configure'}
                                    </p>
                                </div>
                                <div className="rounded border p-3">
                                    <p className="text-muted-foreground">Inscrits</p>
                                    <p className="text-lg font-semibold">{charts.conversion_funnel.signups}</p>
                                </div>
                                <div className="rounded border p-3">
                                    <p className="text-muted-foreground">Acheteurs</p>
                                    <p className="text-lg font-semibold">{charts.conversion_funnel.buyers}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Conversion inscrits vers acheteurs:{' '}
                                    {charts.conversion_funnel.buyer_rate_from_signup.toFixed(2)}%
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>1.3 Activite recente</CardTitle>
                            <CardDescription>
                                Inscriptions, reservations, signalements, retraits, avis.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {activityTimeline.map((item) => (
                                <div key={`${item.type}-${item.occurred_at}-${item.description}`} className="rounded border p-3">
                                    <p className="text-sm font-medium">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">{item.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(item.occurred_at).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                            {activityTimeline.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Aucune activite recente.</p>
                            ) : null}
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                1.4 Alertes critiques
                            </CardTitle>
                            <CardDescription>Elements a traiter en priorite.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between rounded border p-3">
                                <span className="flex items-center gap-2">
                                    <UserCheck2 className="h-4 w-4" />
                                    Artistes en attente validation
                                </span>
                                <Badge>{criticalAlerts.artists_pending_validation}</Badge>
                            </div>
                            <div className="flex items-center justify-between rounded border p-3">
                                <span className="flex items-center gap-2">
                                    <ShieldAlert className="h-4 w-4" />
                                    Signalements urgents
                                </span>
                                <Badge variant="destructive">{criticalAlerts.urgent_reports}</Badge>
                            </div>
                            <div className="flex items-center justify-between rounded border p-3">
                                <span className="flex items-center gap-2">
                                    <Bell className="h-4 w-4" />
                                    Retraits en attente &gt; 48h
                                </span>
                                <Badge variant="outline">{criticalAlerts.withdrawals_pending_over_48h}</Badge>
                            </div>
                            <div className="flex items-center justify-between rounded border p-3">
                                <span className="flex items-center gap-2">
                                    <LifeBuoy className="h-4 w-4" />
                                    Tickets sans reponse &gt; 24h
                                </span>
                                <Badge variant="outline">{criticalAlerts.tickets_without_response_over_24h}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <Card>
                        <CardHeader>
                            <CardTitle>1.5 Raccourcis rapides</CardTitle>
                            <CardDescription>Actions prioritaires sur les modules admin.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {quickActions.map((action) => (
                                <Card key={action.label} className="border-primary/20">
                                    <CardHeader>
                                        <CardTitle className="text-base">{action.label}</CardTitle>
                                        <CardDescription>{action.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href={action.href}>
                                                Ouvrir
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AdminLayout>
    );
}

