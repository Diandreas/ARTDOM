import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    ArrowUpRight,
    Bell,
    CheckCircle2,
    Clock,
    DollarSign,
    Music,
    Play as PlayIcon,
    ShieldAlert,
    TrendingUp,
    Users,
    Wallet,
    AlertCircle,
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
        new: { last_24h: number; last_7d: number; last_30d: number };
    };
    artists: { active: number; suspended: number };
    likes: { tracks: number; videos: number };
    revenue: { day: number; week: number; month: number; year: number; total: number };
    commissions: { day: number; week: number; month: number; year: number; total: number };
    reservations: { confirmed: number; pending: number; completed: number };
    contents: { albums: number; videos: number; courses: number };
    reports_pending: number;
    tickets: { open: number; in_progress: number };
};

type RevenueCurvePoint = { day: string; reservations: number; sales: number; subscriptions: number; total: number };
type SignupBarPoint = { day: string; clients: number; artists: number };
type CategoryPoint = { category: string; count: number };
type ConversionFunnel = { visitors: number | null; signups: number; buyers: number; signup_rate: number | null; buyer_rate_from_signup: number; tracking_enabled: boolean };
type Charts = { revenue_curve: RevenueCurvePoint[]; signups_bar: SignupBarPoint[]; category_donut: CategoryPoint[]; conversion_funnel: ConversionFunnel; days: string[] };
type TimelineEvent = { type: string; title: string; description: string; occurred_at: string };
type Alerts = { urgent_reports: number; withdrawals_pending_over_48h: number; tickets_without_response_over_24h: number };
type QuickAction = { label: string; description: string; href: string };
type TopStat = { id: string; title: string; likes?: number; plays?: number };

type Props = {
    kpis: Kpis;
    charts: Charts;
    activityTimeline: TimelineEvent[];
    criticalAlerts: Alerts;
    quickActions: QuickAction[];
    topStats: { liked_tracks: TopStat[]; played_tracks: TopStat[]; liked_videos: TopStat[] };
    financialStats: { payouts_paid: number; pending_payouts: number; total_commissions: number };
};

const formatMoney = (value: number): string => `${Math.round(value).toLocaleString()} FCFA`;

function StatCard({ label, value, sub, icon: Icon, trend, color = 'default' }: {
    label: string; value: string | number; sub?: string; icon: any; trend?: number; color?: 'default' | 'green' | 'amber' | 'primary';
}) {
    const colors = {
        default: 'text-foreground',
        green: 'text-green-600',
        amber: 'text-amber-600',
        primary: 'text-primary',
    };
    return (
        <Card className="relative overflow-hidden">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
                        <p className={`text-2xl font-bold truncate ${colors[color]}`}>{value}</p>
                        {sub && <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>}
                    </div>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 ml-3`}>
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                </div>
                {trend !== undefined && (
                    <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        <ArrowUpRight className={`h-3 w-3 ${trend < 0 ? 'rotate-180' : ''}`} />
                        <span>{trend >= 0 ? '+' : ''}{trend}% vs last week</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function MiniBar({ value, max, color = 'bg-primary' }: { value: number; max: number; color?: string }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
        </div>
    );
}

export default function Dashboard({ kpis, charts, activityTimeline, criticalAlerts, quickActions, topStats, financialStats }: Props) {
    const { t } = useAppLocale();
    const maxRevenue = Math.max(...charts.revenue_curve.map((p) => p.total), 1);
    const maxSignup = Math.max(...charts.signups_bar.map((p) => p.clients + p.artists), 1);

    const totalAlerts = criticalAlerts.urgent_reports + criticalAlerts.withdrawals_pending_over_48h +
        criticalAlerts.tickets_without_response_over_24h;

    return (
        <AdminLayout title={t('Dashboard')} subtitle={t('Global real-time monitoring of all modules.')}>
            <Head title={t('Main admin dashboard')} />

            <div className="space-y-6">

                {/* Alert banner */}
                {totalAlerts > 0 && (
                    <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                        <p className="text-sm font-medium text-destructive">
                            {totalAlerts} {t('action(s) require your attention')}
                        </p>
                        <div className="ml-auto flex flex-wrap gap-2">
                            {criticalAlerts.urgent_reports > 0 && (
                                <Badge variant="destructive" className="text-xs">{criticalAlerts.urgent_reports} {t('reports')}</Badge>
                            )}
                            {criticalAlerts.withdrawals_pending_over_48h > 0 && (
                                <Badge variant="outline" className="text-xs">{criticalAlerts.withdrawals_pending_over_48h} {t('withdrawals +48h')}</Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* KPI Grid */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label={t('Total users')} value={kpis.users.total} sub={`${kpis.users.clients} clients · ${kpis.users.artists} artistes`} icon={Users} />
                    <StatCard label={t('New (24h / 7d)')} value={`${kpis.users.new.last_24h} / ${kpis.users.new.last_7d}`} sub={`${kpis.users.new.last_30d} ce mois`} icon={TrendingUp} color="primary" />
                    <StatCard label={t('Revenue this month')} value={formatMoney(kpis.revenue.month)} sub={`Aujourd'hui: ${formatMoney(kpis.revenue.day)}`} icon={DollarSign} color="green" />
                    <StatCard label={t('Reservations')} value={kpis.reservations.confirmed} sub={`${kpis.reservations.pending} en attente · ${kpis.reservations.completed} terminées`} icon={CheckCircle2} color="amber" />
                </div>

                {/* Financial summary */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="border-green-200 bg-green-50/40">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                                    <Wallet className="h-4 w-4 text-green-700" />
                                </div>
                                <p className="text-xs font-medium text-green-700">{t('Total Payouts Paid')}</p>
                            </div>
                            <p className="text-xl font-bold text-green-800">{formatMoney(financialStats.payouts_paid)}</p>
                            <p className="text-[10px] text-green-600 mt-1 italic">{t('Total amount paid to artists')}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-amber-200 bg-amber-50/40">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                                    <Clock className="h-4 w-4 text-amber-700" />
                                </div>
                                <p className="text-xs font-medium text-amber-700">{t('Pending Payouts')}</p>
                            </div>
                            <p className="text-xl font-bold text-amber-800">{financialStats.pending_payouts} {t('requests')}</p>
                            <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> {t('To be processed')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                </div>
                                <p className="text-xs font-medium text-primary">{t('Platform commissions')}</p>
                            </div>
                            <p className="text-xl font-bold">{formatMoney(financialStats.total_commissions)}</p>
                            <p className="text-[10px] text-muted-foreground mt-1 italic">{t('Net revenue generated by ARTDOM fees')}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                {t('Revenue curve')}
                            </CardTitle>
                            <CardDescription className="text-xs">{t('Reservations + Sales + Subscriptions (7d)')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {charts.revenue_curve.map((point) => (
                                <div key={point.day} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span className="font-medium text-foreground">{point.day}</span>
                                        <span className="font-semibold text-primary">{formatMoney(point.total)}</span>
                                    </div>
                                    <MiniBar value={point.total} max={maxRevenue} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                {t('Client vs artist signups')}
                            </CardTitle>
                            <CardDescription className="text-xs">{t('Per day (7d)')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {charts.signups_bar.map((point) => {
                                const total = point.clients + point.artists;
                                const clientPct = maxSignup > 0 ? (point.clients / maxSignup) * 100 : 0;
                                const artistPct = maxSignup > 0 ? (point.artists / maxSignup) * 100 : 0;
                                return (
                                    <div key={point.day} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="font-medium text-foreground">{point.day}</span>
                                            <span>
                                                <span className="text-primary font-semibold">{point.clients}C</span>
                                                {' · '}
                                                <span className="text-amber-600 font-semibold">{point.artists}A</span>
                                            </span>
                                        </div>
                                        <div className="flex h-1.5 rounded-full overflow-hidden bg-muted">
                                            <div className="bg-primary h-full transition-all" style={{ width: `${clientPct}%` }} />
                                            <div className="bg-amber-400 h-full transition-all" style={{ width: `${artistPct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Top content + Activity */}
                <div className="grid gap-4 xl:grid-cols-3">
                    {/* Most liked tracks */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Music className="h-4 w-4 text-primary" /> {t('Most liked tracks')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {topStats.liked_tracks.length > 0 ? topStats.liked_tracks.map((track, i) => (
                                <div key={track.id} className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-muted-foreground w-4">{i + 1}</span>
                                    <span className="flex-1 text-xs truncate">{track.title}</span>
                                    <Badge variant="secondary" className="text-[9px] px-1.5 shrink-0">{track.likes} ♥</Badge>
                                </div>
                            )) : <p className="text-xs text-muted-foreground text-center py-4">{t('No data')}</p>}
                        </CardContent>
                    </Card>

                    {/* Most played tracks */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <PlayIcon className="h-4 w-4 text-primary" /> {t('Most played tracks')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {topStats.played_tracks.length > 0 ? topStats.played_tracks.map((track, i) => (
                                <div key={track.id} className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-muted-foreground w-4">{i + 1}</span>
                                    <span className="flex-1 text-xs truncate">{track.title}</span>
                                    <Badge variant="outline" className="text-[9px] px-1.5 shrink-0">{track.plays} ▶</Badge>
                                </div>
                            )) : <p className="text-xs text-muted-foreground text-center py-4">{t('No data')}</p>}
                        </CardContent>
                    </Card>

                    {/* Recent activity */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">{t('Recent activity')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {activityTimeline.slice(0, 5).map((item) => (
                                <div key={`${item.type}-${item.occurred_at}`} className="flex gap-2 border-l-2 border-primary/30 pl-3 py-1">
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium leading-tight">{t(item.title)}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                                        <p className="text-[10px] text-muted-foreground/60">{new Date(item.occurred_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts + Quick actions */}
                <div className="grid gap-4 xl:grid-cols-2">
                    <Card className="border-destructive/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                {t('Critical alerts')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {[
                                { label: t('Urgent reports'), value: criticalAlerts.urgent_reports, icon: ShieldAlert, href: '/admin/reports', danger: true },
                                { label: t('Withdrawals pending > 48h'), value: criticalAlerts.withdrawals_pending_over_48h, icon: Bell, href: '/admin/withdrawals', danger: false },
                                { label: t('Tickets without response > 24h'), value: criticalAlerts.tickets_without_response_over_24h, icon: Clock, href: '/admin/tickets', danger: false },
                            ].map((alert) => {
                                const Icon = alert.icon;
                                return (
                                    <Link key={alert.label} href={alert.href} className="flex items-center justify-between rounded-lg border px-3 py-2.5 hover:bg-muted/50 transition-colors">
                                        <span className="flex items-center gap-2 text-sm">
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                            {alert.label}
                                        </span>
                                        <Badge variant={alert.danger && alert.value > 0 ? 'destructive' : 'outline'} className="text-xs">
                                            {alert.value}
                                        </Badge>
                                    </Link>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">{t('Quick shortcuts')}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            {quickActions.slice(0, 6).map((action) => (
                                <Link key={action.label} href={action.href}>
                                    <div className="group rounded-lg border border-primary/20 bg-primary/5 p-3 hover:bg-primary/10 transition-colors cursor-pointer h-full">
                                        <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{t(action.label)}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{t(action.description)}</p>
                                        <ArrowRight className="h-3 w-3 text-primary mt-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* FCM Campaign shortcut */}
                <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
                    <CardContent className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                                <Bell className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">{t('Push Notification Campaign')}</p>
                                <p className="text-xs text-muted-foreground">{t('Send a targeted push notification to your users via Firebase')}</p>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href="/admin/broadcast">
                                {t('Launch campaign')} <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
