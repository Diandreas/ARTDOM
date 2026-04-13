import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Bell,
    ChartBar,
    ChartLine,
    LifeBuoy,
    ShieldAlert,
    Users,
    Music,
    Play as PlayIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAppLocale } from '@/hooks/use-app-locale';
import AdminLayout from '@/layouts/admin-layout';

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
        suspended: number;
    };
    likes: {
        tracks: number;
        videos: number;
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

type TopStat = {
    id: string;
    title: string;
    likes?: number;
    plays?: number;
};

type Props = {
    kpis: Kpis;
    charts: Charts;
    activityTimeline: TimelineEvent[];
    criticalAlerts: Alerts;
    quickActions: QuickAction[];
    topStats: {
        liked_tracks: TopStat[];
        played_tracks: TopStat[];
        liked_videos: TopStat[];
    };
};

const formatMoney = (value: number): string => {
    return `${Math.round(value).toLocaleString()} FCFA`;
};

export default function Dashboard({
    kpis,
    charts,
    activityTimeline,
    criticalAlerts,
    quickActions,
    topStats,
}: Props) {
    const { t } = useAppLocale();
    const maxRevenue = Math.max(
        ...charts.revenue_curve.map((point) => point.total),
        1,
    );
    const maxSignup = Math.max(
        ...charts.signups_bar.map((point) => point.clients + point.artists),
        1,
    );
    const totalCategoryCount = charts.category_donut.reduce(
        (sum, item) => sum + item.count,
        0,
    );

    return (
        <AdminLayout
            title={t('Main dashboard')}
            subtitle={t('Global real-time monitoring of all modules.')}
        >
            <Head title={t('Main admin dashboard')} />

            <div className="space-y-8">
                {/* KPIs Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            {t('1.1 Real-time KPIs')}
                        </h2>
                        <Badge variant="secondary">{t('Live update')}</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>{t('Total users')}</CardDescription>
                                <CardTitle>{kpis.users.total}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                {t('Clients')}: {kpis.users.clients} - {t('Artists')}: {kpis.users.artists}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>{t('New signups')}</CardDescription>
                                <CardTitle>24h: {kpis.users.new.last_24h} - {t('7d')}: {kpis.users.new.last_7d}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                {t('30d')}: {kpis.users.new.last_30d}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>{t('Revenue')}</CardDescription>
                                <CardTitle>{formatMoney(kpis.revenue.month)}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                {t('Day')}: {formatMoney(kpis.revenue.day)} - {t('Week')}: {formatMoney(kpis.revenue.week)}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>{t('Reservations')}</CardDescription>
                                <CardTitle>{kpis.reservations.confirmed}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                {t('Pending')}: {kpis.reservations.pending} - {t('Completed')}: {kpis.reservations.completed}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Top Statistics Section */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Statistiques de Contenu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="py-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Music className="h-4 w-4" /> Musiques les plus aimées
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 py-3">
                                {topStats.liked_tracks.length > 0 ? topStats.liked_tracks.map((track) => (
                                    <div key={track.id} className="flex items-center justify-between border-b border-muted pb-1 last:border-0">
                                        <span className="text-[11px] font-medium truncate max-w-[140px]">{track.title}</span>
                                        <Badge variant="secondary" className="text-[9px] h-5 px-1.5">{track.likes} j'aime</Badge>
                                    </div>
                                )) : <p className="text-[10px] text-muted-foreground text-center py-2">Aucune donnée</p>}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="py-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <PlayIcon className="h-4 w-4" /> Musiques les plus écoutées
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 py-3">
                                {topStats.played_tracks.length > 0 ? topStats.played_tracks.map((track) => (
                                    <div key={track.id} className="flex items-center justify-between border-b border-muted pb-1 last:border-0">
                                        <span className="text-[11px] font-medium truncate max-w-[140px]">{track.title}</span>
                                        <Badge variant="outline" className="text-[9px] h-5 px-1.5">{track.plays} écoutes</Badge>
                                    </div>
                                )) : <p className="text-[10px] text-muted-foreground text-center py-2">Aucune donnée</p>}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="py-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <PlayIcon className="h-4 w-4" /> Vidéos les plus aimées
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 py-3">
                                {topStats.liked_videos.length > 0 ? topStats.liked_videos.map((video) => (
                                    <div key={video.id} className="flex items-center justify-between border-b border-muted pb-1 last:border-0">
                                        <span className="text-[11px] font-medium truncate max-w-[140px]">{video.title}</span>
                                        <Badge variant="secondary" className="text-[9px] h-5 px-1.5">{video.likes} j'aime</Badge>
                                    </div>
                                )) : <p className="text-[10px] text-muted-foreground text-center py-2">Aucune donnée</p>}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Charts Section */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">{t('1.2 Charts')}</h2>
                    <div className="grid gap-4 xl:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ChartLine className="h-4 w-4" />
                                    {t('Revenue curve')}
                                </CardTitle>
                                <CardDescription>{t('Reservations + Sales + Subscriptions (7d)')}</CardDescription>
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
                                    {t('Client vs artist signups')}
                                </CardTitle>
                                <CardDescription>{t('Per day (7d)')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {charts.signups_bar.map((point) => {
                                    const total = point.clients + point.artists;
                                    return (
                                        <div key={point.day} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span>{point.day}</span>
                                                <span>C: {point.clients} - A: {point.artists}</span>
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
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Activity and Alerts Section */}
                <section className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('1.3 Recent activity')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {activityTimeline.map((item) => (
                                <div key={`${item.type}-${item.occurred_at}`} className="rounded border p-3">
                                    <p className="text-sm font-medium">{t(item.title)}</p>
                                    <p className="text-xs text-muted-foreground">{item.description}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(item.occurred_at).toLocaleString()}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                {t('1.4 Critical alerts')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between rounded border p-3">
                                <span className="flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> {t('Urgent reports')}</span>
                                <Badge variant="destructive">{criticalAlerts.urgent_reports}</Badge>
                            </div>
                            <div className="flex items-center justify-between rounded border p-3">
                                <span className="flex items-center gap-2"><Bell className="h-4 w-4" /> {t('Withdrawals pending > 48h')}</span>
                                <Badge variant="outline">{criticalAlerts.withdrawals_pending_over_48h}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Quick Actions */}
                <section>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('1.5 Quick shortcuts')}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {quickActions.map((action) => (
                                <Card key={action.label} className="border-primary/20">
                                    <CardHeader>
                                        <CardTitle className="text-base">{t(action.label)}</CardTitle>
                                        <CardDescription>{t(action.description)}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href={action.href}>
                                                {t('Open')} <ArrowRight className="ml-2 h-4 w-4" />
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
